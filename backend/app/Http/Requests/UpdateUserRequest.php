<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize()
    {
        // Chỉnh sửa nếu cần kiểm tra quyền truy cập
        return true;
    }

    public function rules()
    {
        $userId = $this->route('user'); // Lấy ID của user từ route

        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => 'nullable|string|min:8|confirmed',
            // 'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            // 'phone' => 'nullable|string|max:20',
            // 'address' => 'nullable|string|max:255',
            // // 'status' => 'required|in:0,1',
            // 'role' => 'required|in:admin,manager,employee',
            // 'point' => 'required|integer|min:0',
        ];
    }
}
