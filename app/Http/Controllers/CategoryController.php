<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Branch;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = $request->input('query');
            $branchId = $request->input('branch_id');
            $user = auth()->user();

            $categoriesQuery = Category::when($query, function ($q) use ($query) {
                $q->where(function ($subQuery) use ($query) {
                    $subQuery->where('code', 'like', "%{$query}%")
                             ->orWhere('name', 'like', "%{$query}%");
                });
            });

            // Filter berdasarkan cabang (admin bisa memilih cabang, non-admin otomatis terkunci ke cabangnya sendiri)
            if ($user->role === 'admin') {
                $categoriesQuery->when($branchId, function ($q) use ($branchId) {
                    $q->where('branch_id', $branchId);
                });
            } else {
                $categoriesQuery->where('branch_id', $user->branch_id);
            }

            $categories = $categoriesQuery->latest()->get();
            $branches = $user->role === 'admin' ? Branch::all() : [];

            return Inertia::render('Categories/Index', [
                'categories' => $categories,
                'branches'   => $branches,
                'query'      => $query,
                'filters'    => $request->only(['query', 'branch_id']),
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal mengambil data kategori: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Terjadi kesalahan saat mengambil data kategori.');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $branches = auth()->user()->role === 'admin' ? Branch::all() : [];

        return Inertia::render('Categories/Create', [
            'branches' => $branches,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        DB::beginTransaction();

        try {
            Category::create([
                'branch_id' => auth()->user()->role === 'admin' ? $request->branch_id : auth()->user()->branch_id,
                'code'      => $request->code,
                'name'      => $request->name,
            ]);

            DB::commit();

            return redirect()->route('categories.index')->with('success', 'Kategori berhasil ditambahkan.');
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Gagal menambahkan kategori: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'request' => $request->only(['code', 'name', 'branch_id']),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal menambahkan kategori. Silakan coba lagi.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Category $category)
    {
        try {
            $query = $request->input('query');

            $category->load(['products' => function ($q) use ($query) {
                $q->when($query, function ($q2) use ($query) {
                    $q2->where(function ($subQuery) use ($query) {
                        $subQuery->where('code', 'like', "%{$query}%")
                                 ->orWhere('name', 'like', "%{$query}%");
                    });
                });
            }]);

            $categories = Category::with('products')->get();

            return Inertia::render('Categories/Show', [
                'category'   => $category,
                'categories' => $categories,
                'query'      => $query,
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal menampilkan detail kategori ID ' . $category->id . ': ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal menampilkan detail kategori.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $branches = auth()->user()->role === 'admin' ? Branch::all() : [];

        return Inertia::render('Categories/Edit', [
            'category' => $category,
            'branches' => $branches,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        DB::beginTransaction();

        try {
            $category->update([
                'branch_id' => auth()->user()->role === 'admin' ? $request->branch_id : $category->branch_id,
                'code'      => $request->code,
                'name'      => $request->name,
            ]);

            DB::commit();

            return redirect()->route('categories.index')->with('success', 'Kategori berhasil diperbarui.');
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Gagal memperbarui kategori ID ' . $category->id . ': ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'request' => $request->only(['code', 'name', 'branch_id']),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal memperbarui kategori. Silakan coba lagi.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        DB::beginTransaction();

        try {
            $category->delete();

            DB::commit();

            return redirect()->route('categories.index')->with('success', 'Kategori berhasil dihapus.');
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Gagal menghapus kategori ID ' . $category->id . ': ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Gagal menghapus kategori. Silakan coba lagi.');
        }
    }
}
