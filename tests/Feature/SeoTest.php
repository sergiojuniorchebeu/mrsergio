<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\Formation;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders_core_seo_tags(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertSee('<link rel="canonical" href="'.route('home').'">', false);
        $response->assertSee('Développement web et Android', false);
        $response->assertSee('application/ld+json', false);
        $response->assertSee('"@type":"Person"', false);
    }

    public function test_project_page_uses_project_cover_in_social_meta_tags(): void
    {
        $project = Project::create([
            'title' => 'KennHosting Platform',
            'slug' => 'kennhosting-platform',
            'project_type' => 'web',
            'description' => 'Plateforme web pour la gestion de services d’hébergement.',
            'image' => 'projects/kennhosting-cover.png',
            'published' => true,
        ]);

        $response = $this->get(route('projects.show', $project));

        $response->assertOk();
        $response->assertSee(
            '<meta property="og:image" content="'.asset('storage/projects/kennhosting-cover.png').'">',
            false
        );
        $response->assertSee(
            '<link rel="canonical" href="'.route('projects.show', $project).'">',
            false
        );
        $response->assertSee('"@type":"CreativeWork"', false);
    }

    public function test_blog_page_uses_article_cover_and_article_schema(): void
    {
        $post = BlogPost::create([
            'title' => 'Déployer une application Laravel proprement',
            'slug' => 'deployer-une-application-laravel-proprement',
            'excerpt' => 'Les points clés pour un déploiement web plus propre.',
            'content' => 'Contenu de démonstration pour le référencement.',
            'cover_image' => 'blog/laravel-deploy-cover.png',
            'published' => true,
            'published_at' => now(),
        ]);

        $response = $this->get(route('blog.show', $post));

        $response->assertOk();
        $response->assertSee(
            '<meta property="og:image" content="'.asset('storage/blog/laravel-deploy-cover.png').'">',
            false
        );
        $response->assertSee('<meta property="og:type" content="article">', false);
        $response->assertSee('"@type":"BlogPosting"', false);
    }

    public function test_sitemap_lists_public_pages_and_published_content_only(): void
    {
        $publishedProject = Project::create([
            'title' => 'Projet public',
            'slug' => 'projet-public',
            'project_type' => 'web',
            'description' => 'Visible dans le sitemap.',
            'published' => true,
        ]);

        Project::create([
            'title' => 'Projet privé',
            'slug' => 'projet-prive',
            'project_type' => 'web',
            'description' => 'Non visible dans le sitemap.',
            'published' => false,
        ]);

        $publishedPost = BlogPost::create([
            'title' => 'Article public',
            'slug' => 'article-public',
            'excerpt' => 'Visible dans le sitemap.',
            'published' => true,
            'published_at' => now(),
        ]);

        $publishedFormation = Formation::create([
            'title' => 'Formation Laravel',
            'slug' => 'formation-laravel',
            'excerpt' => 'Visible dans le sitemap.',
            'category' => 'Laravel',
            'published' => true,
        ]);

        $response = $this->get(route('sitemap'));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml');
        $response->assertSee(route('home'), false);
        $response->assertSee(route('projects.show', $publishedProject), false);
        $response->assertSee(route('blog.show', $publishedPost), false);
        $response->assertSee(route('formations.show', $publishedFormation), false);
        $response->assertDontSee('projet-prive', false);
    }
}
