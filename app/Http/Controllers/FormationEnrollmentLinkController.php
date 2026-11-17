<?php

namespace App\Http\Controllers;

use App\Models\FormationEnrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Liens personnels (signés) reçus par email : annuler sa place, rejoindre le live.
 */
class FormationEnrollmentLinkController extends Controller
{
    /**
     * Page de confirmation : un simple clic sur le lien (ou l'analyse d'un antivirus) n'annule rien.
     */
    public function showCancel(Request $request, FormationEnrollment $enrollment): Response
    {
        $enrollment->load(['formation', 'session']);

        return Inertia::render('formations/EnrollmentCancel', [
            'enrollment' => [
                'name' => $enrollment->name,
                'status' => $enrollment->status,
                'can_cancel' => $enrollment->canBeCancelled(),
            ],
            'formation' => [
                'title' => $enrollment->formation->translated('title'),
                'url' => route('formations.show', $enrollment->formation),
            ],
            'session' => $enrollment->session ? [
                'date_label' => $enrollment->session->date_label,
                'time_label' => $enrollment->session->time_label,
            ] : null,
            'cancel_url' => $request->fullUrl(),
        ]);
    }

    public function cancel(Request $request, FormationEnrollment $enrollment): RedirectResponse
    {
        $enrollment->load('session');

        if ($enrollment->canBeCancelled()) {
            $enrollment->cancel();
        }

        return redirect()->to($request->fullUrl());
    }

    /**
     * Enregistre la présence pendant le live, puis ouvre Google Meet.
     */
    public function join(FormationEnrollment $enrollment): RedirectResponse
    {
        $enrollment->load(['formation', 'session']);
        $session = $enrollment->session;

        if (! $session?->meet_url || $enrollment->status !== FormationEnrollment::STATUS_REGISTERED) {
            return redirect()
                ->route('formations.show', $enrollment->formation)
                ->with('error', __('Cette inscription ne donne plus accès à la session.'));
        }

        if ($session->isOpenForAttendance() && $enrollment->attended_at === null) {
            $enrollment->update(['attended_at' => now()]);
        }

        return redirect()->away($session->meet_url);
    }
}
