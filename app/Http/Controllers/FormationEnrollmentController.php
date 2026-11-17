<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFormationEnrollmentRequest;
use App\Models\Formation;
use App\Models\FormationEnrollment;
use App\Models\FormationSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class FormationEnrollmentController extends Controller
{
    public function store(StoreFormationEnrollmentRequest $request, Formation $formation): RedirectResponse
    {
        abort_unless($formation->published, 404);

        $data = $request->validated();
        $session = null;

        $enrollment = DB::transaction(function () use ($formation, $data, &$session) {
            if (! empty($data['formation_session_id'])) {
                $session = FormationSession::query()
                    ->where('formation_id', $formation->id)
                    ->where('published', true)
                    ->where('starts_at', '>=', now())
                    ->lockForUpdate()
                    ->findOrFail($data['formation_session_id']);

                $data['status'] = $session->statusForNewEnrollment();
            }

            return $formation->enrollments()->create($data);
        });

        $enrollment->sendConfirmation();
        $isWaitlisted = $enrollment->status === FormationEnrollment::STATUS_WAITLISTED;

        $flash = [
            'success' => $isWaitlisted
                ? __('La session est complète. Vous êtes ajouté à la liste d’attente.')
                : __('Votre demande a bien été envoyée. Je reviendrai vers vous rapidement.'),
            'enrollment' => [
                'status' => $enrollment->status,
                'date_label' => $session?->date_label,
                'time_label' => $session?->time_label,
                'meet_url' => $isWaitlisted || ! $session?->meet_url ? null : $enrollment->joinUrl(),
                'calendar_url' => $session?->googleCalendarUrl($isWaitlisted ? null : $enrollment->joinUrl()),
            ],
        ];

        return back()->with($flash);
    }
}
