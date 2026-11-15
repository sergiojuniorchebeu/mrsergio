<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BlogShowTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function createPost(array $attributes = []): BlogPost
    {
        return BlogPost::create(array_merge([
            'title' => 'Déployer une application Laravel proprement',
            'slug' => 'deployer-laravel',
            'excerpt' => 'Les points clés pour un déploiement propre.',
            'content' => "## Préparer le serveur\n\nUn serveur propre.\n\n### Les variables\n\nLe fichier .env.",
            'tags' => ['Laravel', 'DevOps'],
            'published' => true,
            'published_at' => now(),
            'sort_order' => 1,
        ], $attributes));
    }

    public function test_published_post_renders_reading_page_with_markdown_and_comments(): void
    {
        $post = $this->createPost();
        $post->comments()->create(['author_name' => 'Awa', 'content' => 'Très clair, merci.', 'ip_address' => '127.0.0.1']);

        $response = $this->get(route('blog.show', $post));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Blog/Show')
            ->where('post.slug', 'deployer-laravel')
            ->where('post.content', $post->content)
            ->where('post.tags', ['Laravel', 'DevOps'])
            ->where('post.likes_count', 0)
            ->where('post.liked', false)
            ->has('comments', 1)
            ->where('comments.0.author_name', 'Awa')
            ->where('comments.0.content', 'Très clair, merci.')
            ->has('related'));
    }

    public function test_related_posts_exclude_the_current_and_unpublished_posts(): void
    {
        $post = $this->createPost();
        $this->createPost(['title' => 'Flutter et Firebase', 'slug' => 'flutter-firebase', 'sort_order' => 2]);
        $this->createPost(['title' => 'Brouillon', 'slug' => 'brouillon', 'published' => false, 'sort_order' => 3]);

        $response = $this->get(route('blog.show', $post));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Blog/Show')
            ->has('related', 1)
            ->where('related.0.slug', 'flutter-firebase'));
    }

    public function test_unpublished_post_returns_not_found(): void
    {
        $post = $this->createPost(['slug' => 'brouillon-prive', 'published' => false]);

        $this->get(route('blog.show', $post))->assertNotFound();
    }
}
