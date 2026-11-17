<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignFormationEnrollmentSessionRequest;
use App\Models\FormationEnrollment;
use App\Models\FormationSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminFormationEnrollmentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Formations/Enrollments', [
            'enrollments' => FormationEnrollment::with(['formation', 'session'])->latest()->get(),
            'sessions' => FormationSession::query()
                ->withCount(['enrollments as registered_count' => fn ($query) => $query->holdingSeat()])
                ->where('starts_at', '>', now())
                ->orderBy('starts_at')
                ->get()
                ->map(fn (FormationSession $session): array => [
                    'id' => $session->id,
                    'formation_id' => $session->formation_id,
                    'label' => ($session->title ?: 'Session').' · '.$session->date_label.' · '.$session->time_label,
                    'is_full' => $session->capacity !== null && $session->registered_count >= $session->capacity,
                ]),
        ]);
    }

    /**
     * Place une demande (souvent ancienne, faite sans session) dans une session : place réservée
     * ou liste d'attente selon la capacité, puis email de confirmation avec le lien.
     */
    public function assignSession(AssignFormationEnrollmentSessionRequest $request, FormationEnrollment $enrollment): RedirectResponse
    {
        $previousSession = $enrollment->session;

        DB::transaction(function () use ($request, $enrollment): void {
            $session = FormationSession::query()->lockForUpdate()->findOrFail($request->integer('formation_session_id'));

            $enrollment->update([
                'formation_session_id' => $session->id,
                'status' => $session->statusForNewEnrollment(),
                'reminder_sent_at' => null,
                'attended_at' => null,
            ]);
        });

        $enrollment->unsetRelation('session');
        $enrollment->sendConfirmation();
        $previousSession?->promoteWaitlist();

        return back()->with('success', $enrollment->status === FormationEnrollment::STATUS_WAITLISTED
            ? "{$enrollment->name} est en liste d'attente (session complète). Email envoyé."
            : "{$enrollment->name} est inscrit à la session. Email envoyé.");
    }

    public function update(Request $request, FormationEnrollment $enrollment): RedirectResponse
    {
        $wasWaitlisted = $enrollment->status === FormationEnrollment::STATUS_WAITLISTED;

        $enrollment->update($request->validate([
            'status' => ['required', Rule::in(FormationEnrollment::STATUSES)],
        ]));

        if ($wasWaitlisted && $enrollment->session && $enrollment->status === FormationEnrollment::STATUS_REGISTERED) {
            $enrollment->sendConfirmation(promoted: true);
        }

        $enrollment->session?->promoteWaitlist();

        return back()->with('success', 'Statut mis à jour.');
    }

    public function destroy(FormationEnrollment $enrollment): RedirectResponse
    {
        $session = $enrollment->session;
        $enrollment->delete();
        $session?->promoteWaitlist();

        return back()->with('success', 'Demande supprimée.');
    }
}
