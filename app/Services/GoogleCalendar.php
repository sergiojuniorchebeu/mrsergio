<?php

namespace App\Services;

use App\Models\FormationSession;
use App\Models\GoogleCalendarConnection;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Google Agenda via l'API REST (sans SDK) : chaque session devient un événement avec sa visio Meet,
 * et seuls les inscrits avec une place figurent parmi les invités. Avec l'accès Meet « Restreint »,
 * une personne qui n'a que le lien copié doit demander à entrer.
 */
class GoogleCalendar
{
    private const AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';

    private const REVOKE_URL = 'https://oauth2.googleapis.com/revoke';

    private const API_URL = 'https://www.googleapis.com/calendar/v3';

    private const SCOPES = 'openid email https://www.googleapis.com/auth/calendar.events';

    /**
     * Le jeton d'accès est renouvelé un peu avant son expiration.
     */
    private const TOKEN_REFRESH_MARGIN_SECONDS = 60;

    public function isConfigured(): bool
    {
        return filled(config('services.google.client_id')) && filled(config('services.google.client_secret'));
    }

    public function isConnected(): bool
    {
        return $this->isConfigured() && GoogleCalendarConnection::query()->exists();
    }

    public function redirectUri(): string
    {
        return route('admin.google-calendar.callback');
    }

    public function authorizationUrl(string $state): string
    {
        return self::AUTHORIZE_URL.'?'.http_build_query([
            'client_id' => config('services.google.client_id'),
            'redirect_uri' => $this->redirectUri(),
            'response_type' => 'code',
            'scope' => self::SCOPES,
            'access_type' => 'offline',
            'prompt' => 'consent',
            'include_granted_scopes' => 'true',
            'state' => $state,
        ]);
    }

    /**
     * Échange le code reçu de Google contre des jetons et enregistre le compte relié.
     */
    public function connect(string $code): GoogleCalendarConnection
    {
        $tokens = Http::asForm()->post(self::TOKEN_URL, [
            'code' => $code,
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'redirect_uri' => $this->redirectUri(),
            'grant_type' => 'authorization_code',
        ])->throw()->json();

        if (empty($tokens['refresh_token'])) {
            throw new RuntimeException('Google n’a pas fourni de jeton d’accès permanent.');
        }

        GoogleCalendarConnection::query()->delete();

        return GoogleCalendarConnection::create([
            'email' => $this->emailFromIdToken($tokens['id_token'] ?? null),
            'refresh_token' => $tokens['refresh_token'],
            'access_token' => $tokens['access_token'],
            'access_token_expires_at' => now()->addSeconds((int) ($tokens['expires_in'] ?? 3600)),
        ]);
    }

    public function disconnect(): void
    {
        $connection = GoogleCalendarConnection::current();

        if (! $connection) {
            return;
        }

        rescue(fn () => Http::asForm()->post(self::REVOKE_URL, ['token' => $connection->refresh_token]), report: false);
        GoogleCalendarConnection::query()->delete();
    }

    /**
     * Crée l'événement et sa visio Meet.
     *
     * @return array{id: string, meet_url: string|null}
     */
    public function createEvent(FormationSession $session): array
    {
        $event = $this->api()
            ->withQueryParameters(['conferenceDataVersion' => 1, 'sendUpdates' => 'none'])
            ->post($this->eventsUrl(), [
                ...$this->eventDetails($session),
                'conferenceData' => [
                    'createRequest' => [
                        'requestId' => (string) Str::uuid(),
                        'conferenceSolutionKey' => ['type' => 'hangoutsMeet'],
                    ],
                ],
            ])
            ->throw()
            ->json();

        return [
            'id' => $event['id'],
            'meet_url' => $event['hangoutLink'] ?? null,
        ];
    }

    /**
     * Met à jour l'horaire et remplace la liste des invités (les inscrits ne reçoivent pas d'email de Google :
     * le site envoie déjà les siens).
     *
     * @param  array<int, string>  $guestEmails
     * @return string|null Lien Meet de l'événement.
     */
    public function syncEvent(FormationSession $session, array $guestEmails): ?string
    {
        $event = $this->api()
            ->withQueryParameters(['sendUpdates' => 'none'])
            ->patch($this->eventsUrl($session->google_event_id), [
                ...$this->eventDetails($session),
                'attendees' => array_map(fn (string $email): array => ['email' => $email], array_values(array_unique($guestEmails))),
            ])
            ->throw()
            ->json();

        return $event['hangoutLink'] ?? null;
    }

    public function deleteEvent(string $eventId): void
    {
        $response = $this->api()
            ->withQueryParameters(['sendUpdates' => 'none'])
            ->delete($this->eventsUrl($eventId));

        if (! in_array($response->status(), [404, 410], true)) {
            $response->throw();
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function eventDetails(FormationSession $session): array
    {
        $timezone = config('app.timezone');

        return [
            'summary' => $session->title ?: $session->formation->title,
            'description' => 'Live gratuit — '.$session->formation->title."\n".route('formations.show', $session->formation),
            'start' => ['dateTime' => $session->starts_at->toIso8601String(), 'timeZone' => $timezone],
            'end' => ['dateTime' => $session->endsAtOrDefault()->toIso8601String(), 'timeZone' => $timezone],
            'guestsCanSeeOtherGuests' => false,
            'guestsCanInviteOthers' => false,
            'guestsCanModify' => false,
        ];
    }

    private function eventsUrl(?string $eventId = null): string
    {
        $url = self::API_URL.'/calendars/'.rawurlencode(config('services.google.calendar_id')).'/events';

        return $eventId ? $url.'/'.rawurlencode($eventId) : $url;
    }

    private function api(): PendingRequest
    {
        return Http::withToken($this->accessToken())->acceptJson()->timeout(20);
    }

    private function accessToken(): string
    {
        $connection = GoogleCalendarConnection::current()
            ?? throw new RuntimeException('Aucun compte Google Agenda n’est relié.');

        if ($connection->access_token && $connection->access_token_expires_at?->isAfter(now()->addSeconds(self::TOKEN_REFRESH_MARGIN_SECONDS))) {
            return $connection->access_token;
        }

        $tokens = Http::asForm()->post(self::TOKEN_URL, [
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'refresh_token' => $connection->refresh_token,
            'grant_type' => 'refresh_token',
        ])->throw()->json();

        $connection->update([
            'access_token' => $tokens['access_token'],
            'access_token_expires_at' => now()->addSeconds((int) ($tokens['expires_in'] ?? 3600)),
        ]);

        return $tokens['access_token'];
    }

    /**
     * L'adresse du compte, lue dans le jeton d'identité reçu directement de Google (HTTPS).
     */
    private function emailFromIdToken(?string $idToken): ?string
    {
        $payload = $idToken ? explode('.', $idToken)[1] ?? null : null;

        if (! $payload) {
            return null;
        }

        $claims = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);

        return is_array($claims) ? ($claims['email'] ?? null) : null;
    }
}
