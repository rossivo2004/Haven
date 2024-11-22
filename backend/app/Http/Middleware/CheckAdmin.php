<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAdmin
{
    public function handle(Request $request, Closure $next)
    {
        // return 123;
        // Kiểm tra nếu người dùng chưa đăng nhập
        // if (!auth('api')->check()) {
        //     return response()->json(['message' => 'Chưa đăng nhập'], 401);
        // }

        // Lấy user đã đăng nhập
        $user = auth('api')->user();

        // Kiểm tra role name của user
        if ($user->role->name !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền truy cập'], 403);
        }
        // Nếu đã đăng nhập và là admin, cho phép tiếp tục request
        return $next($request);
    }
}
// nó phải truy cập được chứ ta role id là 1 thì nó là admin mà ta
