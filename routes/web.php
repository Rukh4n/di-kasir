<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/guiden', function(){
    return Inertia::render('Guide');
})->name('guide');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
        ->name('categories.destroy')
        ->middleware('role:admin');

    // Products
    Route::get('/product-list', [ProductController::class, 'index'])->name('products.index');
    Route::get('/product-list/export', [ProductController::class, 'export'])->name('products.export');
    Route::get('/product-list/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/product-list', [ProductController::class, 'store'])->name('products.store');
    Route::get('/product-list/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::get('/product-list/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/product-list/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/product-list/{product}', [ProductController::class, 'destroy'])
        ->name('products.destroy')
        ->middleware('role:admin');

    // Transactions
    Route::get('/transaction-list', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transaction-list/export', [TransactionController::class, 'export'])
        ->name('transactions.export')
        ->middleware('role:admin');
    Route::get('/transaction-list/create', [TransactionController::class, 'create'])->name('transactions.create');
    Route::post('/transaction-list', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('/transaction-list/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::get('/transaction-list/{transaction}/edit', [TransactionController::class, 'edit'])->name('transactions.edit');
    Route::put('/transaction-list/{transaction}', [TransactionController::class, 'update'])
        ->name('transactions.update')
        ->middleware('role:admin');
    Route::delete('/transaction-list/{transaction}', [TransactionController::class, 'destroy'])
        ->name('transactions.destroy')
        ->middleware('role:admin');

    // Search Products
    Route::get('/search-products', [TransactionController::class, 'searchProducts'])->name('transactions.searchProducts');

    // Options (Admin only)
    Route::get('/options', [AdminController::class, 'option'])
        ->name('options.index')
        ->middleware('role:admin');
    Route::post('/options/bulk-delete', [AdminController::class, 'bulkDelete'])
        ->name('options.bulkDelete')
        ->middleware('role:admin');
});

require __DIR__.'/auth.php';
