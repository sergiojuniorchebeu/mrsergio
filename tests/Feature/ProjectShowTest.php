<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectShowTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function createProject(array $attributes = []): Project
    {
        return Project::create(array_merge([
            'title' => 'MrMarket — App de gestion de marché',
            'slug' => 'mrmarket',
            'project_type' => 'web',
            'description' => 'Gestion de marché local.',
            'content' => "## Contexte\n\nUn marché à digitaliser.\n\n## Stack technique\n\n- **Backend** : Laravel",
            'tags' => ['Laravel', 'Flutter'],
            'platforms' => ['Web'],
            'featured' => true,
            'published' => true,
            'sort_order' => 1,
        ], $attributes));
    }

    public function test_published_project_renders_case_study_with_markdown_content(): void
    {
        $project = $this->createProject();

        $response = $this->get(route('projects.show', $project));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Show')
            ->where('project.slug', 'mrmarket')
            ->where('project.title', 'MrMarket — App de gestion de marché')
            ->where('project.content', $project->content)
            ->where('project.platforms', ['Web'])
            ->where('project.private_repo', false)
            ->has('project.created_at')
            ->has('related'));
    }

    public function test_related_projects_exclude_the_current_project(): void
    {
        $project = $this->createProject();
        $this->createProject(['title' => 'DevConnect', 'slug' => 'devconnect', 'sort_order' => 2]);
        $this->createProject(['title' => 'Brouillon', 'slug' => 'brouillon', 'published' => false, 'sort_order' => 3]);

        $response = $this->get(route('projects.show', $project));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Show')
            ->has('related', 1)
            ->where('related.0.slug', 'devconnect'));
    }

    public function test_unpublished_project_returns_not_found(): void
    {
        $project = $this->createProject(['slug' => 'prive', 'published' => false]);

        $this->get(route('projects.show', $project))->assertNotFound();
    }
}
