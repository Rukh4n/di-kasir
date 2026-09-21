<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branchMain = Branch::where('code', 'HO-01')->first();
        $branchTwo = Branch::where('code', 'CB-02')->first();

        // Kategori Cabang Utama
        Category::updateOrCreate(
            ['code' => 'KAT-HO-01', 'branch_id' => $branchMain->id],
            ['name' => 'Makanan Utama']
        );

        Category::updateOrCreate(
            ['code' => 'KAT-HO-02', 'branch_id' => $branchMain->id],
            ['name' => 'Minuman Utama']
        );

        // Kategori Cabang Dua
        Category::updateOrCreate(
            ['code' => 'KAT-CB-01', 'branch_id' => $branchTwo->id],
            ['name' => 'Makanan Cabang 2']
        );

        Category::updateOrCreate(
            ['code' => 'KAT-CB-02', 'branch_id' => $branchTwo->id],
            ['name' => 'Minuman Cabang 2']
        );
    }
}