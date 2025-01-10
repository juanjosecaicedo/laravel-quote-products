<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_email',
        'quote_number',
        'total'
    ];

    public function quoteItems(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(QuoteItem::class);
    }

}
