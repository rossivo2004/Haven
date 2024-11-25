<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class OrderRequest extends FormRequest
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
            'invoice_code' => 'required|string',
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^[0-9]{10,15}$/',
            'email' => 'required|email|max:255',
            'address' => 'required|string|max:500',
            'province' => 'required',
            'district' => 'required',
            'ward' => 'required',
            'payment_method' => 'required',
            'payment_transpot' => 'required',
        ];
    }

    public function messages(): array
    {

        return [
            'invoice_code.required' => 'Mã đơn hàng là bắt buộc.',
            'full_name.required' => 'Họ và tên là bắt buộc.',
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.regex' => 'Số điện thoại không đúng định dạng.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'province.required' => 'Tỉnh/Thành phố là bắt buộc.',
            'district.required' => 'Quận/Huyện là bắt buộc.',
            'ward.required' => 'Phường/Xã là bắt buộc.',
            'address.required' => 'Địa chỉ là bắt buộc.',
            'payment_transpot.required' => 'Phương thức vận chuyển là bắt buộc.',
            'payment_method.required' => 'Phương thức thanh toán là bắt buộc.',
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
