<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class DashboardController extends Controller
{
    private int $lowStockThreshold = 5;

    public function index(Request $request): Response
    {
        if (!$request->filled('start_date') || !$request->filled('end_date')) {
            $request->merge([
                'start_date' => now()->startOfMonth()->format('Y-m-d'),
                'end_date'   => now()->endOfMonth()->format('Y-m-d'),
            ]);
        }

        try {
            $user = $request->user();
            $user->loadMissing('branch');

            $isAdmin = $user->role === 'admin' || (method_exists($user, 'hasRole') && $user->hasRole('admin'));

            $dashboardData = $isAdmin 
                ? $this->getAdminDashboardData($request) 
                : $this->getCashierDashboardData($request, $user);

            return Inertia::render('Dashboard', array_merge([
                'isAdmin' => $isAdmin,
                'filters' => $request->only(['start_date', 'end_date', 'branch_id']),
            ], $dashboardData));

        } catch (Throwable $e) {
            Log::error('Failed to load dashboard data: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id'   => $request->user()?->id,
                'request'   => $request->all(),
            ]);

            return Inertia::render('Dashboard', [
                'error'              => 'Failed to load some dashboard data. Please try again later.',
                'isAdmin'            => $request->user()?->role === 'admin',
                'stats'              => [],
                'recentTransactions' => [],
                'lowStockProducts'   => [],
                'filters'            => $request->only(['start_date', 'end_date', 'branch_id']),
            ]);
        }
    }

    public function getMonitoringUpdates(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->loadMissing('branch');

            $isAdmin = $user->role === 'admin' || (method_exists($user, 'hasRole') && $user->hasRole('admin'));

            if ($isAdmin) {
                $recentTransactions = $this->getRecentTransactionsQuery($request)
                    ->latest()
                    ->limit(10)
                    ->get()
                    ->map(fn($trx) => $this->formatAdminTransaction($trx));

                $lowStockProducts = $this->getLowStockQuery()
                    ->get()
                    ->map(fn($p) => $this->formatLowStockProduct($p));

                return response()->json([
                    'success'            => true,
                    'recentTransactions' => $recentTransactions,
                    'lowStockProducts'   => $lowStockProducts,
                ]);
            }

            if (!$user->branch_id) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Access denied. User is not assigned to any branch.'
                ], 403);
            }

            $recentTransactions = Transaction::query()
                ->where('branch_id', $user->branch_id)
                ->when($request->filled('start_date') && $request->filled('end_date'), function ($query) use ($request) {
                    $query->whereBetween('created_at', [
                        $request->start_date . ' 00:00:00',
                        $request->end_date . ' 23:59:59'
                    ]);
                })
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($trx) => $this->formatCashierTransaction($trx));

            $localLowStock = Product::query()
                ->where('branch_id', $user->branch_id)
                ->where('stock', '<=', $this->lowStockThreshold)
                ->orderBy('stock', 'asc')
                ->limit(10)
                ->get(['name', 'stock']);

            return response()->json([
                'success'            => true,
                'recentTransactions' => $recentTransactions,
                'localLowStock'      => $localLowStock,
            ]);

        } catch (Throwable $e) {
            Log::error('Failed to fetch real-time monitoring data: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id'   => $request->user()?->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to refresh monitoring data.',
            ], 500);
        }
    }

    private function getAdminDashboardData(Request $request): array
    {
        return DB::transaction(function () use ($request) {
            $transactionQuery = $this->getRecentTransactionsQuery($request);

            $stats = [
                'total_branches'     => Branch::where('is_active', true)->count(),
                'total_transactions' => (clone $transactionQuery)->count(),
                'total_revenue'      => (float) (clone $transactionQuery)->sum('total_price'),
                'total_products'     => Product::count(),
            ];

            $branchPerformances = Branch::query()
                ->select('branches.id', 'branches.name')
                ->selectRaw('COUNT(transactions.id) as transactions_count')
                ->selectRaw('COALESCE(SUM(transactions.total_price), 0) as revenue')
                ->leftJoin('transactions', function ($join) use ($request) {
                    $join->on('branches.id', '=', 'transactions.branch_id');
                    if ($request->filled('start_date') && $request->filled('end_date')) {
                        $join->whereBetween('transactions.created_at', [
                            $request->start_date . ' 00:00:00',
                            $request->end_date . ' 23:59:59'
                        ]);
                    }
                })
                ->groupBy('branches.id', 'branches.name')
                ->orderByDesc('revenue')
                ->get();

            $lowStockProducts = $this->getLowStockQuery()
                ->get()
                ->map(fn($product) => $this->formatLowStockProduct($product));

            $recentTransactions = (clone $transactionQuery)
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($trx) => $this->formatAdminTransaction($trx));

            return [
                'stats'              => $stats,
                'branchPerformances' => $branchPerformances,
                'lowStockProducts'   => $lowStockProducts,
                'recentTransactions' => $recentTransactions,
            ];
        });
    }

    private function getCashierDashboardData(Request $request, $user): array
    {
        return DB::transaction(function () use ($request, $user) {
            $branchId = $user->branch_id;

            if (!$branchId) {
                return [
                    'shiftInfo' => [
                        'cashier_name' => $user->name,
                        'branch_name'  => 'No Branch',
                        'shift_start'  => '-',
                    ],
                    'stats' => [
                        'today_revenue'      => 0.0,
                        'today_transactions' => 0,
                        'available_products' => 0,
                    ],
                    'recentTransactions' => [],
                    'localLowStock'      => [],
                ];
            }

            $today = now()->format('Y-m-d');

            $shiftInfo = [
                'cashier_name' => $user->name,
                'branch_name'  => $user->branch?->name ?? 'Main Branch',
                'shift_start'  => $user->updated_at ? $user->updated_at->format('H:i') . ' WIB' : '08:00 WIB',
            ];

            $todayTransactionQuery = Transaction::query()
                ->where('branch_id', $branchId)
                ->whereDate('created_at', $today);

            $stats = [
                'today_revenue'      => (float) (clone $todayTransactionQuery)->sum('total_price'),
                'today_transactions' => (clone $todayTransactionQuery)->count(),
                'available_products' => Product::query()
                    ->where('branch_id', $branchId)
                    ->where('stock', '>', 0)
                    ->count(),
            ];

            $recentTransactions = Transaction::query()
                ->where('branch_id', $branchId)
                ->when($request->filled('start_date') && $request->filled('end_date'), function ($query) use ($request) {
                    $query->whereBetween('created_at', [
                        $request->start_date . ' 00:00:00',
                        $request->end_date . ' 23:59:59'
                    ]);
                })
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($trx) => $this->formatCashierTransaction($trx));

            $localLowStock = Product::query()
                ->where('branch_id', $branchId)
                ->where('stock', '<=', $this->lowStockThreshold)
                ->orderBy('stock', 'asc')
                ->limit(10)
                ->get(['name', 'stock']);

            return [
                'shiftInfo'          => $shiftInfo,
                'stats'              => $stats,
                'recentTransactions' => $recentTransactions,
                'localLowStock'      => $localLowStock,
            ];
        });
    }

    private function getRecentTransactionsQuery(Request $request)
    {
        $query = Transaction::query()->with(['branch:id,name', 'user:id,name']);

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        return $query;
    }

    private function getLowStockQuery()
    {
        return Product::query()
            ->with('branch:id,name')
            ->where('stock', '<=', $this->lowStockThreshold)
            ->orderBy('stock', 'asc')
            ->limit(10);
    }

    private function formatAdminTransaction($trx): array
    {
        return [
            'id'         => $trx->invoice_number ?? 'TRX-' . $trx->id,
            'branch'     => $trx->branch?->name ?? 'Branch Not Found',
            'cashier'    => $trx->user?->name ?? 'System Cashier',
            'amount'     => (float) $trx->total_price,
            'time'       => $trx->created_at ? $trx->created_at->diffForHumans() : '-',
            'created_at' => $trx->created_at ? $trx->created_at->toIso8601String() : null,
        ];
    }

    private function formatCashierTransaction($trx): array
    {
        return [
            'id'          => $trx->invoice_number ?? 'TRX-' . $trx->id,
            'time'        => $trx->created_at ? $trx->created_at->format('H:i') : '-',
            'items_count' => is_array($trx->items) ? count($trx->items) : 0,
            'total'       => (float) $trx->total_price,
            'method'      => 'Cash',
        ];
    }

    private function formatLowStockProduct($product): array
    {
        return [
            'name'        => $product->name,
            'branch_name' => $product->branch?->name ?? 'No Branch',
            'stock'       => $product->stock,
        ];
    }
}