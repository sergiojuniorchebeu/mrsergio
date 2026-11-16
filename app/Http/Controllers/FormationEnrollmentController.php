<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFormationEnrollmentRequest;
use App\Models\Formation;
use App\Models\FormationEnrollment;
use App\Models\FormationSession;
use App\Notifications\FormationEnrollmentConfirmation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Throwable;

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

                $registeredCount = $session->enrollments()
                    ->whereIn('status', ['nouvelle', 'confirmée', 'présente'])
                    ->count();
                $data['status'] = $session->capacity !== null && $registeredCount >= $session->capacity
                    ? 'en_attente'
                    : 'nouvelle';
            }

            return $formation->enrollments()->create($data);
        });

        $this->sendConfirmation($enrollment);
        $isWaitlisted = $enrollment->status === 'en_attente';

        $flash = [
            'success' => $isWaitlisted
                ? __('La session est complète. Vous êtes ajouté à la liste d’attente.')
                : __('Votre demande a bien été envoyée. Je reviendrai vers vous rapidement.'),
            'enrollment' => [
                'status' => $enrollment->status,
                'date_label' => $session?->date_label,
                'time_label' => $session?->time_label,
                'meet_url' => $isWaitlisted ? null : $session?->meet_url,
                'calendar_url' => $session?->googleCalendarUrl(! $isWaitlisted),
            ],
        ];

        return back()->with($flash);
    }

    /**
     * Un email qui ne part pas ne doit pas faire échouer l'inscription déjà enregistrée.
     */
    private function sendConfirmation(FormationEnrollment $enrollment): void
    {
        $enrollment->load(['formation', 'session']);

        try {
            Notification::route('mail', $enrollment->email)
                ->notify(new FormationEnrollmentConfirmation($enrollment));
            $enrollment->update(['confirmation_sent_at' => now()]);
        } catch (Throwable $exception) {
            report($exception);
        }
    }
}
