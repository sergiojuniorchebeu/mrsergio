<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Contact', [
            'seo' => [
                'title' => 'Contact | Sergio Junior Chebeu',
                'description' => 'Parlons de votre projet web, mobile ou produit digital. Je réponds aux demandes sérieuses de création, refonte et accompagnement technique.',
                'image' => asset('images/profile_avatar.jpg'),
                'type' => 'website',
                'canonical' => route('contact'),
            ],
        ]);
    }

    public function send(StoreContactRequest $request): RedirectResponse
    {
        ContactMessage::create($request->validated());

        return back()->with('success', __('Votre message a bien été envoyé ! Je vous répondrai dans les plus brefs délais.'));
    }
}
