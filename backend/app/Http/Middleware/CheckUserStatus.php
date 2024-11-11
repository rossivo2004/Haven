<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Kiểm tra nếu user đã đăng nhập và có status "banned"
        if (Auth::check() && Auth::user()->status === 'banned') {
            // Đăng xuất user và trả về thông báo
            Auth::logout();
            return response()->json([
                'message' => 'Tài khoản của bạn đã bị cấm. Xin hãy liên hệ để được hỗ trợ.'
            ], 403);
        }

        // Tiếp tục request nếu user không bị banned
        return $next($request);
    }
}
