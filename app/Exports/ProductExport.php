<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class ProductExport implements FromCollection, WithHeadings, WithDrawings
{
    protected $products;

    public function __construct()
    {
        $this->products = Product::with('category')->get();
    }

    /**
     * Return all products as a collection
     */
    public function collection()
    {
        return $this->products->map(function ($product) {
            return [
                'ID' => $product->id,
                'Code' => $product->code,
                'Name' => $product->name,
                'Category' => $product->category->name ?? null,
                'Price' => $product->price,
                'Stock' => $product->stock,
                'Barcode' => '', // Leave empty, drawing will handle the image
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
            'Code',
            'Name',
            'Category',
            'Price',
            'Stock',
            'Barcode',
            'Created At',
            'Updated At',
        ];
    }

    /**
     * Add barcode images
     */
    public function drawings()
    {
        $drawings = [];
        $row = 2; // Start after header row
        foreach ($this->products as $product) {
            if ($product->barcode && file_exists(storage_path('app/public/' . $product->barcode))) {
                $drawing = new Drawing();
                $drawing->setName($product->code);
                $drawing->setPath(storage_path('app/public/' . $product->barcode));
                $drawing->setHeight(50);
                $drawing->setCoordinates('G' . $row); // G column for Barcode
                $drawings[] = $drawing;
            }
            $row++;
        }
        return $drawings;
    }
}
