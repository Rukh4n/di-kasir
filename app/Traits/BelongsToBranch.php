<?php

namespace App\Traits;

use App\Models\Branch;
use App\Models\Scopes\BranchScope;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

trait BelongsToBranch
{
    /**
     * Boot trait untuk mendaftarkan Global Scope dan Auto-Fill branch_id.
     */
    protected static function bootBelongsToBranch(): void
    {
        // Terapkan Global Scope untuk memfilter query otomatis per cabang
        static::addGlobalScope(new BranchScope);

        // Secara otomatis isi branch_id dari user yang login saat membuat data baru
        static::creating(function ($model) {
            if (Auth::check() && !$model->branch_id) {
                $model->branch_id = Auth::user()->branch_id;
            }
        });
    }

    /**
     * Relasi ke model Branch.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}