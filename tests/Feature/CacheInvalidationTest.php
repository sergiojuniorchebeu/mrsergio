<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\Formation;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class CacheInvalidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_cache_is_cleared_on_save(): void
    {
        Cache::put('projects.index', 'cached-data', 600);
        Cache::put('home.projects', 'cached-data', 600);

        Project::create([
            'title' => 'Test Project',
            'slug' => 'test-project',
            'description' => 'A test project',
            'published' => true,
            'featured' => false,
            'sort_order' => 1,
        ]);

        $this->assertNull(Cache::get('projects.index'));
        $this->assertNull(Cache::get('home.projects'));
    }

    public function test_project_cache_is_cleared_on_delete(): void
    {
        $project = Project::create([
            'title' => 'Deletable Project',
            'slug' => 'deletable-project',
            'description' => 'Will be deleted',
            'published' => true,
            'featured' => false,
            'sort_order' => 1,
        ]);

        Cache::put('projects.index', 'cached-data', 600);
        Cache::put('home.projects', 'cached-data', 600);

        $project->delete();

        $this->assertNull(Cache::get('projects.index'));
        $this->assertNull(Cache::get('home.projects'));
    }

    public function test_blog_post_cache_is_cleared_on_save(): void
    {
        Cache::put('blog.index', 'cached-data', 600);
        Cache::put('home.posts', 'cached-data', 600);

        BlogPost::create([
            'title' => 'Test Post',
            'slug' => 'test-post',
            'excerpt' => 'Test excerpt',
            'published' => true,
            'sort_order' => 1,
        ]);

        $this->assertNull(Cache::get('blog.index'));
        $this->assertNull(Cache::get('home.posts'));
    }

    public function test_formation_cache_is_cleared_on_save(): void
    {
        Cache::put('formations.index', 'cached-data', 600);
        Cache::put('home.formations', 'cached-data', 600);

        Formation::create([
            'title' => 'Test Formation',
            'slug' => 'test-formation',
            'excerpt' => 'Test excerpt',
            'category' => 'Web',
            'level' => 'débutant',
            'language' => 'fr',
            'published' => true,
            'sort_order' => 1,
        ]);

        $this->assertNull(Cache::get('formations.index'));
        $this->assertNull(Cache::get('home.formations'));
    }

    public function test_blog_post_reading_time_accessor(): void
    {
        $post = new BlogPost;
        $post->content = null;

        $this->assertEquals('1 min', $post->reading_time);

        // ~400 words = 2 min
        $post->content = str_repeat('word ', 400);

        $this->assertEquals('2 min', $post->reading_time);
    }
}
