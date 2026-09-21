<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Branch;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function option(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = Transaction::query();

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

        $transactions = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Options/Index', [
            'transactions' => $transactions,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:transactions,id',
        ]);

        foreach ($request->ids as $id) {
            Transaction::find($id)?->delete();
        }

        return redirect()->route('options.index')->with('success', 'Transaksi berhasil dihapus.');
    }

    /**
     * Method untuk melakukan pembersihan/penghapusan data secara keseluruhan
     * berdasarkan tipe data dan opsi rentang tanggal (start_date & end_date).
     */
    public function destroyAll(Request $request, $type)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Helper function untuk menerapkan filter tanggal ke query builder
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

        switch ($type) {
            case 'categories':
                $query = Category::query();
                $applyDateFilter($query);
                $query->delete();
                break;

            case 'products':
                $query = Product::query();
                $applyDateFilter($query);
                $query->delete();
                break;

            case 'branches':
                $query = Branch::query();
                $applyDateFilter($query);
                $query->delete();
                break;

            case 'transactions':
                $query = Transaction::query();
                $applyDateFilter($query);
                $query->delete();
                break;

            default:
                abort(404, 'Tipe data tidak valid.');
        }

        return redirect()->back()->with('success', 'Data berhasil dibersihkan.');
    }
}