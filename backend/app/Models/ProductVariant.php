<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;
    protected $table = 'product_variants';
    protected $fillable = [
        'name',
        'price',
        'tag',
        'stock',
        'variant_value',
        'image',
        'discount',
        'product_id'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function getDiscountedPriceAttribute()
    {
        if ($this->discount > 0) {
            return $this->price - ($this->price * ($this->discount / 100));
        }
        return $this->price;
    }
}
