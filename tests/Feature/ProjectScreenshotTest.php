<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectScreenshotTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_admin_can_remove_existing_project_screenshots_and_add_new_ones(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('projects/screenshots/old.png', 'old');

        $project = Project::create([
            'title' => 'Projet existant',
            'slug' => 'projet-existant',
            'project_type' => 'web',
            'description' => 'Description du projet.',
            'screenshots' => ['projects/screenshots/old.png'],
            'published' => true,
        ]);

        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $response = $this->put(route('admin.projects.update', $project), [
            'title' => $project->title,
            'project_type' => 'web',
            'description' => $project->description,
            'content' => '',
            'demo_url' => '',
            'github_url' => '',
            'private_repo' => '0',
            'featured' => '0',
            'published' => '1',
            'sort_order' => '0',
            'screenshots_keep' => [],
            'screenshots' => [
                UploadedFile::fake()->image('new.png'),
            ],
        ]);

        $response->assertRedirect(route('admin.projects.index'));
        $project->refresh();

        $this->assertCount(1, $project->screenshots);
        $this->assertStringContainsString('projects/screenshots/', $project->screenshots[0]);
        Storage::disk('public')->assertMissing('projects/screenshots/old.png');
    }
}
