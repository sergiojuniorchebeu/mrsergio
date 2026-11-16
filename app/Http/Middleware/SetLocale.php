<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Langues proposées sur le site ; la première sert par défaut.
     *
     * @var list<string>
     */
    public const SUPPORTED_LOCALES = ['fr', 'en'];

    /**
     * Applique la langue choisie par le visiteur (cookie « language » posé côté client).
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $language = $request->cookie('language');

        App::setLocale(in_array($language, self::SUPPORTED_LOCALES, true) ? $language : self::SUPPORTED_LOCALES[0]);

        return $next($request);
    }
}
