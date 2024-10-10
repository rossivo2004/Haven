<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
class StoreProduct_imageRequest extends FormRequest
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
            'product_images' => 'required|array|',
            'product_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
        ];
    }
    public function messages(): array
    {
        
        return [
            'product_id.required' => 'Vui lòng chọn sản phẩm.',
            'product_id.exists' => 'Sản phẩm bạn chọn không tồn tại.',
    
            'product_images.array' => 'Danh sách hình ảnh phải là một mảng.',
            'product_images.*.image' => 'Mỗi tệp phải là một hình ảnh hợp lệ.',
            'product_images.*.mimes' => 'Hình ảnh phải có định dạng jpeg, png, jpg, gif hoặc svg.',
            'product_images.*.max' => 'Dung lượng mỗi hình ảnh không được vượt quá 2MB.',
            
           
        
      
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
