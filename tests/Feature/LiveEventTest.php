<?php

namespace Tests\Feature;

use App\Models\Formation;
use App\Models\FormationEnrollment;
use App\Models\FormationSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LiveEventTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        Cache::flush();
    }

    private function createFormation(bool $isFree = true, bool $isPublished = true, string $slug = 'laravel-en-direct'): Formation
    {
        return Formation::create([
            'title' => 'Laravel en direct',
            'slug' => $slug,
            'excerpt' => 'Une formation pratique.',
            'category' => 'Laravel',
            'is_free' => $isFree,
            'published' => $isPublished,
        ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function createSession(Formation $formation, array $attributes = []): FormationSession
    {
        return FormationSession::create([
            'formation_id' => $formation->id,
            'starts_at' => now()->addDays(3),
            'meet_url' => 'https://meet.google.com/secret-room',
            'published' => true,
            ...$attributes,
        ]);
    }

    public function test_every_public_page_announces_the_next_session_without_the_meet_link(): void
    {
        $formation = $this->createFormation();
        $later = $this->createSession($formation, ['starts_at' => now()->addDays(9)]);
        $next = $this->createSession($formation, ['starts_at' => now()->addDays(2)->setTime(19, 0)]);

        foreach (['/', '/blog', '/projects', '/formations'] as $page) {
            $this->get($page)
                ->assertOk()
                ->assertInertia(fn (Assert $inertia) => $inertia
                    ->where('liveEvent.id', $next->id)
                    ->where('liveEvent.title', 'Laravel en direct')
                    ->where('liveEvent.url', route('formations.show', $formation).'?session='.$next->id.'#inscription')
                    ->where('liveEvent.starts_at', $next->starts_at->toIso8601String())
                    ->where('liveEvent.ends_at', $next->starts_at->copy()->addHours(2)->toIso8601String())
                    ->where('liveEvent.is_full', false)
                    ->missing('liveEvent.meet_url')
                );
        }

        $this->assertNotSame($later->id, $next->id);
        $this->get('/')->assertDontSee('secret-room');
    }

    public function test_a_session_in_progress_is_still_announced_until_it_ends(): void
    {
        $session = $this->createSession($this->createFormation(), [
            'starts_at' => now()->subMinutes(30),
            'ends_at' => now()->addMinutes(30),
        ]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('liveEvent.id', $session->id));
    }

    public function test_finished_hidden_paid_or_unpublished_sessions_are_not_announced(): void
    {
        $this->createSession($this->createFormation(), ['starts_at' => now()->subHours(3)]);
        $this->createSession($this->createFormation(slug: 'cachee'), ['published' => false]);
        $this->createSession($this->createFormation(isFree: false, slug: 'payante'));
        $this->createSession($this->createFormation(isPublished: false, slug: 'brouillon'));

        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('liveEvent', null));
    }

    public function test_the_announcement_updates_when_the_session_fills_up(): void
    {
        $formation = $this->createFormation();
        $session = $this->createSession($formation, ['capacity' => 1]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('liveEvent.is_full', false));

        FormationEnrollment::create([
            'formation_id' => $formation->id,
            'formation_session_id' => $session->id,
            'name' => 'Awa',
            'email' => 'awa@example.com',
            'status' => 'nouvelle',
        ]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('liveEvent.is_full', true));

        $session->update(['published' => false]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('liveEvent', null));
    }

    public function test_admin_pages_do_not_receive_the_announcement(): void
    {
        $this->createSession($this->createFormation());
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $this->get('/admin/formations')->assertInertia(fn (Assert $page) => $page->where('liveEvent', null));
    }
}
