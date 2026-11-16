<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $projects = Cache::remember(Project::localizedCacheKey('projects.index'), 600, function () {
            return Project::published()
                ->ordered()
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->translated('title'),
                    'slug' => $p->slug,
                    'project_type' => $p->project_type,
                    'project_type_label' => $p->project_type_label,
                    'description' => $p->translated('description'),
                    'image_url' => $p->image_url,
                    'demo_url' => $p->demo_url,
                    'github_url' => $p->github_url,
                    'private_repo' => (bool) $p->private_repo,
                    'platforms' => $p->platforms ?? [],
                    'store_links' => $p->store_links ?? [],
                    'screenshots' => $p->screenshots ?? [],
                    'screenshots_urls' => $p->screenshots_urls,
                    'tags' => $p->tags ?? [],
                    'featured' => (bool) $p->featured,
                ]);
        });

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'seo' => [
                'title' => 'Projets | Sergio Junior Chebeu',
                'description' => 'Une sélection de projets web, mobile et produit pensés pour être utiles, performants et agréables à utiliser.',
                'image' => asset('images/profile_avatar.jpg'),
                'type' => 'website',
                'canonical' => route('projects.index'),
                'json_ld' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'CollectionPage',
                    'name' => 'Projets de Sergio Junior Chebeu',
                    'url' => route('projects.index'),
                    'description' => 'Études de cas, applications web et produits digitaux réalisés par Sergio Junior Chebeu.',
                ],
            ],
        ]);
    }

    public function show(Project $project): Response
    {
        abort_unless($project->published, 404);

        $related = Cache::remember(Project::localizedCacheKey("projects.related.{$project->id}"), 600, function () use ($project) {
            return Project::published()
                ->where('id', '!=', $project->id)
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->translated('title'),
                    'slug' => $p->slug,
                    'project_type' => $p->project_type,
                    'project_type_label' => $p->project_type_label,
                    'description' => $p->translated('description'),
                    'image_url' => $p->image_url,
                    'demo_url' => $p->demo_url,
                    'github_url' => $p->github_url,
                    'private_repo' => (bool) $p->private_repo,
                    'platforms' => $p->platforms ?? [],
                    'store_links' => $p->store_links ?? [],
                    'screenshots' => $p->screenshots ?? [],
                    'screenshots_urls' => $p->screenshots_urls,
                    'tags' => $p->tags ?? [],
                    'featured' => (bool) $p->featured,
                ]);
        });

        return Inertia::render('Projects/Show', [
            'project' => [
                'id' => $project->id,
                'title' => $project->translated('title'),
                'slug' => $project->slug,
                'project_type' => $project->project_type,
                'project_type_label' => $project->project_type_label,
                'description' => $project->translated('description'),
                'content' => $project->translated('content'),
                'image_url' => $project->image_url,
                'demo_url' => $project->demo_url,
                'github_url' => $project->github_url,
                'private_repo' => (bool) $project->private_repo,
                'tags' => $project->tags ?? [],
                'platforms' => $project->platforms ?? [],
                'store_links' => $project->store_links ?? [],
                'screenshots' => $project->screenshots_urls,
                'screenshots_urls' => $project->screenshots_urls,
                'featured' => (bool) $project->featured,
                'created_at' => $project->created_at->format('d/m/Y'),
            ],
            'related' => $related,
            'seo' => [
                'title' => $project->translated('title').' | Projet',
                'description' => $project->translated('description'),
                'image' => $project->image_url,
                'type' => 'article',
                'canonical' => route('projects.show', $project),
                'json_ld' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'CreativeWork',
                    'name' => $project->translated('title'),
                    'description' => $project->translated('description'),
                    'image' => [$project->image_url],
                    'url' => route('projects.show', $project),
                    'author' => [
                        '@type' => 'Person',
                        'name' => 'Sergio Junior Chebeu',
                    ],
                ],
            ],
        ]);
    }
}
