<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branchMain = Branch::where('code', 'HO-01')->first();
        $kasirMain = User::where('email', 'kasir.utama@disoftwa.com')->first();
        $productMain = Product::where('code', 'PRD-HO-01')->first();

        $branchTwo = Branch::where('code', 'CB-02')->first();
        $kasirTwo = User::where('email', 'kasir.cabang2@disoftwa.com')->first();
        $productTwo = Product::where('code', 'PRD-CB-01')->first();

        // Transaksi Cabang Utama
        if ($kasirMain && $productMain) {
            Transaction::updateOrCreate(
                ['invoice_number' => 'INV/HO/20260907/0001'],
                [
                    'branch_id'     => $branchMain->id,
                    'user_id'       => $kasirMain->id,
                    'items'         => [
                        [
                            'product_id' => $productMain->id,
                            'name'       => $productMain->name,
                            'qty'        => 2,
                            'price'      => $productMain->price,
                        ]
                    ],
                    'item_prices'   => [$productMain->price],
                    'total_price'   => 50000,
                    'cash_received' => 50000,
                    'change'        => 0,
                ]
            );
        }

        // Transaksi Cabang Dua
        if ($kasirTwo && $productTwo) {
            Transaction::updateOrCreate(
                ['invoice_number' => 'INV/CB2/20260907/0001'],
                [
                    'branch_id'     => $branchTwo->id,
                    'user_id'       => $kasirTwo->id,
                    'items'         => [
                        [
                            'product_id' => $productTwo->id,
                            'name'       => $productTwo->name,
                            'qty'        => 1,
                            'price'      => $productTwo->price,
                        ]
                    ],
                    'item_prices'   => [$productTwo->price],
                    'total_price'   => 20000,
                    'cash_received' => 50000,
                    'change'        => 30000,
                ]
            );
        }
    }
}