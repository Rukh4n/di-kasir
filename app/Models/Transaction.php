<?php

namespace App\Models;

use App\Traits\BelongsToBranch;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory, BelongsToBranch;

    protected $fillable = [
        'branch_id',
        'user_id',
        'invoice_number',
        'items',
        'item_prices',
        'total_price',
        'cash_received',
        'change',
    ];

    protected $casts = [
        'items' => 'array',
        'item_prices' => 'array',
        'total_price' => 'decimal:2',
        'cash_received' => 'decimal:2',
        'change' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}