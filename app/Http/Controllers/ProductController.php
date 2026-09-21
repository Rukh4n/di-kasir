<?php

namespace App\Http\Controllers;

use App\Exports\ProductExport;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = $request->get('query', null);
            $branchId = $request->get('branch_id', null);

            $products = Product::with(['category', 'branch'])
                ->when($query, function ($q) use ($query) {
                    $q->where(function ($subQuery) use ($query) {
                        $subQuery->where('code', 'like', "%{$query}%")
                            ->orWhere('name', 'like', "%{$query}%")
                            ->orWhereHas('category', function ($q2) use ($query) {
                                $q2->where('name', 'like', "%{$query}%");
                            });
                    });
                })
                ->when(auth()->user()->role === 'admin' && $branchId, function ($q) use ($branchId) {
                    $q->where('branch_id', $branchId);
                })
                ->latest()
                ->paginate(10)
                ->withQueryString();

            $branches = auth()->user()->role === 'admin'
                ? Branch::select('id', 'name')->where('is_active', true)->get()
                : [];

            return Inertia::render('Products/Index', [
                'products' => $products,
                'branches' => $branches,
                'filters'  => [
                    'query'     => $query,
                    'branch_id' => $branchId,
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal mengambil data produk: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Terjadi kesalahan saat mengambil data produk.');
        }
    }

    public function create()
    {
        try {
            $user = auth()->user();

            $categories = Category::query()
                ->when($user->role !== 'admin', function ($q) use ($user) {
                    $q->where('branch_id', $user->branch_id);
                })
                ->when($user->role === 'admin', function ($q) {
                    $q->with('branch:id,name');
                })
                ->get();

            return Inertia::render('Products/Create', [
                'categories' => $categories,
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat halaman tambah produk: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal memuat data kategori.');
        }
    }

    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            Product::create($validated);

            DB::commit();

            return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Gagal menambahkan produk: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'request' => $request->except(['_token']),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal menambahkan produk. Silakan coba lagi.');
        }
    }

    public function show(Product $product)
    {
        try {
            return Inertia::render('Products/Show', [
                'product' => $product->load(['category', 'branch']),
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal menampilkan detail produk Code ' . $product->code . ': ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal menampilkan detail produk.');
        }
    }

    public function edit(Product $product)
    {
        try {
            $user = auth()->user();

            $product->load(['category', 'branch']);

            $categories = Category::query()
                ->when($user->role === 'admin', function ($q) {
                    $q->with('branch:id,name');
                })
                ->get();

            return Inertia::render('Products/Edit', [
                'product'    => $product,
                'categories' => $categories,
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat halaman edit produk Code ' . $product->code . ': ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal memuat halaman edit produk.');
        }
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $product->update($validated);

            DB::commit();

            return redirect()->route('products.index')->with('success', 'Produk berhasil diperbarui.');
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Gagal memperbarui produk Code ' . $product->code . ': ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'request' => $request->except(['_token']),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal memperbarui produk. Silakan coba lagi.');
        }
    }

    public function destroy(Product $product)
    {
        DB::beginTransaction();

        try {
            $product->delete();

            DB::commit();

            return redirect()->route('products.index')->with('success', 'Produk berhasil dihapus.');
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Gagal menghapus produk Code ' . $product->code . ': ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal menghapus produk. Silakan coba lagi.');
        }
    }

    public function export(Request $request)
    {
        try {
            $user = auth()->user();
            $branchId = $request->get('branch_id', null);

            // Jika staff, paksa batasi ke branch miliknya sendiri
            if ($user->role !== 'admin') {
                $branchId = $user->branch_id;
            }

            return Excel::download(new ProductExport($branchId), 'products.xlsx');
        } catch (Throwable $e) {
            Log::error('Gagal mengeksport data produk: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal mengunduh berkas produk.');
        }
    }
}