<?php

namespace Tests\Feature;

use App\Models\Formation;
use App\Models\FormationEnrollment;
use App\Models\FormationSession;
use App\Models\User;
use App\Notifications\FormationEnrollmentConfirmation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class FormationEnrollmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_visitor_can_submit_a_formation_enrollment(): void
    {
        $formation = Formation::create([
            'title' => 'Laravel pour débuter',
            'slug' => 'laravel-pour-debuter',
            'excerpt' => 'Une formation pratique.',
            'category' => 'Laravel',
            'published' => true,
        ]);

        $response = $this->post(route('formations.enroll', $formation), [
            'name' => 'Aline M.',
            'email' => 'aline@example.com',
            'phone' => '+237 690000000',
            'message' => 'Je souhaite connaître les prochaines dates.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('formation_enrollments', [
            'formation_id' => $formation->id,
            'email' => 'aline@example.com',
            'status' => 'inscrite',
        ]);
    }

    public function test_an_enrollment_requires_a_valid_name_and_email(): void
    {
        $formation = Formation::create([
            'title' => 'Flutter pratique',
            'slug' => 'flutter-pratique',
            'excerpt' => 'Une formation pratique.',
            'category' => 'Flutter',
            'published' => true,
        ]);

        $response = $this->from(route('formations.show', $formation))
            ->post(route('formations.enroll', $formation), [
                'name' => '',
                'email' => 'invalid',
            ]);

        $response->assertRedirect(route('formations.show', $formation));
        $response->assertSessionHasErrors(['name', 'email']);
        $this->assertDatabaseCount('formation_enrollments', 0);
    }

    public function test_a_full_session_places_new_enrollments_on_the_waiting_list(): void
    {
        Notification::fake();

        $formation = Formation::create([
            'title' => 'Laravel en direct',
            'slug' => 'laravel-en-direct',
            'excerpt' => 'Une formation pratique.',
            'category' => 'Laravel',
            'is_free' => true,
            'published' => true,
        ]);
        $session = FormationSession::create([
            'formation_id' => $formation->id,
            'starts_at' => now()->addWeek(),
            'meet_url' => 'https://meet.google.com/example',
            'capacity' => 1,
            'published' => true,
        ]);

        $payload = [
            'name' => 'Aline M.',
            'email' => 'aline@example.com',
            'formation_session_id' => $session->id,
        ];
        $this->post(route('formations.enroll', $formation), $payload)->assertRedirect();
        $this->post(route('formations.enroll', $formation), [
            ...$payload,
            'name' => 'Benoît N.',
            'email' => 'benoit@example.com',
        ])->assertRedirect();

        $this->assertDatabaseHas('formation_enrollments', [
            'email' => 'aline@example.com',
            'formation_session_id' => $session->id,
            'status' => 'inscrite',
        ]);
        $this->assertDatabaseHas('formation_enrollments', [
            'email' => 'benoit@example.com',
            'formation_session_id' => $session->id,
            'status' => 'en_attente',
        ]);
        Notification::assertSentOnDemand(FormationEnrollmentConfirmation::class);
    }

    public function test_the_meet_link_is_hidden_from_waitlisted_visitors(): void
    {
        Notification::fake();
        $session = $this->createLiveSession(capacity: 1);
        $formation = $session->formation;

        $this->post(route('formations.enroll', $formation), [
            'name' => 'Aline M.',
            'email' => 'aline@example.com',
            'formation_session_id' => $session->id,
        ])->assertSessionHas('enrollment', fn (array $enrollment): bool => str_contains($enrollment['meet_url'], '/rejoindre?signature='));

        $this->post(route('formations.enroll', $formation), [
            'name' => 'Benoît N.',
            'email' => 'benoit@example.com',
            'formation_session_id' => $session->id,
        ])->assertSessionHas(
            'enrollment',
            fn (array $enrollment): bool => $enrollment['status'] === 'en_attente'
                && $enrollment['meet_url'] === null
                && ! str_contains(urldecode($enrollment['calendar_url']), 'meet.google.com'),
        );

        Notification::assertSentOnDemand(
            FormationEnrollmentConfirmation::class,
            function (FormationEnrollmentConfirmation $notification, array $channels, object $notifiable): bool {
                if ($notifiable->routes['mail'] !== 'benoit@example.com') {
                    return false;
                }

                $content = (string) $notification->toMail($notifiable)->render();

                return ! str_contains(urldecode($content), 'meet.google.com')
                    && ! str_contains($content, '/rejoindre')
                    && str_contains($content, 'liste d&#039;attente');
            },
        );
    }

    public function test_the_same_email_cannot_enroll_twice_in_a_session(): void
    {
        Notification::fake();
        $session = $this->createLiveSession(capacity: 5);
        $payload = [
            'name' => 'Aline M.',
            'email' => 'aline@example.com',
            'formation_session_id' => $session->id,
        ];

        $this->post(route('formations.enroll', $session->formation), $payload)->assertSessionHasNoErrors();
        $this->post(route('formations.enroll', $session->formation), $payload)->assertSessionHasErrors('email');

        $this->assertDatabaseCount('formation_enrollments', 1);
    }

    public function test_an_enrollment_is_saved_even_when_the_confirmation_email_fails(): void
    {
        Notification::shouldReceive('route')->andThrow(new \RuntimeException('SMTP indisponible'));
        $session = $this->createLiveSession(capacity: 5);

        $this->post(route('formations.enroll', $session->formation), [
            'name' => 'Aline M.',
            'email' => 'aline@example.com',
            'formation_session_id' => $session->id,
        ])->assertRedirect()->assertSessionHas('success');

        $this->assertDatabaseHas('formation_enrollments', [
            'email' => 'aline@example.com',
            'confirmation_sent_at' => null,
        ]);
    }

    public function test_reminders_reach_every_session_starting_within_the_window(): void
    {
        Notification::fake();
        $session = $this->createLiveSession(capacity: 5, startsAt: now()->addMinutes(12));
        $later = $this->createLiveSession(capacity: 5, startsAt: now()->addHours(3));
        $enrollment = $session->enrollments()->create([
            'formation_id' => $session->formation_id,
            'name' => 'Aline M.',
            'email' => 'aline@example.com',
            'status' => 'inscrite',
        ]);
        $later->enrollments()->create([
            'formation_id' => $later->formation_id,
            'name' => 'Benoît N.',
            'email' => 'benoit@example.com',
            'status' => 'inscrite',
        ]);

        $this->artisan('formations:send-session-reminders')->assertSuccessful();
        $this->artisan('formations:send-session-reminders')->assertSuccessful();

        Notification::assertSentOnDemandTimes(FormationEnrollmentConfirmation::class, 1);
        $this->assertNotNull($enrollment->fresh()->reminder_sent_at);
    }

    public function test_cancelling_a_registration_promotes_the_first_waitlisted_person_and_sends_the_meet_link(): void
    {
        Notification::fake();
        $session = $this->createLiveSession(capacity: 1);
        $registered = $this->enrollIn($session, 'aline@example.com', FormationEnrollment::STATUS_REGISTERED);
        $first = $this->enrollIn($session, 'benoit@example.com', FormationEnrollment::STATUS_WAITLISTED);
        $second = $this->enrollIn($session, 'chloe@example.com', FormationEnrollment::STATUS_WAITLISTED);
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $this->patch(route('admin.formation-enrollments.update', $registered), ['status' => FormationEnrollment::STATUS_CANCELLED])
            ->assertRedirect();

        $this->assertSame(FormationEnrollment::STATUS_REGISTERED, $first->fresh()->status);
        $this->assertSame(FormationEnrollment::STATUS_WAITLISTED, $second->fresh()->status);
        $this->assertMeetLinkSentTo('benoit@example.com');
        Notification::assertSentOnDemandTimes(FormationEnrollmentConfirmation::class, 1);
    }

    public function test_deleting_a_registration_or_raising_the_capacity_frees_seats_for_the_waitlist(): void
    {
        Notification::fake();
        $session = $this->createLiveSession(capacity: 1);
        $registered = $this->enrollIn($session, 'aline@example.com', FormationEnrollment::STATUS_REGISTERED);
        $first = $this->enrollIn($session, 'benoit@example.com', FormationEnrollment::STATUS_WAITLISTED);
        $second = $this->enrollIn($session, 'chloe@example.com', FormationEnrollment::STATUS_WAITLISTED);
        $third = $this->enrollIn($session, 'david@example.com', FormationEnrollment::STATUS_WAITLISTED);
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $this->delete(route('admin.formation-enrollments.destroy', $registered))->assertRedirect();
        $this->assertSame(FormationEnrollment::STATUS_REGISTERED, $first->fresh()->status);

        $this->patch(route('admin.formations.sessions.update', $session), [
            'starts_at' => $session->starts_at->format('Y-m-d H:i:s'),
            'capacity' => 2,
            'published' => true,
        ])->assertRedirect();

        $this->assertSame(FormationEnrollment::STATUS_REGISTERED, $second->fresh()->status);
        $this->assertSame(FormationEnrollment::STATUS_WAITLISTED, $third->fresh()->status);
        $this->assertMeetLinkSentTo('chloe@example.com');
    }

    public function test_moving_someone_off_the_waitlist_by_hand_sends_them_the_meet_link(): void
    {
        Notification::fake();
        $session = $this->createLiveSession(capacity: 1);
        $this->enrollIn($session, 'aline@example.com', FormationEnrollment::STATUS_REGISTERED);
        $waitlisted = $this->enrollIn($session, 'benoit@example.com', FormationEnrollment::STATUS_WAITLISTED);
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $this->patch(route('admin.formation-enrollments.update', $waitlisted), ['status' => FormationEnrollment::STATUS_REGISTERED])
            ->assertRedirect();

        $this->assertMeetLinkSentTo('benoit@example.com');
    }

    public function test_past_sessions_do_not_promote_the_waitlist_and_unknown_statuses_are_rejected(): void
    {
        Notification::fake();
        $session = $this->createLiveSession(capacity: 1, startsAt: now()->subHour());
        $registered = $this->enrollIn($session, 'aline@example.com', FormationEnrollment::STATUS_REGISTERED);
        $waitlisted = $this->enrollIn($session, 'benoit@example.com', FormationEnrollment::STATUS_WAITLISTED);
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $this->patch(route('admin.formation-enrollments.update', $registered), ['status' => 'présente'])
            ->assertSessionHasErrors('status');
        $this->patch(route('admin.formation-enrollments.update', $registered), ['status' => FormationEnrollment::STATUS_CANCELLED]);

        $this->assertSame(FormationEnrollment::STATUS_WAITLISTED, $waitlisted->fresh()->status);
        Notification::assertNothingSent();
    }

    public function test_a_cancelled_person_can_enroll_again_in_the_same_session(): void
    {
        Notification::fake();
        $session = $this->createLiveSession(capacity: 5);
        $this->enrollIn($session, 'aline@example.com', FormationEnrollment::STATUS_CANCELLED);

        $this->post(route('formations.enroll', $session->formation), [
            'name' => 'Aline M.',
            'email' => 'aline@example.com',
            'formation_session_id' => $session->id,
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('formation_enrollments', [
            'email' => 'aline@example.com',
            'status' => FormationEnrollment::STATUS_REGISTERED,
        ]);
    }

    private function enrollIn(FormationSession $session, string $email, string $status): FormationEnrollment
    {
        return $session->enrollments()->create([
            'formation_id' => $session->formation_id,
            'name' => 'Participant',
            'email' => $email,
            'status' => $status,
        ]);
    }

    private function assertMeetLinkSentTo(string $email): void
    {
        Notification::assertSentOnDemand(
            FormationEnrollmentConfirmation::class,
            function (FormationEnrollmentConfirmation $notification, array $channels, object $notifiable) use ($email): bool {
                if ($notifiable->routes['mail'] !== $email || ! $notification->promoted) {
                    return false;
                }

                $content = $notification->content();

                return $content['kind'] === 'promoted' && str_contains((string) $content['joinUrl'], '/rejoindre?signature=');
            },
        );
    }

    private function createLiveSession(int $capacity, ?\DateTimeInterface $startsAt = null): FormationSession
    {
        $formation = Formation::create([
            'title' => 'Laravel en direct',
            'slug' => 'laravel-en-direct-'.fake()->unique()->numberBetween(1, 99999),
            'excerpt' => 'Une formation pratique.',
            'category' => 'Laravel',
            'is_free' => true,
            'published' => true,
        ]);

        return FormationSession::create([
            'formation_id' => $formation->id,
            'starts_at' => $startsAt ?? now()->addWeek(),
            'meet_url' => 'https://meet.google.com/example',
            'capacity' => $capacity,
            'published' => true,
        ]);
    }

    public function test_an_admin_can_update_a_formation(): void
    {
        $formation = Formation::create([
            'title' => 'Ancien titre',
            'slug' => 'ancien-titre',
            'excerpt' => 'Une formation pratique.',
            'category' => 'Laravel',
            'published' => true,
        ]);

        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $response = $this->put(route('admin.formations.update', $formation), [
            'title' => 'Nouveau titre',
            'excerpt' => 'Une nouvelle description.',
            'content' => '# Programme',
            'category' => 'Laravel',
            'tags' => ['Backend'],
            'level' => 'débutant',
            'language' => 'Français',
            'format' => 'Cours en ligne',
            'target_audience' => 'Débutants',
            'prerequisites' => 'Aucun',
            'outcomes' => ['Créer une application'],
            'cta_label' => 'S’inscrire',
            'cta_url' => '',
            'duration_hours' => 8,
            'lessons_count' => 12,
            'is_free' => true,
            'featured' => false,
            'published' => true,
            'sort_order' => 1,
        ]);

        $response->assertRedirect(route('admin.formations.index'));
        $this->assertDatabaseHas('formations', [
            'id' => $formation->id,
            'title' => 'Nouveau titre',
            'slug' => 'nouveau-titre',
        ]);
    }

    public function test_an_admin_can_manage_formation_sessions(): void
    {
        $formation = Formation::create([
            'title' => 'Session Laravel',
            'slug' => 'session-laravel',
            'excerpt' => 'Une formation pratique.',
            'category' => 'Laravel',
            'published' => true,
        ]);
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $response = $this->post(route('admin.formations.sessions.store', $formation), [
            'title' => 'Samedi pratique',
            'starts_at' => now()->addWeek()->format('Y-m-d H:i:s'),
            'ends_at' => now()->addWeek()->addHours(2)->format('Y-m-d H:i:s'),
            'meet_url' => 'https://meet.google.com/example',
            'capacity' => 20,
            'published' => true,
        ]);

        $response->assertRedirect();
        $session = FormationSession::firstOrFail();
        $this->assertSame('Samedi pratique', $session->title);

        $this->patch(route('admin.formations.sessions.update', $session), [
            'title' => 'Samedi pratique avancé',
            'starts_at' => $session->starts_at->format('Y-m-d H:i:s'),
            'capacity' => 25,
            'published' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('formation_sessions', [
            'id' => $session->id,
            'title' => 'Samedi pratique avancé',
            'capacity' => 25,
        ]);
    }
}
