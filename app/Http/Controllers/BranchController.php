<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Exception;

class BranchController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        try {
            $branches = Branch::query()
                ->withCount(['users', 'categories', 'products', 'transactions'])
                ->when($request->search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('code', 'like', "%{$search}%")
                          ->orWhere('phone', 'like', "%{$search}%")
                          ->orWhere('address', 'like', "%{$search}%");
                    });
                })
                ->latest()
                ->paginate(10)
                ->withQueryString();

            return Inertia::render('Admin/Branches/Index', [
                'branches' => $branches,
                'filters'  => $request->only(['search']),
            ]);
        } catch (Exception $e) {
            Log::error('Gagal mengambil data cabang: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return back()->with('error', 'Gagal memuat data cabang. Silakan coba lagi.');
        }
    }

    public function show(Request $request, Branch $branch): Response|RedirectResponse
    {
        try {
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $applyDateFilter = function ($query) use ($startDate, $endDate) {
                if ($startDate && $endDate) {
                    $query->whereBetween('created_at', [
                        $startDate . ' 00:00:00',
                        $endDate . ' 23:59:59',
                    ]);
                } elseif ($startDate) {
                    $query->whereDate('created_at', '>=', $startDate);
                } elseif ($endDate) {
                    $query->whereDate('created_at', '<=', $endDate);
                }
            };

            $branch->load([
                'users' => function ($query) use ($applyDateFilter) {
                    $applyDateFilter($query);
                    $query->latest()->take(10);
                },
                'categories' => function ($query) use ($applyDateFilter) {
                    $applyDateFilter($query);
                    $query->withCount('products')->latest()->take(10);
                },
                'products' => function ($query) use ($applyDateFilter) {
                    $applyDateFilter($query);
                    $query->latest()->take(10);
                },
                'transactions' => function ($query) use ($applyDateFilter) {
                    $applyDateFilter($query);
                    $query->latest()->take(10);
                },
            ]);

            $branch->loadCount(['users', 'categories', 'products', 'transactions']);

            $filteredUsersCount = $branch->users()->tap($applyDateFilter)->count();
            $filteredCategoriesCount = $branch->categories()->tap($applyDateFilter)->count();
            $filteredProductsCount = $branch->products()->tap($applyDateFilter)->count();
            $filteredTransactionsCount = $branch->transactions()->tap($applyDateFilter)->count();

            $lowStockThreshold = 5;
            $lowStockProducts = $branch->products()
                ->where('stock', '<=', $lowStockThreshold)
                ->orderBy('stock', 'asc')
                ->get();

            $txQuery = $branch->transactions();
            $applyDateFilter($txQuery);

            $summary = [
                'total_revenue'             => (clone $txQuery)->sum('total_price') ?? 0,
                'today_revenue'             => $branch->transactions()->whereDate('created_at', now()->today())->sum('total_price') ?? 0,
                'today_transactions'          => $branch->transactions()->whereDate('created_at', now()->today())->count(),
                'low_stock_count'             => $lowStockProducts->count(),
                'filtered_transactions_count' => (clone $txQuery)->count(),
            ];

            $branch->users_count        = $filteredUsersCount;
            $branch->categories_count   = $filteredCategoriesCount;
            $branch->products_count     = $filteredProductsCount;
            $branch->transactions_count = $filteredTransactionsCount;

            return Inertia::render('Admin/Branches/Detail', [
                'branch'           => $branch,
                'summary'          => $summary,
                'lowStockProducts' => $lowStockProducts,
                'filters'          => [
                    'start_date' => $startDate,
                    'end_date'   => $endDate,
                ],
            ]);
        } catch (Exception $e) {
            Log::error("Gagal memuat detail cabang ID {$branch->id}: " . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return back()->with('error', 'Gagal memuat detail cabang. Silakan coba lagi.');
        }
    }

    public function store(StoreBranchRequest $request): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $validated = $request->validated();

            $branch = Branch::create([
                'code'      => $validated['code'],
                'name'      => $validated['name'],
                'address'   => $validated['address'] ?? null,
                'phone'     => $validated['phone'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            DB::commit();

            return redirect()
                ->route('branches.index')
                ->with('success', 'Data cabang berhasil ditambahkan.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Gagal menyimpan data cabang: ' . $e->getMessage(), [
                'request' => $request->all(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat menyimpan data cabang. Silakan coba lagi.');
        }
    }

    public function update(UpdateBranchRequest $request, Branch $branch): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $validated = $request->validated();

            $branch->update([
                'code'      => $validated['code'],
                'name'      => $validated['name'],
                'address'   => $validated['address'] ?? null,
                'phone'     => $validated['phone'] ?? null,
                'is_active' => $validated['is_active'] ?? $branch->is_active,
            ]);

            DB::commit();

            return redirect()
                ->route('branches.index')
                ->with('success', 'Data cabang berhasil diperbarui.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error("Gagal memperbarui cabang ID {$branch->id}: " . $e->getMessage(), [
                'request' => $request->all(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat memperbarui data cabang. Silakan coba lagi.');
        }
    }

    public function destroy(Branch $branch): RedirectResponse
    {
        $branch->loadCount(['users', 'categories', 'products', 'transactions']);

        if ($branch->transactions_count > 0 || $branch->products_count > 0 || $branch->users_count > 0 || $branch->categories_count > 0) {
            return back()->with('error', 'Cabang tidak dapat dihapus karena masih memiliki data terikat (user, produk, atau transaksi).');
        }

        try {
            $branch->delete();

            return redirect()
                ->route('branches.index')
                ->with('success', 'Data cabang berhasil dihapus.');
        } catch (Exception $e) {
            Log::error("Gagal menghapus cabang ID {$branch->id}: " . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return back()->with('error', 'Terjadi kesalahan saat menghapus data cabang.');
        }
    }
}