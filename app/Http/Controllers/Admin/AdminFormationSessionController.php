<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFormationSessionRequest;
use App\Http\Requests\UpdateFormationSessionRequest;
use App\Jobs\SyncFormationSessionCalendar;
use App\Models\Formation;
use App\Models\FormationSession;
use App\Models\GoogleCalendarConnection;
use App\Services\GoogleCalendar;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class AdminFormationSessionController extends Controller
{
    public function index(Formation $formation, GoogleCalendar $calendar): Response
    {
        return Inertia::render('Admin/Formations/Sessions', [
            'formation' => $formation->only('id', 'title', 'slug'),
            'googleCalendar' => [
                'configured' => $calendar->isConfigured(),
                'connected' => $calendar->isConnected(),
                'email' => $calendar->isConnected() ? GoogleCalendarConnection::current()?->email : null,
            ],
            'sessions' => $formation->sessions()
                ->withCount([
                    'enrollments as registered_count' => fn ($query) => $query->holdingSeat(),
                    'enrollments as attended_count' => fn ($query) => $query->whereNotNull('attended_at'),
                ])
                ->orderBy('starts_at')
                ->get(),
        ]);
    }

    public function store(StoreFormationSessionRequest $request, Formation $formation): RedirectResponse
    {
        $session = $formation->sessions()->create($request->validated());

        return back()->with(...$this->createCalendarEvent($session, 'Session ajoutée.'));
    }

    public function update(UpdateFormationSessionRequest $request, FormationSession $session): RedirectResponse
    {
        $session->update($request->validated());
        $session->promoteWaitlist();

        return back()->with(...$this->createCalendarEvent($session, 'Session mise à jour.'));
    }

    public function destroy(FormationSession $session): RedirectResponse
    {
        $session->delete();

        return back()->with('success', 'Session supprimée.');
    }

    /**
     * Sans lien Meet saisi à la main, la visio est créée tout de suite dans Google Agenda
     * pour que l'admin voie le lien ; une erreur Google n'empêche pas d'enregistrer la session.
     *
     * @return array{0: string, 1: string}
     */
    private function createCalendarEvent(FormationSession $session, string $successMessage): array
    {
        if ($session->google_event_id || filled($session->meet_url) || ! app(GoogleCalendar::class)->isConnected()) {
            return ['success', $successMessage];
        }

        try {
            SyncFormationSessionCalendar::dispatchSync($session->id);

            return ['success', $successMessage.' Visio Google Meet créée.'];
        } catch (Throwable $exception) {
            report($exception);

            return ['error', $successMessage.' Mais Google Agenda n’a pas répondu : réessayez en enregistrant la session.'];
        }
    }
}
