<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectsIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_projects_page_lists_only_published_projects_with_filter_data(): void
    {
        Project::create([
            'title' => 'MrMarket',
            'slug' => 'mrmarket',
            'project_type' => 'mobile',
            'description' => 'Gestion de marché.',
            'tags' => ['Flutter', 'Laravel'],
            'published' => true,
            'sort_order' => 1,
        ]);
        Project::create([
            'title' => 'Brouillon',
            'slug' => 'brouillon',
            'project_type' => 'web',
            'description' => 'Pas encore publié.',
            'published' => false,
            'sort_order' => 2,
        ]);

        $response = $this->get(route('projects.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Index')
            ->has('projects', 1)
            ->where('projects.0.slug', 'mrmarket')
            ->where('projects.0.project_type', 'mobile')
            ->where('projects.0.tags', ['Flutter', 'Laravel']));
    }
}
