<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class CookiePolicyController extends Controller
{
    /**
     * Politique de cookies : liste les cookies réellement déposés par le site.
     */
    public function __invoke(): Response
    {
        return Inertia::render('Cookies', [
            'cookies' => [
                [
                    'name' => config('session.cookie'),
                    'purpose' => __('Maintient votre session (formulaires, commentaires, connexion).'),
                    'duration' => __(':minutes minutes', ['minutes' => config('session.lifetime')]),
                    'category' => __('Nécessaire'),
                ],
                [
                    'name' => 'XSRF-TOKEN',
                    'purpose' => __('Protège les formulaires contre les envois frauduleux (CSRF).'),
                    'duration' => __(':minutes minutes', ['minutes' => config('session.lifetime')]),
                    'category' => __('Nécessaire'),
                ],
                [
                    'name' => 'appearance',
                    'purpose' => __('Mémorise le thème choisi (clair, sombre ou automatique).'),
                    'duration' => __('1 an'),
                    'category' => __('Préférence'),
                ],
                [
                    'name' => 'language',
                    'purpose' => __('Mémorise la langue choisie (français ou anglais).'),
                    'duration' => __('1 an'),
                    'category' => __('Préférence'),
                ],
                [
                    'name' => 'remember_web_*',
                    'purpose' => __('Garde l’administrateur connecté s’il coche « Rester connecté ».'),
                    'duration' => __('5 ans'),
                    'category' => __('Nécessaire (admin)'),
                ],
            ],
            'seo' => [
                'title' => 'Cookies | Sergio Junior Chebeu',
                'description' => 'Les cookies utilisés par mrsergio.dev : uniquement des cookies nécessaires et de préférence, aucun traceur publicitaire.',
                'type' => 'website',
                'canonical' => route('cookies'),
            ],
        ]);
    }
}
