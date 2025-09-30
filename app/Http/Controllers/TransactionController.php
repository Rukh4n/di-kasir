<?php

namespace App\Http\Controllers;

use App\Exports\ProductExport;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TransactionsExport;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('query', '');
        $startDate = $request->input('startDate', '');
        $endDate = $request->input('endDate', '');

        $transactions = Transaction::query();

        if (!empty($query)) {
            $transactions->where(function($q) use ($query) {
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

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => [
                'query' => $query,
                'startDate' => $startDate,
                'endDate' => $endDate,
            ],
        ]);
    }

    public function create()
    {
        $products = Product::select('id', 'code', 'name', 'price', 'stock')->get();
        return Inertia::render('Transactions/Create', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.qty' => 'required|integer|min:1',
            'total_price' => 'required|numeric',
            'cash_received' => 'required|numeric|min:0',
            'change' => 'required|numeric',
        ]);

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['id']);
            if ($product->stock < $item['qty']) {
                return back()->withErrors(['stock' => "Stok produk {$product->name} tidak mencukupi."]);
            }
            $product->decrement('stock', $item['qty']);
        }

        $transaction = Transaction::create([
            'invoice_number' => 'INV-' . time(),
            'items' => $validated['items'],
            'item_prices' => collect($validated['items'])->map(function ($item) {
                return $item['price'] * $item['qty'];
            })->toArray(),
            'total_price' => $validated['total_price'],
            'cash_received' => $validated['cash_received'],
            'change' => $validated['change'],
        ]);

        return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil ditambahkan.');
    }

    public function searchProducts(Request $request)
    {
        $query = $request->input('query', '');
        $products = Product::where('code', 'like', "%{$query}%")
            ->orWhere('name', 'like', "%{$query}%")
            ->select('id', 'code', 'name', 'price', 'stock')
            ->get();

        return Inertia::render('Transactions/Create', [
            'products' => $products,
            'query' => $query,
        ]);
    }

    public function show(Transaction $transaction)
    {
        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    public function edit(Transaction $transaction)
    {
        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.qty' => 'required|integer|min:1',
            'total_price' => 'required|numeric',
            'cash_received' => 'required|numeric|min:0',
            'change' => 'required|numeric',
        ]);

        $transaction->update([
            'items' => $validated['items'],
            'item_prices' => collect($validated['items'])->map(function ($item) {
                return $item['price'] * $item['qty'];
            })->toArray(),
            'total_price' => $validated['total_price'],
            'cash_received' => $validated['cash_received'],
            'change' => $validated['change'],
        ]);

        return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil dihapus.');
    }

    // Fungsi export dengan filter
    public function export(Request $request)
    {
        $query = $request->input('query', '');
        $startDate = $request->input('startDate', '');
        $endDate = $request->input('endDate', '');

        return Excel::download(new TransactionsExport($query, $startDate, $endDate), 'transactions.xlsx');
    }
}
