<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlashSale extends Model
{
    use HasFactory;
    protected $fillable = [
        'start_time',
        'end_time',
    ];
    protected $table = 'flash_sales';
    
    public function productVariants() {
        return $this->belongsToMany(ProductVariant::class, FlashSaleProduct::class)
                    ->withPivot('id','discount_percent', 'stock','sold',); //id thêm vào để update cho dễ
    }
    
    public function getProductFlashSaleCountAttribute()
    {
        return $this->productVariants()->count(); // Đếm số lượng flash sale products
    }
    public function getStatusFlashSaleStockAttribute()
    {
        if (isset($this->pivot->stock)) {
            if($this->pivot->stock == 0 ){
                return 'hết hàng ';
            }else{
                return 'Còn hàng';
            }
        }
       
        
    }

    protected $appends = ['ProductFlashSaleCount','StatusFlashSaleStock'];
    // protected $with = ['productVariants'];


}
