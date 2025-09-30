<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::query();

        // Filter berdasarkan tanggal jika ada
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date])
                  ->orderBy('created_at', 'desc');
        } else {
            // Jika tidak ada filter, tampilkan 100 data terbaru
            $query->orderBy('created_at', 'desc')->limit(100);
        }

        $transactions = $query->get();

        return Inertia::render('Dashboard', [
            'transactions' => $transactions,
            'filters' => $request->only(['start_date', 'end_date']),
        ]);
    }
}
