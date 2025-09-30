<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
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
}
