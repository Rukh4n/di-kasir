<?php

namespace App\Http\Controllers;

use App\Exports\TransactionsExport;
use App\Http\Requests\StoreTransactionRequest;
use App\Models\Branch;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Exception;
use Throwable;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = $request->input('query', '');
            $startDate = $request->input('startDate', '');
            $endDate = $request->input('endDate', '');
            $branchId = $request->input('branch_id', '');

            $transactions = Transaction::with('branch');

            if (!empty($branchId)) {
                $transactions->where('branch_id', $branchId);
            }

            if (!empty($query)) {
                $transactions->where(function ($q) use ($query) {
                    $q->where('invoice_number', 'like', "%{$query}%")
                      ->orWhereJsonContains('items->name', $query);
                });
            }

            if (!empty($startDate)) {
                $transactions->whereDate('created_at', '>=', $startDate);
            }
            if (!empty($endDate)) {
                $transactions->whereDate('created_at', '<=', $endDate);
            }

            $transactions = $transactions->latest()->paginate(10)->withQueryString();
            $branches = Branch::select('id', 'name')->get();

            return Inertia::render('Transactions/Index', [
                'transactions' => $transactions,
                'branches'     => $branches,
                'filters' => [
                    'query'     => $query,
                    'startDate' => $startDate,
                    'endDate'   => $endDate,
                    'branch_id' => $branchId,
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal mengambil data transaksi: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Terjadi kesalahan saat mengambil data transaksi.');
        }
    }

    public function create()
    {
        try {
            $products = Product::select('id', 'code', 'name', 'price', 'stock')->get();

            return Inertia::render('Transactions/Create', [
                'products' => $products,
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat halaman tambah transaksi: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal memuat data produk.');
        }
    }

    public function store(StoreTransactionRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->find($item['id']);

                if (!$product) {
                    throw new Exception("Produk dengan ID {$item['id']} tidak ditemukan.");
                }

                if ($product->stock < $item['qty']) {
                    DB::rollBack();
                    return redirect()->back()->withErrors([
                        'stock' => "Stok produk {$product->name} tidak mencukupi (Tersedia: {$product->stock})."
                    ]);
                }

                $product->decrement('stock', $item['qty']);
            }

            $transaction = Transaction::create([
                'branch_id'      => auth()->user()->branch_id,
                'user_id'        => auth()->id(),
                'invoice_number' => 'INV-' . time(),
                'items'          => $validated['items'],
                'item_prices'    => collect($validated['items'])->map(function ($item) {
                    return $item['price'] * $item['qty'];
                })->toArray(),
                'total_price'    => $validated['total_price'],
                'cash_received'  => $validated['cash_received'],
                'change'         => $validated['change'],
            ]);

            DB::commit();

            return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil ditambahkan.');
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Gagal menyimpan transaksi: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'request' => $request->except(['_token']),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Terjadi kesalahan saat memproses transaksi. Silakan coba lagi.');
        }
    }

    public function searchProducts(Request $request)
    {
        try {
            $query = $request->input('query', '');

            $products = Product::where(function ($q) use ($query) {
                $q->where('code', 'like', "%{$query}%")
                  ->orWhere('name', 'like', "%{$query}%");
            })
            ->select('id', 'code', 'name', 'price', 'stock')
            ->get();

            return Inertia::render('Transactions/Create', [
                'products' => $products,
                'query'    => $query,
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal mencari produk: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal melakukan pencarian produk.');
        }
    }

    public function show(Transaction $transaction)
    {
        try {
            $transaction->load('branch');

            return Inertia::render('Transactions/Show', [
                'transaction' => $transaction,
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal menampilkan detail transaksi ID ' . $transaction->id . ': ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal menampilkan detail transaksi.');
        }
    }

    public function edit(Transaction $transaction)
    {
        try {
            return Inertia::render('Transactions/Edit', [
                'transaction' => $transaction,
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat halaman edit transaksi ID ' . $transaction->id . ': ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal memuat halaman edit transaksi.');
        }
    }

    public function update(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'items'         => 'required|array|min:1',
            'items.*.id'    => 'required|exists:products,id',
            'items.*.name'  => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.qty'   => 'required|integer|min:1',
            'total_price'   => 'required|numeric',
            'cash_received' => 'required|numeric|min:0',
            'change'        => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            $transaction->update([
                'items'         => $validated['items'],
                'item_prices'   => collect($validated['items'])->map(function ($item) {
                    return $item['price'] * $item['qty'];
                })->toArray(),
                'total_price'   => $validated['total_price'],
                'cash_received' => $validated['cash_received'],
                'change'        => $validated['change'],
            ]);

            DB::commit();

            return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil diperbarui.');
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Gagal memperbarui transaksi ID ' . $transaction->id . ': ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'request' => $request->except(['_token']),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal memperbarui transaksi. Silakan coba lagi.');
        }
    }

    public function destroy(Transaction $transaction)
    {
        DB::beginTransaction();

        try {
            if (is_array($transaction->items)) {
                foreach ($transaction->items as $item) {
                    if (isset($item['id'], $item['qty'])) {
                        $product = Product::lockForUpdate()->find($item['id']);
                        if ($product) {
                            $product->increment('stock', $item['qty']);
                        }
                    }
                }
            }

            $transaction->delete();

            DB::commit();

            return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil dihapus dan stok produk dikembalikan.');
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Gagal menghapus transaksi ID ' . $transaction->id . ': ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal menghapus transaksi. Silakan coba lagi.');
        }
    }

    public function export(Request $request)
    {
        try {
            $query = $request->input('query', '');
            $startDate = $request->input('startDate', '');
            $endDate = $request->input('endDate', '');

            return Excel::download(new TransactionsExport($query, $startDate, $endDate), 'transactions.xlsx');
        } catch (Throwable $e) {
            Log::error('Gagal mengeksport data transaksi: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal mengunduh berkas transaksi.');
        }
    }
}
