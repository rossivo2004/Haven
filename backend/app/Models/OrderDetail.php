<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    protected $fillable = [
         'quantity', 'price', 'order_id', 'product_variant_id'
    ];

    public function order() {
        return $this->belongsTo(Order::class);
    }

    public function productVariant() {
        return $this->belongsTo(ProductVariant::class);
    }

    public function getPriceAttribute($value)
    {
    return intval($value); // Loại bỏ phần .00
    }
}
