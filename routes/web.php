<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::get('/guiden', function () {
    return Inertia::render('Guide');
})->name('guide');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard & Monitoring AJAX
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/monitoring', [DashboardController::class, 'getMonitoringUpdates'])->name('dashboard.monitoring');

    // Profile Management
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    // Custom Transaction Search
    Route::get('/search-products', [TransactionController::class, 'searchProducts'])
        ->name('transactions.searchProducts');

    // Exports (Accessible by all authenticated users/staff)
    Route::get('/transaction-list/export', [TransactionController::class, 'export'])->name('transactions.export');
    Route::get('/product-list/export', [ProductController::class, 'export'])->name('products.export');

    // Admin Only Bulk Actions & Resources
    Route::middleware('role:admin')->group(function () {
        Route::get('/options', [AdminController::class, 'option'])->name('options.index');
        Route::post('/options/bulk-delete', [AdminController::class, 'bulkDelete'])->name('options.bulkDelete');
        Route::post('/options/destroy-all/{type}', [AdminController::class, 'destroyAll'])->name('options.destroyAll');
        
        Route::resource('branches', BranchController::class)->names('branches');
        Route::resource('users', UserController::class)->names('users');
    });

    // Resource Routes
    Route::resource('categories', CategoryController::class);
    Route::resource('product-list', ProductController::class)->names('products')->parameters([
        'product-list' => 'product:code',
    ]);
    Route::resource('transaction-list', TransactionController::class)->names('transactions');
});

require __DIR__.'/auth.php';