<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\Formation;
use App\Models\FormationEnrollment;
use App\Models\FormationSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminFormationsIndexTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    private function createFormation(string $slug = 'laravel-en-direct'): Formation
    {
        return Formation::withoutEvents(fn () => Formation::create([
            'title' => 'Laravel en direct',
            'slug' => $slug,
            'excerpt' => 'Une formation pratique.',
            'category' => 'Laravel',
            'is_free' => true,
            'published' => true,
        ]));
    }

    private function enroll(Formation $formation, string $status, ?FormationSession $session = null): void
    {
        FormationEnrollment::create([
            'formation_id' => $formation->id,
            'formation_session_id' => $session?->id,
            'name' => 'Awa',
            'email' => fake()->unique()->safeEmail(),
            'status' => $status,
        ]);
    }

    public function test_the_list_shows_the_next_session_and_pending_enrollments(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $formation = $this->createFormation();
        $this->createFormation('sans-session');
        FormationSession::create(['formation_id' => $formation->id, 'starts_at' => now()->subDay(), 'published' => true]);
        $nextSession = FormationSession::create(['formation_id' => $formation->id, 'starts_at' => now()->addDays(3)->setTime(18, 0), 'published' => true]);
        FormationSession::create(['formation_id' => $formation->id, 'starts_at' => now()->addDays(10), 'published' => false]);
        $this->enroll($formation, 'inscrite', $nextSession);
        $this->enroll($formation, 'en_attente', $nextSession);
        $this->enroll($formation, 'inscrite');
        $this->enroll($formation, 'inscrite');
        $this->enroll($formation, 'traitée');

        $this->get('/admin/formations')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Formations/Index')
                ->where('formations.0.upcoming_sessions_count', 2)
                ->where('formations.0.pending_enrollments_count', 2)
                ->where('formations.0.next_session.starts_at', $nextSession->starts_at->toIso8601String())
                ->where('formations.0.next_session.time_label', '18h00')
                ->missing('formations.0.sessions')
                ->where('formations.1.next_session', null)
                ->where('formations.1.upcoming_sessions_count', 0)
            );
    }

    public function test_admin_pages_share_sidebar_counts(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $formation = $this->createFormation();
        $this->enroll($formation, 'inscrite');
        $this->enroll($formation, 'traitée');
        $this->enroll($formation, 'inscrite', FormationSession::create(['formation_id' => $formation->id, 'starts_at' => now()->addDay(), 'published' => true]));
        ContactMessage::create(['name' => 'Awa', 'email' => 'awa@example.com', 'subject' => 'Projet', 'message' => 'Bonjour', 'read' => false]);
        ContactMessage::create(['name' => 'Awa', 'email' => 'awa@example.com', 'subject' => 'Projet', 'message' => 'Bonjour', 'read' => true]);

        $this->get('/admin/formations')
            ->assertInertia(fn (Assert $page) => $page
                ->where('adminCounts.messages', 1)
                ->where('adminCounts.enrollments', 1)
            );
    }

    public function test_public_pages_do_not_receive_sidebar_counts(): void
    {
        $this->get('/formations')
            ->assertInertia(fn (Assert $page) => $page->where('adminCounts', null));
    }
}
