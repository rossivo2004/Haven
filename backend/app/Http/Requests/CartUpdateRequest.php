<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CartUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'quantity' => 'required|integer|min:1', // Kiểm tra số lượng
        ];
    }

    public function messages()
    {
        return [
            'quantity.required' => 'Số lượng chưa được nhập.',
            'quantity.min' => 'Số lượng không được nhỏ hơn 1.',
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        // Tùy chỉnh phản hồi JSON cho lỗi xác thực
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Dữ liệu không hợp lệ.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
