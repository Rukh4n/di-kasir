<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Ambil atau buat data cabang default agar data yang sudah ada tidak error NULL
        $defaultBranchId = DB::table('branches')->insertGetId([
            'code'       => 'HO-01',
            'name'       => 'Cabang Utama',
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Tambahkan branch_id ke tabel users
        Schema::table('users', function (Blueprint $table) use ($defaultBranchId) {
            $table->foreignId('branch_id')
                  ->default($defaultBranchId)
                  ->after('id')
                  ->constrained('branches')
                  ->onDelete('cascade');
        });

        // 3. Tambahkan branch_id ke tabel categories
        Schema::table('categories', function (Blueprint $table) use ($defaultBranchId) {
            $table->foreignId('branch_id')
                  ->default($defaultBranchId)
                  ->after('id')
                  ->constrained('branches')
                  ->onDelete('cascade');
        });

        // 4. Tambahkan branch_id ke tabel products
        Schema::table('products', function (Blueprint $table) use ($defaultBranchId) {
            $table->foreignId('branch_id')
                  ->default($defaultBranchId)
                  ->after('id')
                  ->constrained('branches')
                  ->onDelete('cascade');
        });

        // 5. Tambahkan branch_id dan user_id ke tabel transactions
        Schema::table('transactions', function (Blueprint $table) use ($defaultBranchId) {
            $table->foreignId('branch_id')
                  ->default($defaultBranchId)
                  ->after('id')
                  ->constrained('branches')
                  ->onDelete('cascade');

            $table->foreignId('user_id')
                  ->nullable()
                  ->after('branch_id')
                  ->constrained('users')
                  ->onDelete('set null');
        });

        // 6. Index komposit untuk kombinasi filter yang sering dipakai bersamaan di controller
        Schema::table('users', function (Blueprint $table) {
            $table->index(['branch_id', 'role'], 'users_branch_id_role_index');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index(['branch_id', 'stock'], 'products_branch_id_stock_index');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->index(['branch_id', 'created_at'], 'transactions_branch_id_created_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('transactions_branch_id_created_at_index');
            $table->dropForeign(['branch_id']);
            $table->dropColumn('branch_id');
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_branch_id_stock_index');
            $table->dropForeign(['branch_id']);
            $table->dropColumn('branch_id');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['branch_id']);
            $table->dropColumn('branch_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_branch_id_role_index');
            $table->dropForeign(['branch_id']);
            $table->dropColumn('branch_id');
        });
    }
};