<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'total',
        'full_name',
        'phone',
        'email',
        'status',
        'province',
        'district',
        'ward',
        'address',
        'payment_transpot',
        'payment_method',
        'payment_status',
        'user_id',
        'invoice_code',
        'refunded_stock',
        'is_read'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function payment() {
        return $this->hasOne(Payment::class);
    }

    public function orderDetails() {
        return $this->hasMany(OrderDetail::class);
    }

    public function getTotalAttribute($value)
    {
    return intval($value); // Loại bỏ phần .00
    }


}
