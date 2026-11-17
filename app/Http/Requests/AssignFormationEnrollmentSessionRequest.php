<?php

namespace App\Http\Requests;

use App\Models\FormationEnrollment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignFormationEnrollmentSessionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * La session doit appartenir à la même formation, ne pas avoir commencé,
     * et la personne ne doit pas déjà y être inscrite.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var FormationEnrollment $enrollment */
        $enrollment = $this->route('enrollment');

        return [
            'formation_session_id' => [
                'required',
                'integer',
                Rule::exists('formation_sessions', 'id')
                    ->where('formation_id', $enrollment->formation_id)
                    ->where(fn ($query) => $query->where('starts_at', '>', now())),
                Rule::unique('formation_enrollments', 'formation_session_id')
                    ->where('email', $enrollment->email)
                    ->whereNot('status', FormationEnrollment::STATUS_CANCELLED),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'formation_session_id.exists' => 'Cette session n’existe pas, appartient à une autre formation ou a déjà commencé.',
            'formation_session_id.unique' => 'Cette personne est déjà inscrite à cette session.',
        ];
    }
}
