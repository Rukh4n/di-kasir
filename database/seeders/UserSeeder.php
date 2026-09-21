<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branchMain = Branch::where('code', 'HO-01')->first();
        $branchTwo = Branch::where('code', 'CB-02')->first();

        // Admin (Bisa akses semua cabang via logic BranchScope)
        User::updateOrCreate(
            ['email' => 'admin@disoftwa.com'],
            [
                'branch_id' => $branchMain->id,
                'name'      => 'Super Admin',
                'password'  => Hash::make('password'),
                'role'      => 'admin',
            ]
        );

        // Kasir Cabang Utama
        User::updateOrCreate(
            ['email' => 'kasir.utama@disoftwa.com'],
            [
                'branch_id' => $branchMain->id,
                'name'      => 'Kasir Cabang Utama',
                'password'  => Hash::make('password'),
                'role'      => 'staff',
            ]
        );

        // Kasir Cabang Dua
        User::updateOrCreate(
            ['email' => 'kasir.cabang2@disoftwa.com'],
            [
                'branch_id' => $branchTwo->id,
                'name'      => 'Kasir Cabang Dua',
                'password'  => Hash::make('password'),
                'role'      => 'staff',
            ]
        );
    }
}