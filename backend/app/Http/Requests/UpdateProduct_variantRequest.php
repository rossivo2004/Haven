<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
class UpdateProduct_variantRequest extends FormRequest
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
            'product_id' => 'required|exists:products,id',
            'name' => 'required|string|',
            'price' => 'required|numeric|min:0', // Giá sản phẩm là số và >= 0
            'stock' => 'required|integer|min:0', 
            'variant_value' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'discount' => 'required|numeric|min:0|max:100', 
        ];
    }
    public function messages(): array
    {
        return [
            'product_id.required' => 'Vui lòng chọn sản phẩm.',
            'product_id.exists' => 'Sản phẩm bạn chọn không tồn tại.',
            // 'name' messages
            'name.required' => 'Vui lòng nhập tên cho các biến thể.',
            'name.string' => 'Mỗi tên biến thể phải là một chuỗi ký tự.',
            // 'price' messages
            'price.required' => 'Vui lòng nhập giá cho các biến thể.',
            'price.numeric' => 'Giá của mỗi biến thể phải là một số.',
            'price.min' => 'Giá của mỗi biến thể không được nhỏ hơn 0.',
    
            // 'stock' messages
            'stock.required' => 'Vui lòng nhập số lượng tồn kho cho các biến thể.',
            'stock.integer' => 'Số lượng tồn kho của mỗi biến thể phải là một số nguyên.',
            'stock.min' => 'Số lượng tồn kho của mỗi biến thể không được nhỏ hơn 0.',
    
            // 'variant_value' messages
            'variant_value.required' => 'Vui lòng nhập giá trị biến thể.',
            'variant_value.string' => 'Mỗi giá trị biến thể phải là chuỗi ký tự.',
        
            // 'image' messages
            'image.image' => 'Mỗi tệp phải là một hình ảnh hợp lệ.',
            'image.mimes' => 'Hình ảnh phải có định dạng jpeg, png, jpg, gif hoặc svg.',
            'image.max' => 'Dung lượng mỗi hình ảnh không được vượt quá 2MB.',
    
            // 'discount' messages
            'discount.required' => 'Vui lòng nhập thông tin giảm giá.',
            'discount.numeric' => 'Giảm giá phải là số.',
            'discount.min' => 'Giảm giá không được nhỏ hơn 0%.',
            'discount.max' => 'Giảm giá không được lớn hơn 100%.',
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
