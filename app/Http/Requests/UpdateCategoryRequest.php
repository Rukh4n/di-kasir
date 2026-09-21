<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
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
        $categoryId = $this->route('category') ? ($this->route('category')->id ?? $this->route('category')) : null;

        $rules = [
            'code' => 'required|string|max:50|unique:categories,code,' . $categoryId,
            'name' => 'required|string|max:255',
        ];

        if ($this->user()->role === 'admin') {
            $rules['branch_id'] = 'required|exists:branches,id';
        }

        return $rules;
    }
}