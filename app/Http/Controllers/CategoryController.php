<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->input('query');

        $categories = Category::when($query, function ($q) use ($query) {
            $q->where('code', 'like', "%{$query}%")
            ->orWhere('name', 'like', "%{$query}%");
        })
        ->orderBy('created_at', 'desc') // Mengurutkan berdasarkan waktu terbaru
        ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'query' => $query,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:categories,code',
            'name' => 'required|string|max:255',
        ]);

        Category::create([
            'code' => $request->code,
            'name' => $request->name,
        ]);

        return redirect()->route('categories.index')->with('success', 'Kategori berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Category $category)
    {
        $query = $request->input('query');

        $category->load(['products' => function ($q) use ($query) {
            $q->when($query, function ($q2) use ($query) {
                $q2->where('code', 'like', "%{$query}%")
                ->orWhere('name', 'like', "%{$query}%");
            });
        }]);

        $categories = Category::with('products')->get();

        return Inertia::render('Categories/Show', [
            'category'   => $category,
            'categories' => $categories,
            'query'      => $query,
        ]);
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        return Inertia::render('Categories/Edit', [
            'category' => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'code' => 'required|unique:categories,code,' . $category->id,
            'name' => 'required|string|max:255',
        ]);

        $category->update([
            'code' => $request->code,
            'name' => $request->name,
        ]);

        return redirect()->route('categories.index')->with('success', 'Kategori berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('categories.index')->with('success', 'Kategori berhasil dihapus');
    }
}
