<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class BranchScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (Auth::check() && Auth::user()->branch_id) {
            // Admin/Superadmin bisa melihat semua cabang, role lain hanya cabangnya sendiri
            if (Auth::user()->role !== 'admin') {
                $builder->where($model->getTable() . '.branch_id', Auth::user()->branch_id);
            }
        }
    }
}