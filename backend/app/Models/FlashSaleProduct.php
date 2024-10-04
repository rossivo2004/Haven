<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlashSaleProduct extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_variant_id',
        'flash_sale_id',
        'stock',
        'discount_percent',
        'sold'
    ];
    public function getDiscountedPriceAttribute()
    {
        if ($this->discount_percent > 0) {
            return $this->price - ($this->price * ($this->discount_percent / 100));
        }
        return $this->price;
    }
   
    protected $appends = ['DiscountedPrice'];
}
