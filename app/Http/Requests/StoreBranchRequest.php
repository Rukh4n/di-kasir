<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBranchRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code'      => ['required', 'string', 'max:50', 'unique:branches,code'],
            'name'      => ['required', 'string', 'max:255'],
            'address'   => ['nullable', 'string'],
            'phone'     => ['nullable', 'string', 'max:20'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.required'     => 'Kode cabang wajib diisi.',
            'code.string'       => 'Kode cabang harus berupa teks.',
            'code.max'          => 'Kode cabang maksimal 50 karakter.',
            'code.unique'       => 'Kode cabang sudah digunakan, silakan gunakan kode lain.',
            'name.required'     => 'Nama cabang wajib diisi.',
            'name.string'       => 'Nama cabang harus berupa teks.',
            'name.max'          => 'Nama cabang maksimal 255 karakter.',
            'address.string'    => 'Alamat harus berupa teks.',
            'phone.string'      => 'Nomor telepon harus berupa teks.',
            'phone.max'         => 'Nomor telepon maksimal 20 karakter.',
            'is_active.boolean' => 'Status aktif harus berupa boolean (true/false).',
        ];
    }
}