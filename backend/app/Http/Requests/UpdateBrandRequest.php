<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
class UpdateBrandRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'tag' => 'required|string|max:255|unique:brands,tag',
            'image' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
        ];
    }
    public function messages(): array
    {
        return [
            // Thông báo cho trường 'name'
            'name.required' => 'Vui lòng nhập tên.',
            'name.string' => 'Tên phải là một chuỗi ký tự hợp lệ.',
            'name.max' => 'Tên không được vượt quá 255 ký tự.',
    
            // Thông báo cho trường 'tag'
            'tag.required' => 'Vui lòng nhập tag.',
            'tag.string' => 'tag phải là một chuỗi ký tự hợp lệ.',
            'tag.max' => 'tag không được vượt quá 255 ký tự.',
            'tag.unique' => 'Tag đã tồn tại.',
    
    
            // Thông báo cho trường 'image'
            'image.image' => 'Tệp tải lên phải là hình ảnh.',
            'image.mimes' => 'Hình ảnh phải có định dạng jpg, png hoặc jpeg.',
            'image.max' => 'Kích thước hình ảnh không được vượt quá 2MB.',
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
