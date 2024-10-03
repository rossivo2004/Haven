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

    public function flashSales() {
        return $this->belongsToMany(FlashSale::class, FlashSaleProduct::class)
                    ->withPivot('discount_percent', 'stock','sold');
    }
    
    public function getDiscountedPriceAttribute()
    {
        if ($this->discount > 0) {
            return $this->price - ($this->price * ($this->discount / 100));
        }
        return $this->price;
    }
    public function getStatusStockAttribute()
    {
        
        if ($this->stock > 0) {
            return 'Còn hàng';
        }else{
            return 'Hết hàng';
        }
    }
    public function getFlashSalePriceAttribute()
    {
        // Kiểm tra nếu quan hệ flashSales có bản ghi
        if ($this->flashSales && $this->flashSales->isNotEmpty()) {
            // Lấy bản ghi flash sale đầu tiên và trạng thái là activee
            $flashSale = $this->flashSales->where('status',1)->First();
            
            // Kiểm tra xem có pivot và discount_percent hay không
            if ($flashSale && isset($flashSale->pivot->discount_percent)) {
                $discountPercent = $flashSale->pivot->discount_percent;
                return $this->price - ($this->price * $discountPercent / 100);
            }
        }

        // Nếu không có flash sale hoặc không có giảm giá thì trả về giá gốc
        return $this->price;
    }
    protected $appends = ['DiscountedPrice','FlashSalePrice','StatusStock'];
    protected $with = ['flashSales','product'];
}
