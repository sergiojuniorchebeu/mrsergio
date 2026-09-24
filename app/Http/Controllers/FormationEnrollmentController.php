<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFormationEnrollmentRequest;
use App\Models\Formation;
use Illuminate\Http\RedirectResponse;

class FormationEnrollmentController extends Controller
{
    public function store(StoreFormationEnrollmentRequest $request, Formation $formation): RedirectResponse
    {
        abort_unless($formation->published, 404);

        $formation->enrollments()->create($request->validated());

        return back()->with('success', 'Votre demande a bien été envoyée. Je reviendrai vers vous rapidement.');
    }
}
