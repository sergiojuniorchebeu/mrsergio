<?php

namespace App\Http\Requests;

use App\Models\FormationEnrollment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFormationEnrollmentRequest extends FormRequest
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
        $emailRules = ['required', 'email', 'max:150'];

        if ($this->filled('formation_session_id')) {
            $emailRules[] = Rule::unique('formation_enrollments', 'email')
                ->where('formation_session_id', $this->integer('formation_session_id'))
                ->whereNot('status', FormationEnrollment::STATUS_CANCELLED);
        }

        return [
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'email' => $emailRules,
            'phone' => ['nullable', 'string', 'max:40'],
            'message' => ['nullable', 'string', 'max:1000'],
            'formation_session_id' => ['nullable', 'integer', 'exists:formation_sessions,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => __('Cette adresse est déjà inscrite à cette session.'),
        ];
    }
}
