<?php

namespace App\Http\Controllers;

use App\Exports\ProductExport;
use App\Models\Product;
use App\Models\Category;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;
use Milon\Barcode\DNS1D;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $query = request()->get('query', null);

        $products = Product::with('category')
            ->when($query, function ($q) use ($query) {
                $q->where('code', 'like', "%{$query}%")
                  ->orWhere('name', 'like', "%{$query}%")
                  ->orWhereHas('category', function ($q2) use ($query) {
                      $q2->where('name', 'like', "%{$query}%");
                  });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Products/Create', [
            'categories' => $categories
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:products,code',
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        if (!Storage::disk('public')->exists('products')) {
            Storage::disk('public')->makeDirectory('products');
        }

        $barcode = new DNS1D();
        $fileName = $validated['code'] . '.png';
        $filePath = 'products/' . $fileName;

        // Tampilkan kode produk di bawah barcode
        Storage::disk('public')->put(
            $filePath,
            base64_decode($barcode->getBarcodePNG($validated['code'], 'C128', 3, 50, [0,0,0], true))
        );

        $validated['barcode'] = $filePath;

        Product::create($validated);

        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => $product->load('category')
        ]);
    }

    public function edit(Product $product)
    {
        $categories = Category::all();
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validate([
            'code' => 'required|unique:products,code,' . $product->id,
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        if ($validated['code'] !== $product->code) {
            if (!Storage::disk('public')->exists('products')) {
                Storage::disk('public')->makeDirectory('products');
            }
            $barcode = new DNS1D();
            $fileName = $validated['code'] . '.png';
            $filePath = 'products/' . $fileName;

            // Tampilkan kode produk di bawah barcode
            Storage::disk('public')->put(
                $filePath,
                base64_decode($barcode->getBarcodePNG($validated['code'], 'C128', 3, 50, [0,0,0], true))
            );

            $validated['barcode'] = $filePath;
        }

        $product->update($validated);

        return redirect()->route('products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Produk berhasil dihapus.');
    }

    public function export()
    {
        return Excel::download(new ProductExport, 'products.xlsx');
    }
}
