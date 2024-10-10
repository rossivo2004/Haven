<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FavoriteRequest extends FormRequest
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
            'product_variant_id' => 'required|exists:product_variants,id',
        ];
    }

    public function messages()
    {
        return [
            'product_variant_id.required' => 'Không có sản phẩm biến thể.',
            'product_variant_id.exists'   => 'Biến thể sản phẩm không tồn tại.',
        ];
    }
}
