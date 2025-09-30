<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function option()
    {
        $transactions = Transaction::all();
        
        return Inertia::render('Options/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:transactions,id',
        ]);

        Transaction::whereIn('id', $request->ids)->delete();

        return redirect()->route('options.index')->with('success', 'Transaksi berhasil dihapus.');
    }
}
