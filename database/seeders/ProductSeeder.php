<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branchMain = Branch::where('code', 'HO-01')->first();
        $branchTwo = Branch::where('code', 'CB-02')->first();

        $catFoodHO = Category::where('code', 'KAT-HO-01')->first();
        $catDrinkHO = Category::where('code', 'KAT-HO-02')->first();

        $catFoodCB = Category::where('code', 'KAT-CB-01')->first();
        $catDrinkCB = Category::where('code', 'KAT-CB-02')->first();

        // Produk Cabang Utama
        Product::updateOrCreate(
            ['code' => 'PRD-HO-01', 'branch_id' => $branchMain->id],
            [
                'category_id' => $catFoodHO->id,
                'name'        => 'Nasi Goreng Special HO',
                'cost_price'  => 18000,
                'price'       => 25000,
                'stock'       => 50,
            ]
        );

        Product::updateOrCreate(
            ['code' => 'PRD-HO-02', 'branch_id' => $branchMain->id],
            [
                'category_id' => $catDrinkHO->id,
                'name'        => 'Es Teh Manis HO',
                'cost_price'  => 2000,
                'price'       => 5000,
                'stock'       => 100,
            ]
        );

        // Produk Cabang Dua
        Product::updateOrCreate(
            ['code' => 'PRD-CB-01', 'branch_id' => $branchTwo->id],
            [
                'category_id' => $catFoodCB->id,
                'name'        => 'Mie Goreng Cabang 2',
                'cost_price'  => 14000,
                'price'       => 20000,
                'stock'       => 30,
            ]
        );

        Product::updateOrCreate(
            ['code' => 'PRD-CB-02', 'branch_id' => $branchTwo->id],
            [
                'category_id' => $catDrinkCB->id,
                'name'        => 'Es Jeruk Cabang 2',
                'cost_price'  => 3000,
                'price'       => 6000,
                'stock'       => 80,
            ]
        );
    }
}