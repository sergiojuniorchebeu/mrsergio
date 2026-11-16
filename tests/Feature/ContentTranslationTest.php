<?php

namespace Tests\Feature;

use App\Jobs\TranslateContent;
use App\Models\BlogPost;
use App\Models\Formation;
use App\Models\Project;
use App\Models\User;
use App\Services\GeminiTranslator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ContentTranslationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        config(['services.gemini.key' => 'test-key', 'services.gemini.model' => 'gemini-test']);
    }

    /**
     * @param  array<string, mixed>  $translation
     */
    private function fakeGemini(array $translation, int $status = 200): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(
                $status === 200
                    ? ['candidates' => [['content' => ['parts' => [['text' => json_encode($translation)]]]]]]
                    : ['error' => ['message' => 'Quota exceeded']],
                $status,
            ),
        ]);
    }

    private function createProject(): Project
    {
        return Project::withoutEvents(fn () => Project::create([
            'title' => 'MrMarket — App de gestion de marché',
            'slug' => 'mrmarket',
            'project_type' => 'mobile',
            'description' => 'Gestion de marché local.',
            'content' => "## Contexte\n\nUn marché à digitaliser.",
            'tags' => ['Flutter'],
            'platforms' => ['Android'],
            'published' => true,
            'sort_order' => 1,
        ]));
    }

    public function test_saving_french_content_schedules_a_translation(): void
    {
        Bus::fake();

        $project = $this->createProject();
        $project->update(['description' => 'Nouvelle description.']);

        Bus::assertDispatchedAfterResponse(TranslateContent::class);
    }

    public function test_no_translation_is_scheduled_without_an_api_key(): void
    {
        config(['services.gemini.key' => null]);
        Bus::fake();

        $this->createProject()->update(['description' => 'Nouvelle description.']);

        Bus::assertNotDispatchedAfterResponse(TranslateContent::class);
    }

    public function test_the_job_stores_the_english_version_and_the_site_serves_it(): void
    {
        $project = $this->createProject();
        $this->fakeGemini([
            'title' => 'MrMarket — Market management app',
            'description' => 'Local market management.',
            'content' => "## Context\n\nA market to digitise.",
        ]);

        $this->assertTrue((new TranslateContent($project))->handle(app(GeminiTranslator::class)));

        $project->refresh();
        $this->assertFalse($project->translationIsStale());
        Http::assertSent(fn (Request $request): bool => $request->hasHeader('x-goog-api-key', 'test-key')
            && str_contains($request->url(), 'models/gemini-test:generateContent'));

        $this->withUnencryptedCookie('language', 'en')
            ->get('/projects/mrmarket')
            ->assertInertia(fn (Assert $page) => $page
                ->where('project.title', 'MrMarket — Market management app')
                ->where('project.content', "## Context\n\nA market to digitise."));

        $this->withUnencryptedCookie('language', 'fr')
            ->get('/projects/mrmarket')
            ->assertInertia(fn (Assert $page) => $page->where('project.title', 'MrMarket — App de gestion de marché'));
    }

    public function test_french_is_shown_when_no_translation_exists(): void
    {
        $this->createProject();

        $this->withUnencryptedCookie('language', 'en')
            ->get('/projects')
            ->assertInertia(fn (Assert $page) => $page->where('projects.0.description', 'Gestion de marché local.'));
    }

    public function test_public_pages_are_cached_per_language(): void
    {
        $project = $this->createProject();
        $project->storeTranslation('en', ['description' => 'Local market management.']);

        $this->withUnencryptedCookie('language', 'fr')
            ->get('/projects')
            ->assertInertia(fn (Assert $page) => $page->where('projects.0.description', 'Gestion de marché local.'));
        $this->withUnencryptedCookie('language', 'en')
            ->get('/projects')
            ->assertInertia(fn (Assert $page) => $page->where('projects.0.description', 'Local market management.'));

        $this->assertTrue(Cache::has('projects.index.fr'));
        $this->assertTrue(Cache::has('projects.index.en'));

        $project->update(['sort_order' => 2]);

        $this->assertFalse(Cache::has('projects.index.fr'));
        $this->assertFalse(Cache::has('projects.index.en'));
    }

    public function test_a_gemini_failure_keeps_the_content_untranslated(): void
    {
        $project = $this->createProject();
        $this->fakeGemini([], 429);

        $this->assertFalse((new TranslateContent($project))->handle(app(GeminiTranslator::class)));
        $this->assertTrue($project->refresh()->translationIsStale());
    }

    public function test_an_admin_can_correct_the_english_version(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $formation = Formation::withoutEvents(fn () => Formation::create([
            'title' => 'Laravel en pratique',
            'slug' => 'laravel-en-pratique',
            'excerpt' => 'Apprendre Laravel.',
            'category' => 'Laravel',
            'outcomes' => ['Créer une API'],
            'published' => true,
        ]));

        $this->get("/admin/formations/{$formation->id}/edit")
            ->assertInertia(fn (Assert $page) => $page
                ->where('translation.is_translated', false)
                ->where('translation.is_configured', true));

        $this->patch("/admin/translations/formations/{$formation->id}", [
            'values' => [
                'title' => 'Laravel in practice',
                'outcomes' => ['Build an API'],
                'slug' => 'ignored-field',
            ],
        ])->assertSessionHas('success');

        $formation->refresh();
        $this->assertSame('Laravel in practice', $formation->translations['en']['title']);
        $this->assertSame(['Build an API'], $formation->translations['en']['outcomes']);
        $this->assertArrayNotHasKey('slug', $formation->translations['en']);
        $this->assertFalse($formation->translationIsStale());
    }

    public function test_an_admin_can_regenerate_a_translation(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $post = BlogPost::withoutEvents(fn () => BlogPost::create([
            'title' => 'Mon article',
            'slug' => 'mon-article',
            'excerpt' => 'Résumé.',
            'content' => 'Contenu.',
            'published' => true,
            'published_at' => now(),
        ]));
        $this->fakeGemini(['title' => 'My article', 'excerpt' => 'Summary.', 'content' => 'Content.']);

        $this->post("/admin/translations/blog/{$post->id}/regenerate")->assertSessionHas('success');

        $this->assertSame('My article', $post->refresh()->translated('title', 'en'));
    }

    public function test_gemini_is_asked_to_limit_thinking_for_faster_translations(): void
    {
        config(['services.gemini.model' => 'gemini-3.8-flash']);
        $this->fakeGemini(['title' => 'Title']);

        app(GeminiTranslator::class)->translate(['title' => 'Titre']);

        Http::assertSent(fn ($request): bool => $request['generationConfig']['thinkingConfig'] === ['thinkingLevel' => 'low']);

        config(['services.gemini.model' => 'gemini-2.5-flash-lite']);
        app(GeminiTranslator::class)->translate(['title' => 'Titre']);

        Http::assertSent(fn ($request): bool => ($request['generationConfig']['thinkingConfig'] ?? null) === ['thinkingBudget' => 0]);
    }

    public function test_guests_cannot_edit_translations(): void
    {
        $project = $this->createProject();

        $this->patch("/admin/translations/projects/{$project->id}", ['values' => ['title' => 'Hack']])
            ->assertRedirect();

        $this->assertNull($project->refresh()->translations);
    }

    public function test_the_command_translates_stale_content(): void
    {
        $this->createProject();
        $this->fakeGemini(['title' => 'MrMarket', 'description' => 'Market.', 'content' => 'Context.']);

        $this->artisan('content:translate', ['--pause' => 0])
            ->expectsOutputToContain('1 contenu(s) traduit(s)')
            ->assertSuccessful();

        $this->artisan('content:translate', ['--pause' => 0])
            ->expectsOutputToContain('Tout est déjà traduit.')
            ->assertSuccessful();
    }
}
