<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
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
            'items'         => 'required|array|min:1',
            'items.*.id'    => 'required|exists:products,id',
            'items.*.name'  => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.qty'   => 'required|integer|min:1',
            'total_price'   => 'required|numeric',
            'cash_received' => 'required|numeric|min:0',
            'change'        => 'required|numeric',
        ];
    }
}