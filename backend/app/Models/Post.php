<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    // Khai báo tên bảng (nếu không, Laravel sẽ tự động dùng tên số nhiều là 'posts')
    protected $table = 'posts';

    // Các cột có thể được gán giá trị
    protected $fillable = [
        'title',
        'content',
        'image',
        'thumbnail',
        'description',
    ];

    // Nếu bạn không muốn sử dụng các cột timestamps (created_at, updated_at), bạn có thể disable chúng
    // public $timestamps = false;
}
