<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders_the_expected_inertia_component(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('projects')
            ->has('posts')
            ->has('formations'));
    }

    public function test_home_projects_include_the_real_project_type(): void
    {
        Project::create([
            'title' => 'Mobile CRM',
            'slug' => 'mobile-crm',
            'project_type' => 'mobile',
            'description' => 'Application mobile de gestion client.',
            'tags' => ['Flutter', 'Firebase'],
            'featured' => true,
            'published' => true,
            'sort_order' => 1,
        ]);

        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('projects', 1)
            ->where('projects.0.project_type', 'mobile')
            ->where('projects.0.project_type_label', 'Mobile'));
    }
}
