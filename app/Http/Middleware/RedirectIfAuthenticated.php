<?php
// app/Http/Middleware/RedirectIfAuthenticated.php
// Remplace le fichier existant

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();

                // Si admin déjà connecté → dashboard admin
                if ($user && $user->isAdmin()) {
                    return redirect('/admin');
                }

                // Sinon → accueil
                return redirect('/');
            }
        }

        return $next($request);
    }
}