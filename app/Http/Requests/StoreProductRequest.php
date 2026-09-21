<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'code'        => 'required|string|max:100|unique:products,code',
            'name'        => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'cost_price'  => 'required|numeric|min:0',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'branch_id'   => 'nullable|exists:branches,id',
        ];
    }
}