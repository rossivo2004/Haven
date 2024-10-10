<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string  $role
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, $role)
    {
        // Kiểm tra nếu người dùng đăng nhập
        if (Auth::check()) {
            // Kiểm tra nếu người dùng có role bằng với giá trị $role
            if (Auth::user()->role->name === $role) {
                return $next($request);
            } else {
                // Nếu không đúng quyền, trả về thông báo lỗi
                return response()->json(['message' => 'Bạn không có quyền truy cập này'], 403);
            }
        }

        return redirect('/login');
    }
}
