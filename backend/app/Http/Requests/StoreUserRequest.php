<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize()
    {
        // Chỉnh sửa nếu cần kiểm tra quyền truy cập
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            // 'email' => 'required|email|unique:users,email',
            // 'password' => 'required|string|min:2|confirmed',
            // 'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            // 'phone' => 'nullable|string|max:20',
            // 'address' => 'nullable|string|max:255',
            // 'status' => 'required|in:active,inactive',
            // 'role' => 'required|in:admin,manager,employee',
            // 'point' => 'required|integer|min:0',
        ];
    }
}
