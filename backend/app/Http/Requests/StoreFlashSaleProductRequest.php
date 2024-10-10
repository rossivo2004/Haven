<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreFlashSaleProductRequest extends FormRequest
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
            'flash_sale_id' => 'required|exists:flash_sales,id',
            'product_variant_ids' => 'required|array',
            'product_variant_ids.*' => 'integer',
            'stocks' => 'required|array',
            'stocks.*' => 'integer|min:0',
            'product_variant_ids.*' => 'integer|', 
            'discount_percents' => 'required|array|', 
            'discount_percents.*' => 'numeric|min:0|max:100'
        ];
    }
    public function messages()
    {
        return [

            'product_variant_ids.required' => 'Vui lòng nhập Product variant id.',
            'product_variant_ids.array' => 'Product variant id phải là một mảng.',
            'product_variant_ids.*.integer' => 'Product variant id phải là một số nguyên.',
            'stocks.required' => 'Vui lòng nhập số lượng tồn kho cho các biến thể.',
            'stocks.array' => 'Số lượng tồn kho phải là một mảng.',
            'stocks.*.integer' => 'Số lượng tồn kho của mỗi biến thể phải là một số nguyên.',
            'stocks.*.min' => 'Số lượng tồn kho của mỗi biến thể không được nhỏ hơn 0.',

            'discount_percents.array' => 'Thông tin giảm giá phải là một mảng.',
            'discount_percents.required' => 'Vui lòng nhập thông tin giảm giá.',
            'discount_percents.*.numeric' => 'Giảm giá phải là số.',
            'discount_percents.*.min' => 'Giảm giá không được nhỏ hơn 0%.',
            'discount_percents.*.max' => 'Giảm giá không được lớn hơn 100%.',
            'flash_sale_id.exists' => 'Flash sale bạn chọn không tồn tại.',
        ];
    }
    protected function failedValidation(Validator $validator)
    {
          // Lấy giá trị của start_time từ request
        // Tùy chỉnh phản hồi JSON cho lỗi xác thực
        throw new HttpResponseException(response()->json([
            'message' => 'Dữ liệu không hợp lệ.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
