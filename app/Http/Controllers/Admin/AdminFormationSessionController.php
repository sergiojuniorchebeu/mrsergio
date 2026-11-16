<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFormationSessionRequest;
use App\Http\Requests\UpdateFormationSessionRequest;
use App\Models\Formation;
use App\Models\FormationSession;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminFormationSessionController extends Controller
{
    public function index(Formation $formation): Response
    {
        return Inertia::render('Admin/Formations/Sessions', [
            'formation' => $formation->only('id', 'title', 'slug'),
            'sessions' => $formation->sessions()
                ->withCount(['enrollments as registered_count' => function ($query): void {
                    $query->whereIn('status', ['nouvelle', 'confirmée', 'présente']);
                }])
                ->orderBy('starts_at')
                ->get(),
        ]);
    }

    public function store(StoreFormationSessionRequest $request, Formation $formation): RedirectResponse
    {
        $formation->sessions()->create($request->validated());

        return back()->with('success', 'Session ajoutée.');
    }

    public function update(UpdateFormationSessionRequest $request, FormationSession $session): RedirectResponse
    {
        $session->update($request->validated());

        return back()->with('success', 'Session mise à jour.');
    }

    public function destroy(FormationSession $session): RedirectResponse
    {
        $session->delete();

        return back()->with('success', 'Session supprimée.');
    }
}
