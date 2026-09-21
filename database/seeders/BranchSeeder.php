<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Branch::updateOrCreate(
            ['code' => 'HO-01'],
            [
                'name'      => 'Cabang Utama',
                'address'   => 'Kantor Pusat',
                'phone'     => '081234567890',
                'is_active' => true,
            ]
        );

        Branch::updateOrCreate(
            ['code' => 'CB-02'],
            [
                'name'      => 'Cabang Dua',
                'address'   => 'Jl. Raya No. 123',
                'phone'     => '089876543210',
                'is_active' => true,
            ]
        );
    }
}