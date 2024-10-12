<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProductRequest extends FormRequest
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
            'name_product' => 'required|string|max:255', 
            // 'images' => 'required|array|',
            // 'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
            // 'name' => 'required|array|',
            // 'name.*' => 'string', // Tên sản phẩm bắt buộc
            // 'price' => 'required|array|', // Giá sản phẩm là số và >= 0
            // 'price.*' => 'required|numeric|min:0',
            
            // 'stock' => 'required|array|', 
            // 'stock.*' => 'integer|min:0',// Số lượng sản phẩm là số nguyên không âm
            // 'variant_value' => 'required|array',
            // 'variant_value.*' => 'string', 
            'description' => 'nullable|string|', // Mô tả có thể rỗng
            // 'image' => 'nullable|array|',
            // 'image.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Ảnh phải là file hình hợp lệ với dung lượng tối đa 2MB
            'category_id' => 'required|exists:categories,id', // ID danh mục bắt buộc, phải tồn tại trong bảng categories
            'brand_id' => 'required|exists:brands,id', // ID thương hiệu có thể rỗng, nếu có phải tồn tại trong bảng brands
           
            // 'discount' => 'required|array|', 
            // 'discount.*' => 'numeric|min:0|max:100'// Thông tin giảm giá phải là kiểu boolean
        ];
    }
    public function messages(): array
{
    
    return [
         'name_product.required' => 'Vui lòng nhập tên sản phẩm chính.',
         'name_product.string' => 'Tên sản phẩm chính phải là chuỗi ký tự hợp lệ.',
         'name_product.max' => 'Tên sản phẩm chính không được vượt quá 255 ký tự.',
         
         'description.string' => 'Mô tả sản phẩm phải là chuỗi ký tự hợp lệ.',

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
