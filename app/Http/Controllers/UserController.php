<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Exception;

class UserController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        try {
            $users = User::query()
                ->with('branch')
                ->when($request->search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->when($request->role, function ($query, $role) {
                    $query->where('role', $role);
                })
                ->when($request->branch_id, function ($query, $branchId) {
                    $query->where('branch_id', $branchId);
                })
                ->latest()
                ->paginate(20)
                ->withQueryString();

            $branches = Branch::where('is_active', true)
                ->select('id', 'code', 'name')
                ->get();

            return Inertia::render('Admin/Users/Index', [
                'users'    => $users,
                'branches' => $branches,
                'roles'    => ['admin', 'staff'],
                'filters'  => $request->only(['search', 'role', 'branch_id']),
            ]);
        } catch (Exception $e) {
            Log::error('Gagal mengambil data user: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return back()->with('error', 'Gagal memuat data pengguna. Silakan coba lagi.');
        }
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'branch_id' => ['required', 'exists:branches,id'],
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password'  => ['required', Rules\Password::defaults()],
            'role'      => ['nullable', Rule::in(['admin', 'staff'])],
        ]);

        try {
            User::create([
                'branch_id' => $validated['branch_id'],
                'name'      => $validated['name'],
                'email'     => $validated['email'],
                'password'  => Hash::make($validated['password']),
                'role'      => $validated['role'] ?? 'staff',
            ]);

            return redirect()
                ->route('users.index')
                ->with('success', 'Data pengguna berhasil ditambahkan.');
        } catch (Exception $e) {
            Log::error('Gagal menyimpan data user: ' . $e->getMessage(), [
                'request' => $request->except('password'),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ]);

            return back()
                ->withInput($request->except('password'))
                ->with('error', 'Terjadi kesalahan saat menyimpan data pengguna.');
        }
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'branch_id' => ['required', 'exists:branches,id'],
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'password'  => ['nullable', Rules\Password::defaults()],
            'role'      => ['nullable', Rule::in(['admin', 'staff'])],
        ]);

        try {
            $updateData = [
                'branch_id' => $validated['branch_id'],
                'name'      => $validated['name'],
                'email'     => $validated['email'],
                'role'      => $validated['role'] ?? $user->role,
            ];

            if (!empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $user->update($updateData);

            return redirect()
                ->route('users.index')
                ->with('success', 'Data pengguna berhasil diperbarui.');
        } catch (Exception $e) {
            Log::error("Gagal memperbarui user ID {$user->id}: " . $e->getMessage(), [
                'request' => $request->except('password'),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ]);

            return back()
                ->withInput($request->except('password'))
                ->with('error', 'Terjadi kesalahan saat memperbarui data pengguna.');
        }
    }

    public function destroy(User $user): RedirectResponse
    {
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        try {
            $user->delete();

            return redirect()
                ->route('users.index')
                ->with('success', 'Data pengguna berhasil dihapus.');
        } catch (Exception $e) {
            Log::error("Gagal menghapus user ID {$user->id}: " . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return back()->with('error', 'Terjadi kesalahan saat menghapus data pengguna.');
        }
    }
}