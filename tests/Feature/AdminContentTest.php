<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminContentTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
    }

    private function createPost(): BlogPost
    {
        return BlogPost::create([
            'title' => 'Un article',
            'slug' => 'un-article',
            'excerpt' => 'Résumé.',
            'content' => 'Contenu.',
            'published' => true,
            'published_at' => now(),
        ]);
    }

    public function test_admin_can_toggle_project_publication_without_full_payload(): void
    {
        $this->actingAsAdmin();
        $project = Project::create([
            'title' => 'MrMarket',
            'slug' => 'mrmarket',
            'project_type' => 'web',
            'description' => 'Gestion de marché.',
            'published' => false,
        ]);

        $this->from('/admin/projects')
            ->patch(route('admin.projects.toggle', $project), ['published' => true])
            ->assertRedirect('/admin/projects');

        $this->assertTrue($project->fresh()->published);
    }

    public function test_admin_can_toggle_blog_post_publication_without_full_payload(): void
    {
        $this->actingAsAdmin();
        $post = $this->createPost();

        $this->from('/admin/blog')
            ->patch(route('admin.blog.toggle', $post), ['published' => false])
            ->assertRedirect('/admin/blog');

        $this->assertFalse($post->fresh()->published);
    }

    public function test_admin_comment_deletion_redirects_for_inertia_requests(): void
    {
        $this->actingAsAdmin();
        $comment = $this->createPost()->comments()->create(['author_name' => 'Awa', 'content' => 'Merci', 'ip_address' => '127.0.0.1']);

        $this->from('/admin/blog/1/comments')
            ->delete(route('admin.blog-comments.destroy', $comment))
            ->assertRedirect('/admin/blog/1/comments')
            ->assertSessionHas('success', 'Commentaire supprimé.');

        $this->assertModelMissing($comment);
    }

    public function test_comment_deletion_still_returns_json_for_fetch_requests(): void
    {
        $this->actingAsAdmin();
        $comment = $this->createPost()->comments()->create(['author_name' => 'Awa', 'content' => 'Merci', 'ip_address' => '127.0.0.1']);

        $this->deleteJson(route('admin.blog-comments.destroy', $comment))
            ->assertOk()
            ->assertJson(['deleted' => $comment->id]);
    }

    public function test_dashboard_exposes_pending_work_counts(): void
    {
        $this->actingAsAdmin();
        $this->createPost()->comments()->create(['author_name' => 'Awa', 'content' => 'Merci', 'ip_address' => '127.0.0.1']);

        $this->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->where('stats.comments_week', 1)
                ->where('stats.enrollments_new', 0)
                ->has('recent_messages'));
    }

    public function test_flash_messages_are_shared_with_inertia_pages(): void
    {
        $this->actingAsAdmin();

        $this->withSession(['success' => 'Projet créé.'])
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('flash.success', 'Projet créé.')
                ->where('flash.error', null));
    }
}
