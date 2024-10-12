<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'product_variant_id', 'quantity'];

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

