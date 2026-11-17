<?php

namespace Tests\Feature;

use App\Models\Formation;
use App\Models\FormationEnrollment;
use App\Models\FormationSession;
use App\Notifications\FormationEnrollmentConfirmation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Notifications\ChannelManager;
use Illuminate\Notifications\SendQueuedNotifications;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FormationEnrollmentLinkTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        Notification::fake();
    }

    private function createSession(int $capacity = 1, ?\DateTimeInterface $startsAt = null): FormationSession
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
            'meet_url' => 'https://meet.google.com/secret-room',
            'capacity' => $capacity,
            'published' => true,
        ]);
    }

    private function enroll(FormationSession $session, string $email, string $status = FormationEnrollment::STATUS_REGISTERED): FormationEnrollment
    {
        return $session->enrollments()->create([
            'formation_id' => $session->formation_id,
            'name' => 'Aline M.',
            'email' => $email,
            'status' => $status,
        ]);
    }

    public function test_the_cancel_link_asks_for_confirmation_before_cancelling(): void
    {
        $enrollment = $this->enroll($this->createSession(), 'aline@example.com');

        $this->get($enrollment->cancelUrl())
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('formations/EnrollmentCancel')
                ->where('enrollment.can_cancel', true)
                ->where('enrollment.status', FormationEnrollment::STATUS_REGISTERED)
                ->where('formation.title', 'Laravel en direct')
                ->missing('enrollment.email')
            );

        $this->assertSame(FormationEnrollment::STATUS_REGISTERED, $enrollment->fresh()->status);
    }

    public function test_cancelling_from_the_email_frees_the_seat_for_the_waitlist(): void
    {
        $session = $this->createSession();
        $enrollment = $this->enroll($session, 'aline@example.com');
        $waitlisted = $this->enroll($session, 'benoit@example.com', FormationEnrollment::STATUS_WAITLISTED);

        $this->post($enrollment->cancelUrl())->assertRedirect($enrollment->cancelUrl());

        $this->assertSame(FormationEnrollment::STATUS_CANCELLED, $enrollment->fresh()->status);
        $this->assertSame(FormationEnrollment::STATUS_REGISTERED, $waitlisted->fresh()->status);
        Notification::assertSentOnDemand(
            FormationEnrollmentConfirmation::class,
            fn (FormationEnrollmentConfirmation $notification, array $channels, object $notifiable): bool => $notifiable->routes['mail'] === 'benoit@example.com' && $notification->promoted,
        );
    }

    public function test_links_without_a_valid_signature_are_refused(): void
    {
        $enrollment = $this->enroll($this->createSession(), 'aline@example.com');
        $other = $this->enroll($this->createSession(), 'benoit@example.com');

        $this->get(route('formations.enrollments.cancel', $enrollment))->assertForbidden();
        $this->post(route('formations.enrollments.cancel', $enrollment))->assertForbidden();
        $this->get(str_replace("/inscriptions/{$other->id}/", "/inscriptions/{$enrollment->id}/", $other->joinUrl()))->assertForbidden();

        $this->assertSame(FormationEnrollment::STATUS_REGISTERED, $enrollment->fresh()->status);
    }

    public function test_a_started_session_can_no_longer_be_cancelled(): void
    {
        $enrollment = $this->enroll($this->createSession(startsAt: now()->subMinutes(5)), 'aline@example.com');

        $this->get($enrollment->cancelUrl())
            ->assertInertia(fn (Assert $page) => $page->where('enrollment.can_cancel', false));
        $this->post($enrollment->cancelUrl());

        $this->assertSame(FormationEnrollment::STATUS_REGISTERED, $enrollment->fresh()->status);
    }

    public function test_joining_during_the_live_marks_attendance_and_opens_meet(): void
    {
        $enrollment = $this->enroll($this->createSession(startsAt: now()->addMinutes(10)), 'aline@example.com');

        $this->get($enrollment->joinUrl())->assertRedirect('https://meet.google.com/secret-room');
        $firstVisit = $enrollment->fresh()->attended_at;
        $this->assertNotNull($firstVisit);

        $this->travel(20)->minutes();
        $this->get($enrollment->joinUrl())->assertRedirect('https://meet.google.com/secret-room');
        $this->assertEquals($firstVisit, $enrollment->fresh()->attended_at);
    }

    public function test_opening_the_link_long_before_the_live_does_not_count_as_attendance(): void
    {
        $enrollment = $this->enroll($this->createSession(startsAt: now()->addMinutes(30)), 'aline@example.com');

        $this->get($enrollment->joinUrl())->assertRedirect('https://meet.google.com/secret-room');

        $this->assertNull($enrollment->fresh()->attended_at);
    }

    public function test_waitlisted_or_cancelled_people_cannot_join(): void
    {
        $session = $this->createSession(startsAt: now()->addMinutes(5));
        $waitlisted = $this->enroll($session, 'aline@example.com', FormationEnrollment::STATUS_WAITLISTED);
        $cancelled = $this->enroll($session, 'benoit@example.com', FormationEnrollment::STATUS_CANCELLED);

        foreach ([$waitlisted, $cancelled] as $enrollment) {
            $this->get($enrollment->joinUrl())
                ->assertRedirect(route('formations.show', $session->formation))
                ->assertSessionHas('error');
            $this->assertNull($enrollment->fresh()->attended_at);
        }
    }

    public function test_the_reminder_email_is_branded_and_uses_the_personal_join_link(): void
    {
        $enrollment = $this->enroll($this->createSession(startsAt: now()->addMinutes(30)), 'aline@example.com');
        $enrollment->load(['formation', 'session']);
        $notification = new FormationEnrollmentConfirmation($enrollment, reminder: true);
        $notifiable = (new AnonymousNotifiable)->route('mail', 'aline@example.com');

        $mail = $notification->toMail($notifiable);
        $html = (string) $mail->render();

        $this->assertSame("C'est bientôt : Laravel en direct", $mail->subject);
        $this->assertStringContainsString('Rejoindre le live', $html);
        $this->assertStringContainsString(e($enrollment->joinUrl()), $html);
        $this->assertStringContainsString(e($enrollment->cancelUrl()), $html);
        $this->assertStringContainsString('data:image/png;base64,', $html);
        $this->assertStringNotContainsString('secret-room', $html);
    }

    public function test_the_confirmation_email_offers_the_calendar_and_the_personal_link(): void
    {
        $enrollment = $this->enroll($this->createSession(), 'aline@example.com');
        $enrollment->load(['formation', 'session']);

        $content = (new FormationEnrollmentConfirmation($enrollment))->content();

        $this->assertSame('registered', $content['kind']);
        $this->assertSame('Ajouter à mon agenda', $content['primaryAction']['label']);
        $this->assertStringContainsString(urlencode($enrollment->joinUrl()), $content['primaryAction']['url']);
        $this->assertSame($enrollment->joinUrl(), $content['joinUrl']);
        $this->assertSame($enrollment->cancelUrl(), $content['cancelUrl']);
    }

    public function test_enrollment_emails_are_queued_instead_of_slowing_down_the_request(): void
    {
        Notification::swap(new ChannelManager($this->app));
        Queue::fake();
        $session = $this->createSession(capacity: 5);

        $this->post(route('formations.enroll', $session->formation), [
            'name' => 'Aline M.',
            'email' => 'aline@example.com',
            'formation_session_id' => $session->id,
        ])->assertRedirect()->assertSessionHasNoErrors();

        Queue::assertPushed(
            SendQueuedNotifications::class,
            fn (SendQueuedNotifications $job): bool => $job->notification instanceof FormationEnrollmentConfirmation
                && $job->tries === 4
                && $job->backoff() === [60, 300, 900],
        );
    }
}
