<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProductExport implements FromCollection, WithHeadings
{
    protected $products;

    public function __construct($branchId = null)
    {
        $user = auth()->user();

        $query = Product::with(['category', 'branch']);

        // Logika filter berdasarkan role
        if ($user->role === 'admin') {
            if ($branchId) {
                $query->where('branch_id', $branchId);
            }
        } else {
            $query->where('branch_id', $user->branch_id);
        }

        $this->products = $query->get();
    }

    /**
     * Return all products as a collection
     */
    public function collection()
    {
        return $this->products->map(function ($product) {
            return [
                'ID' => $product->id,
                'Branch' => $product->branch->name ?? '-',
                'Code' => $product->code,
                'Name' => $product->name,
                'Category' => $product->category->name ?? '-',
                'Cost Price' => $product->cost_price,
                'Price' => $product->price,
                'Stock' => $product->stock,
                'Created At' => $product->created_at,
                'Updated At' => $product->updated_at,
            ];
        });
    }

    /**
     * Set headings for Excel
     */
    public function headings(): array
    {
        return [
            'ID',
            'Branch',
            'Code',
            'Name',
            'Category',
            'Cost Price',
            'Price',
            'Stock',
            'Created At',
            'Updated At',
        ];
    }
}