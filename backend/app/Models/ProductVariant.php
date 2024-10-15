<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class ProductVariant extends Model
{
    use HasFactory;
    protected $table = 'product_variants';
    protected $fillable = [
        'name',
        'price',
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
                    ->withPivot('id','discount_percent', 'stock','sold');
    }

    public function flashSaleProducts()
    {
        return $this->hasMany(FlashSaleProduct::class);
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

    public function Cart()
    {
        return $this->hasMany(Cart::class);
    }

    
    public function getFavoritedAttribute()
    {
        if (Auth::check()) {  
            // $user = User::find(Auth::user()->id);
            $favorited = Favorite::where([
                'user_id' => Auth::user()->id, 
                'product_variant_id' => $this->id,            
            ])->first();
    
            return $favorited ? true : false;
        } else {
            return false;  
        }
    }
    
    public function getStoredCartAttribute()
    {
        if (Auth::check()) {  
            // $user = User::find(Auth::user()->id);
                $check_pro = Cart::where([
                    'user_id' => Auth::user()->id, 
                    'product_variant_id' => $this->id, 
                ])->first();
                // return $check_pro ? true : false;
                return $check_pro ? true : false;
            
        } else {
            $cart = Session::get('cart', []);
            if (isset($cart[$this->id])) {
                return true;  
            } else {
                return false;  
            }
        }
    }
    public function getQuantityInCartAttribute(){
        if (Auth::check()) {
           return Cart::where([
                'user_id' => Auth::user()->id, 
                'product_variant_id' => $this->id, 
            ])->pluck('quantity')->first();
        }else{
            $cart = Session::get('cart', []);
            if (isset($cart[$this->id])) {
                return $cart[$this->id];  
            } else {
                return 0;  
            }
        }
    }
    protected $appends = ['DiscountedPrice','FlashSalePrice','StatusStock','Favorited','StoredCart','QuantityInCart'];
    protected $with = ['flashSales','product'];
}
