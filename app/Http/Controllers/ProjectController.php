<?php

// app/Http/Controllers/ProjectController.php
// ─────────────────────────────────────────────────────────────────────────────
// Controller — Projects
// Flutter équivalent : un Provider/BLoC qui expose les données aux widgets
// ─────────────────────────────────────────────────────────────────────────────

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    // ── index() — liste de tous les projets publiés ───────────────────────
    // Route : GET /projects
    // Flutter équivalent : FutureBuilder qui charge la liste
    public function index(): Response
    {
        $projects = Project::published()
            ->ordered()
            ->get()
            // On ne passe que les champs utiles au front
            // Évite d'exposer des champs sensibles + allège le JSON
            // Flutter équivalent : toJson() avec seulement les champs nécessaires
            ->map(fn($p) => [
                'id'          => $p->id,
                'title'       => $p->title,
                'slug'        => $p->slug,
                'description' => $p->description,
                'image_url'   => $p->image_url,    // accessor
                'demo_url'    => $p->demo_url,
                'github_url'  => $p->github_url,
                'tags'        => $p->tags,          // déjà casté en array
                'featured'    => $p->featured,
            ]);

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    // ── show() — détail d'un projet ───────────────────────────────────────
    // Route : GET /projects/{project:slug}
    // Le {project:slug} = route model binding par slug (pas par id)
    // Flutter équivalent : Navigator.push avec l'objet passé en argument
    public function show(Project $project): Response
    {
        // 404 automatique si le projet n'est pas publié
        abort_unless($project->published, 404);

        // Projets similaires (même tags) pour la section "Voir aussi"
        $related = Project::published()
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
                'tags'        => $p->tags,
            ]);

        return Inertia::render('Projects/Show', [
            'project' => [
                'id'          => $project->id,
                'title'       => $project->title,
                'slug'        => $project->slug,
                'description' => $project->description,
                'content'     => $project->content,
                'image_url'   => $project->image_url,
                'demo_url'    => $project->demo_url,
                'github_url'  => $project->github_url,
                'tags'        => $project->tags,
                'featured'    => $project->featured,
                'created_at'  => $project->created_at->format('d/m/Y'),
            ],
            'related' => $related,
        ]);
    }
}