<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    use HasFactory;
    protected $fillable = ['email', 'token', 'created_at'];
    
    // Không có cột `id`, chỉ định khóa chính là `email`
    protected $primaryKey = 'email';
    public $incrementing = false;  // Khóa chính không phải là auto-increment
    public $timestamps = false;    // Bảng không có cột `updated_at`
}
