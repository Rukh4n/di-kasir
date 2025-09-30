<?php

namespace App\Exports;

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
        $transactions = Transaction::query();

        if (!empty($this->query)) {
            $transactions->where(function($q) {
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

        return $transactions->get()->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'invoice_number' => $transaction->invoice_number,
                'items' => json_encode($transaction->items),
                'item_prices' => json_encode($transaction->item_prices),
                'total_price' => $transaction->total_price,
                'cash_received' => $transaction->cash_received,
                'change' => $transaction->change,
                'created_at' => $transaction->created_at,
                'updated_at' => $transaction->updated_at,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'ID',
            'Invoice Number',
            'Items',
            'Item Prices',
            'Total Price',
            'Cash Received',
            'Change',
            'Created At',
            'Updated At',
        ];
    }
}
