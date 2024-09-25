<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'tag',
        'description',
        'main_image',
        'category_id',
        'brand_id',
    ];
    public function category()
    {
        return $this->belongsTo(category::class);
    }
    public function Brand()
    {
        return $this->belongsTo(Brand::class);
    }
    public function product_variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
