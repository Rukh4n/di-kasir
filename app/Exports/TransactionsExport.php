<?php

namespace App\Exports;

use App\Models\Product;
use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TransactionsExport implements FromCollection, WithHeadings
{
    protected $query;
    protected $startDate;
    protected $endDate;

    public function __construct($query = '', $startDate = '', $endDate = '')
    {
        $this->query = $query;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        // Global scope secara otomatis memfilter branch untuk staff, dan meloloskan semua untuk admin
        $transactions = Transaction::with('branch');

        if (!empty($this->query)) {
            $transactions->where(function ($q) {
                $q->where('invoice_number', 'like', "%{$this->query}%")
                    ->orWhereJsonContains('items->name', $this->query);
            });
        }

        if (!empty($this->startDate)) {
            $transactions->whereDate('created_at', '>=', $this->startDate);
        }
        if (!empty($this->endDate)) {
            $transactions->whereDate('created_at', '<=', $this->endDate);
        }

        $data = collect();

        foreach ($transactions->get() as $transaction) {
            $items = is_array($transaction->items) ? $transaction->items : json_decode($transaction->items, true);
            
            foreach ($items as $item) {
                // Mengambil nama kategori produk secara dinamis berdasarkan ID produk dalam item JSON
                $categoryName = '-';
                if (isset($item['id'])) {
                    $product = Product::with('category')->find($item['id']);
                    if ($product && $product->category) {
                        $categoryName = $product->category->name;
                    }
                }

                $data->push([
                    'id'             => $transaction->id,
                    'branch_name'    => $transaction->branch ? $transaction->branch->name : '-',
                    'invoice_number' => $transaction->invoice_number,
                    'category_name'  => $categoryName,
                    'item_name'      => $item['name'],
                    'item_qty'       => $item['qty'],
                    'item_price'     => $item['price'],
                    'total_price'    => $item['price'] * $item['qty'],
                    'cash_received'  => $transaction->cash_received,
                    'change'         => $transaction->change,
                    'created_at'     => $transaction->created_at,
                    'updated_at'     => $transaction->updated_at,
                ]);
            }
        }

        return $data;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Branch Name',
            'Invoice Number',
            'Category Name',
            'Item Name',
            'Quantity',
            'Item Price',
            'Total Price',
            'Cash Received',
            'Change',
            'Created At',
            'Updated At',
        ];
    }
}