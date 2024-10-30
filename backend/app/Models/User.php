<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // Sử dụng Auth User cho Laravel authentication
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // Các trường được phép mass assignment
    protected $fillable = [
        'name', 'email', 'password', 'role_id', 'image', 'phone', 'address', 'status', 'google_id', 'facebook_id', 'point',
    ];

    // Các trường sẽ bị ẩn khi trả về model
    protected $hidden = [
        'password', 'remember_token',
    ];

    // Định nghĩa mối quan hệ belongsTo giữa User và Role
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function orders() {
        return $this->hasMany(Order::class);
    }

    public function payments() {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
