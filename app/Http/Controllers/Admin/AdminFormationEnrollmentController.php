<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FormationEnrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $enrollment->update($request->validate([
            'status' => ['required', 'in:nouvelle,en_attente,contactée,confirmée,présente,absente,archivée'],
        ]));

        return back()->with('success', 'Statut mis à jour.');
    }

    public function destroy(FormationEnrollment $enrollment): RedirectResponse
    {
        $enrollment->delete();

        return back()->with('success', 'Demande supprimée.');
    }
}
