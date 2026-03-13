<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    // GET /projects
    public function index(): Response
    {
        $projects = Cache::remember('projects.index', 600, function () {
            return Project::published()
                ->ordered()
                ->get()
                ->map(fn($p) => [
                    'id'           => $p->id,
                    'title'        => $p->title,
                    'slug'         => $p->slug,
                    'description'  => $p->description,
                    'image_url'    => $p->image_url,
                    'demo_url'     => $p->demo_url,
                    'github_url'   => $p->github_url,
                    'private_repo' => (bool) $p->private_repo,
                    'platforms'    => $p->platforms ?? [],
                    'tags'         => $p->tags ?? [],
                    'featured'     => (bool) $p->featured,
                ]);
        });

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    // GET /projects/{project:slug}
    public function show(Project $project): Response
    {
        abort_unless($project->published, 404);

        $related = Cache::remember("projects.related.{$project->id}", 600, function () use ($project) {
            return Project::published()
                ->where('id', '!=', $project->id)
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn($p) => [
                    'id'          => $p->id,
                    'title'       => $p->title,
                    'slug'        => $p->slug,
                    'description' => $p->description,
                    'image_url'   => $p->image_url,
                    'tags'        => $p->tags ?? [],
                    'platforms'   => $p->platforms ?? [],
                ]);
        });

        return Inertia::render('Projects/Show', [
            'project' => [
                'id'           => $project->id,
                'title'        => $project->title,
                'slug'         => $project->slug,
                'description'  => $project->description,
                'content'      => $project->content,
                'image_url'    => $project->image_url,
                'demo_url'     => $project->demo_url,
                'github_url'   => $project->github_url,
                'private_repo' => (bool) $project->private_repo,
                'tags'         => $project->tags ?? [],
                'platforms'    => $project->platforms ?? [],
                'screenshots'  => $project->screenshots_urls,
                'featured'     => (bool) $project->featured,
                'created_at'   => $project->created_at->format('d/m/Y'),
            ],
            'related' => $related,
        ]);
    }
}