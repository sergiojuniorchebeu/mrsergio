<?php

namespace Tests\Feature;

use App\Models\Formation;
use App\Models\FormationSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FormationShowTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function createFormation(array $attributes = []): Formation
    {
        return Formation::create(array_merge([
            'title' => 'Laravel pour débuter',
            'slug' => 'laravel-pour-debuter',
            'excerpt' => 'Une formation pratique.',
            'content' => "## Module 1\n\nLes routes.",
            'category' => 'Laravel',
            'published' => true,
        ], $attributes));
    }

    public function test_published_formation_renders_detail_page_with_content(): void
    {
        $formation = $this->createFormation();

        $response = $this->get(route('formations.show', $formation));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('formations/FormationsShow')
            ->where('formation.slug', 'laravel-pour-debuter')
            ->where('formation.content', $formation->content)
            ->where('formation.category', 'Laravel')
            ->has('formation.level')
            ->has('formation.is_free')
            ->has('formation.price_formatted')
            ->has('formation.duration_formatted')
            ->has('related'));
    }

    public function test_related_formations_exclude_the_current_and_unpublished_formations(): void
    {
        $formation = $this->createFormation();
        $this->createFormation(['title' => 'Flutter avancé', 'slug' => 'flutter-avance', 'category' => 'Flutter']);
        $this->createFormation(['title' => 'Brouillon', 'slug' => 'brouillon', 'published' => false]);

        $response = $this->get(route('formations.show', $formation));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('formations/FormationsShow')
            ->has('related', 1)
            ->where('related.0.slug', 'flutter-avance'));
    }

    public function test_unpublished_formation_returns_not_found(): void
    {
        $formation = $this->createFormation(['slug' => 'formation-privee', 'published' => false]);

        $this->get(route('formations.show', $formation))->assertNotFound();
    }

    public function test_free_formation_exposes_upcoming_sessions_without_the_meet_link(): void
    {
        $formation = $this->createFormation(['is_free' => true]);
        FormationSession::create([
            'formation_id' => $formation->id,
            'starts_at' => now()->addWeek(),
            'meet_url' => 'https://meet.google.com/private-room',
            'capacity' => 15,
            'published' => true,
        ]);

        $response = $this->get(route('formations.show', $formation));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('formation.sessions', 1)
            ->where('formation.sessions.0.capacity', 15)
            ->missing('formation.sessions.0.meet_url'));
        $this->assertStringNotContainsString('private-room', $response->getContent());
    }
}
