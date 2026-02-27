<?php

// app/Http/Controllers/ContactController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    // GET /contact
    public function index(): Response
    {
        return Inertia::render('Contact');
    }

    // POST /contact
    public function send(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'min:2', 'max:100'],
            'email'   => ['required', 'email', 'max:150'],
            'subject' => ['required', 'string', 'min:3', 'max:200'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
        ], [
            'name.required'    => 'Le nom est obligatoire.',
            'name.min'         => 'Le nom doit contenir au moins 2 caractères.',
            'email.required'   => 'L\'email est obligatoire.',
            'email.email'      => 'L\'adresse email n\'est pas valide.',
            'subject.required' => 'Le sujet est obligatoire.',
            'subject.min'      => 'Le sujet doit contenir au moins 3 caractères.',
            'message.required' => 'Le message est obligatoire.',
            'message.min'      => 'Le message doit contenir au moins 10 caractères.',
        ]);

        // Envoi du mail
        // Décommente quand tu auras configuré MAIL_* dans .env
        // Mail::to('contact@mrsergio.dev')->send(new \App\Mail\ContactMail($validated));

        // Pour l'instant on log simplement
        \Log::info('Contact form submitted', $validated);

        return back()->with('success', 'Votre message a bien été envoyé ! Je vous répondrai dans les plus brefs délais.');
    }
}