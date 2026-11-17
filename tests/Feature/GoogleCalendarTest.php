<?php

namespace Tests\Feature;

use App\Jobs\SyncFormationSessionCalendar;
use App\Models\Formation;
use App\Models\FormationEnrollment;
use App\Models\FormationSession;
use App\Models\GoogleCalendarConnection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GoogleCalendarTest extends TestCase
{
    use RefreshDatabase;

    private const EVENTS_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        Notification::fake();
        config([
            'services.google.client_id' => 'client-id',
            'services.google.client_secret' => 'client-secret',
            'services.google.calendar_id' => 'primary',
        ]);
    }

    private function connectGoogle(): GoogleCalendarConnection
    {
        return GoogleCalendarConnection::create([
            'email' => 'sergio@example.com',
            'refresh_token' => 'refresh-token',
            'access_token' => 'access-token',
            'access_token_expires_at' => now()->addHour(),
        ]);
    }

    private function fakeGoogle(): void
    {
        Http::fake([
            self::EVENTS_URL.'?*' => Http::response(['id' => 'event-123', 'hangoutLink' => 'https://meet.google.com/abc-defg-hij']),
            self::EVENTS_URL.'/event-123*' => Http::response(['id' => 'event-123', 'hangoutLink' => 'https://meet.google.com/abc-defg-hij']),
            'https://oauth2.googleapis.com/*' => Http::response(['access_token' => 'new-access-token', 'expires_in' => 3600]),
        ]);
    }

    private function createSession(array $attributes = []): FormationSession
    {
        $formation = Formation::create([
            'title' => 'Laravel en direct',
            'slug' => 'laravel-en-direct',
            'excerpt' => 'Une formation pratique.',
            'category' => 'Laravel',
            'is_free' => true,
            'published' => true,
        ]);

        return FormationSession::create([
            'formation_id' => $formation->id,
            'starts_at' => now()->addWeek(),
            'capacity' => 2,
            'published' => true,
            ...$attributes,
        ]);
    }

    public function test_the_admin_connects_google_with_a_verified_state(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        Http::fake([
            'https://oauth2.googleapis.com/token' => Http::response([
                'access_token' => 'access-token',
                'refresh_token' => 'refresh-token',
                'expires_in' => 3600,
                'id_token' => 'header.'.rtrim(strtr(base64_encode(json_encode(['email' => 'sergio@example.com'])), '+/', '-_'), '=').'.signature',
            ]),
        ]);

        $redirect = $this->get(route('admin.google-calendar.connect'))->assertRedirect()->headers->get('Location');
        parse_str((string) parse_url($redirect, PHP_URL_QUERY), $query);

        $this->assertStringStartsWith('https://accounts.google.com/o/oauth2/v2/auth', $redirect);
        $this->assertSame('offline', $query['access_type']);
        $this->assertStringContainsString('calendar.events', $query['scope']);
        $this->assertSame(route('admin.google-calendar.callback'), $query['redirect_uri']);

        $this->get(route('admin.google-calendar.callback', ['state' => 'forged', 'code' => 'code']))->assertSessionHas('error');
        $this->assertDatabaseCount('google_calendar_connections', 0);

        $this->get(route('admin.google-calendar.connect'));
        $this->get(route('admin.google-calendar.callback', ['state' => session('google_calendar.state'), 'code' => 'code']))
            ->assertSessionHas('success');

        $connection = GoogleCalendarConnection::current();
        $this->assertSame('sergio@example.com', $connection->email);
        $this->assertSame('refresh-token', $connection->refresh_token);
        $this->assertDatabaseMissing('google_calendar_connections', ['refresh_token' => 'refresh-token']);
    }

    public function test_only_admins_can_connect_google(): void
    {
        $this->get(route('admin.google-calendar.connect'))->assertRedirect(route('login'));

        $this->actingAs(User::factory()->create(['is_admin' => false]));
        $this->get(route('admin.google-calendar.callback', ['state' => 'x', 'code' => 'y']))->assertForbidden();
    }

    public function test_a_new_session_gets_its_meet_link_from_google(): void
    {
        $this->connectGoogle();
        $this->fakeGoogle();
        $formation = $this->createSession()->formation;
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $this->post(route('admin.formations.sessions.store', $formation), [
            'starts_at' => now()->addDays(3)->format('Y-m-d H:i:s'),
            'capacity' => 50,
            'published' => true,
        ])->assertSessionHas('success');

        $session = FormationSession::query()->latest('id')->first();
        $this->assertSame('event-123', $session->google_event_id);
        $this->assertSame('https://meet.google.com/abc-defg-hij', $session->meet_url);
        Http::assertSent(fn (Request $request): bool => $request->method() === 'POST'
            && str_contains($request->url(), 'conferenceDataVersion=1')
            && $request['conferenceData']['createRequest']['conferenceSolutionKey']['type'] === 'hangoutsMeet'
            && $request['guestsCanInviteOthers'] === false);
    }

    public function test_only_registered_people_are_invited_to_the_event(): void
    {
        $this->connectGoogle();
        $this->fakeGoogle();
        $session = $this->createSession(['google_event_id' => 'event-123', 'meet_url' => 'https://meet.google.com/abc-defg-hij']);

        foreach (['Aline@Example.com' => FormationEnrollment::STATUS_REGISTERED, 'benoit@example.com' => FormationEnrollment::STATUS_WAITLISTED, 'chloe@example.com' => FormationEnrollment::STATUS_CANCELLED] as $email => $status) {
            $session->enrollments()->create(['formation_id' => $session->formation_id, 'name' => 'Participant', 'email' => $email, 'status' => $status]);
        }

        (new SyncFormationSessionCalendar($session->id))->handle(app(\App\Services\GoogleCalendar::class));

        Http::assertSent(fn (Request $request): bool => $request->method() === 'PATCH'
            && str_contains($request->url(), '/events/event-123')
            && str_contains($request->url(), 'sendUpdates=none')
            && $request['attendees'] === [['email' => 'aline@example.com']]);
    }

    public function test_enrollment_changes_queue_a_guest_sync_only_when_google_is_connected(): void
    {
        Queue::fake();
        $session = $this->createSession(['google_event_id' => 'event-123']);
        $enrollment = $session->enrollments()->create(['formation_id' => $session->formation_id, 'name' => 'Aline', 'email' => 'aline@example.com']);

        Queue::assertNotPushed(SyncFormationSessionCalendar::class);

        $this->connectGoogle();
        $enrollment->cancel();

        Queue::assertPushed(SyncFormationSessionCalendar::class, fn (SyncFormationSessionCalendar $job): bool => $job->sessionId === $session->id);
    }

    public function test_deleting_a_session_removes_its_google_event(): void
    {
        $this->connectGoogle();
        $this->fakeGoogle();
        $session = $this->createSession(['google_event_id' => 'event-123']);
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $this->delete(route('admin.formations.sessions.destroy', $session))->assertRedirect();

        Http::assertSent(fn (Request $request): bool => $request->method() === 'DELETE' && str_contains($request->url(), '/events/event-123'));
    }

    public function test_an_expired_access_token_is_refreshed(): void
    {
        $this->connectGoogle()->update(['access_token_expires_at' => now()->subMinute()]);
        $this->fakeGoogle();
        $session = $this->createSession(['google_event_id' => 'event-123']);

        (new SyncFormationSessionCalendar($session->id))->handle(app(\App\Services\GoogleCalendar::class));

        Http::assertSent(fn (Request $request): bool => $request->url() === 'https://oauth2.googleapis.com/token' && $request['grant_type'] === 'refresh_token');
        Http::assertSent(fn (Request $request): bool => $request->method() === 'PATCH' && $request->hasHeader('Authorization', 'Bearer new-access-token'));
        $this->assertSame('new-access-token', GoogleCalendarConnection::current()->access_token);
    }

    public function test_a_google_failure_does_not_prevent_saving_the_session(): void
    {
        $this->connectGoogle();
        Http::fake(['*' => Http::response(['error' => 'backendError'], 500)]);
        $formation = $this->createSession()->formation;
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $this->post(route('admin.formations.sessions.store', $formation), [
            'starts_at' => now()->addDays(3)->format('Y-m-d H:i:s'),
            'published' => true,
        ])->assertSessionHas('error');

        $this->assertDatabaseCount('formation_sessions', 2);
    }

    public function test_without_google_nothing_is_sent_and_the_page_explains_how_to_connect(): void
    {
        Http::fake();
        config(['services.google.client_id' => null]);
        $session = $this->createSession();
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $this->post(route('admin.formations.sessions.store', $session->formation), [
            'starts_at' => now()->addDays(3)->format('Y-m-d H:i:s'),
            'published' => true,
        ])->assertSessionHas('success');
        $this->get(route('admin.formations.sessions.index', $session->formation))
            ->assertInertia(fn (Assert $page) => $page
                ->where('googleCalendar.configured', false)
                ->where('googleCalendar.connected', false)
            );

        Http::assertNotSent(fn (Request $request): bool => str_contains($request->url(), 'www.googleapis.com/calendar') || str_contains($request->url(), 'oauth2.googleapis.com'));
    }

    public function test_emails_tell_guests_which_google_account_to_use(): void
    {
        $session = $this->createSession(['google_event_id' => 'event-123', 'meet_url' => 'https://meet.google.com/abc-defg-hij']);
        $enrollment = $session->enrollments()->create(['formation_id' => $session->formation_id, 'name' => 'Aline', 'email' => 'aline@example.com']);
        $enrollment->load(['formation', 'session']);

        $html = (string) (new \App\Notifications\FormationEnrollmentConfirmation($enrollment, reminder: true))
            ->toMail($enrollment)
            ->render();

        $this->assertStringContainsString('connectez-vous à Google avec l&#039;adresse aline@example.com', $html);
    }
}
