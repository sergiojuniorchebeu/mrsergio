<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\GoogleCalendar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Throwable;

/**
 * Relie le compte Google de l'admin (OAuth) pour créer les visios Meet et inviter les inscrits.
 */
class AdminGoogleCalendarController extends Controller
{
    private const STATE_SESSION_KEY = 'google_calendar.state';

    private const RETURN_SESSION_KEY = 'google_calendar.return_to';

    public function connect(Request $request, GoogleCalendar $calendar): RedirectResponse
    {
        if (! $calendar->isConfigured()) {
            return back()->with('error', 'Ajoutez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans le fichier .env.');
        }

        $state = Str::random(40);
        $request->session()->put(self::STATE_SESSION_KEY, $state);
        $request->session()->put(self::RETURN_SESSION_KEY, url()->previous(route('admin.formations.index')));

        return redirect()->away($calendar->authorizationUrl($state));
    }

    public function callback(Request $request, GoogleCalendar $calendar): RedirectResponse
    {
        $expectedState = $request->session()->pull(self::STATE_SESSION_KEY);
        $returnTo = $request->session()->pull(self::RETURN_SESSION_KEY, route('admin.formations.index'));

        if (! is_string($expectedState) || ! hash_equals($expectedState, (string) $request->query('state'))) {
            return redirect()->to($returnTo)->with('error', 'La connexion à Google a expiré. Réessayez.');
        }

        if (! $request->filled('code')) {
            return redirect()->to($returnTo)->with('error', 'Connexion à Google Agenda annulée.');
        }

        try {
            $connection = $calendar->connect((string) $request->query('code'));
        } catch (Throwable $exception) {
            report($exception);

            return redirect()->to($returnTo)->with('error', 'Google n’a pas accepté la connexion. Réessayez.');
        }

        return redirect()->to($returnTo)->with('success', 'Google Agenda relié'.($connection->email ? " ({$connection->email})" : '').'.');
    }

    public function disconnect(GoogleCalendar $calendar): RedirectResponse
    {
        $calendar->disconnect();

        return back()->with('success', 'Google Agenda déconnecté.');
    }
}
