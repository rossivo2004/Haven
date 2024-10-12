<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

// use Illuminate\Contracts\Validation\Validator;
// use Illuminate\Http\Exceptions\HttpResponseException;


class StoreFlashSaleRequest extends FormRequest
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
            'start_time' => 'required|date|after_or_equal:now', // Thời gian bắt đầu phải sau thời gian hiện tại . Carbon::now()->setTimezone('Asia/Ho_Chi_Minh')->toDateTimeString()
            'end_time' => 'required|date|after:start_time', // Thời gian kết thúc phải sau thời gian bắt đầu
            // 'product_variant_ids' => 'required|exists:categories,id'
            'product_variant_ids' => 'required|array',
            'product_variant_ids.*' => 'integer|exists:product_variants,id', 
            'stocks' => 'required|array',
            'stocks.*' => 'integer|min:0',
            'discount_percents' => 'required|array|', 
            'discount_percents.*' => 'numeric|min:0|max:100'
        ];
    }
    public function messages()
    {
        
        return [
            'start_time.required' => 'Thời gian bắt đầu là bắt buộc.',
            'start_time.date' => 'Thời gian bắt đầu phải là một ngày hợp lệ.',
            'start_time.after_or_equal' => 'Thời gian bắt đầu phải là sau thời điểm hiện tại.',
            'end_time.required' => 'Thời gian kết thúc là bắt buộc.',
            'end_time.date' => 'Thời gian kết thúc phải là một ngày hợp lệ.',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
            'product_variant_ids.required' => 'Vui lòng nhập Product variant id.',
            'product_variant_ids.array' => 'Product variant id phải là một mảng.',
            'product_variant_ids.*.integer' => 'Product variant id phải là một số nguyên.',
            'stocks.*.min' => 'Số lượng tồn kho của mỗi biến thể không được nhỏ hơn 0.',
            'stocks.required' => 'Vui lòng nhập số lượng tồn kho cho các biến thể.',
            'stocks.array' => 'Số lượng tồn kho phải là một mảng.',
            'stocks.*.integer' => 'Số lượng tồn kho của mỗi biến thể phải là một số nguyên.',
            'stocks.*.min' => 'Số lượng tồn kho của mỗi biến thể không được nhỏ hơn 0.',
            'discount_percents.required' => 'Vui lòng nhập thông tin giảm giá.',
            'discount_percents.array' => 'Thông tin giảm giá phải là một mảng.',
            'discount_percents.*.numeric' => 'Giảm giá phải là số.',
            'discount_percents.*.min' => 'Giảm giá không được nhỏ hơn 0%.',
            'discount_percents.*.max' => 'Giảm giá không được lớn hơn 100%.',
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
