<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FormationEnrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminFormationEnrollmentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Formations/Enrollments', [
            'enrollments' => FormationEnrollment::with(['formation', 'session'])->latest()->get(),
        ]);
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
