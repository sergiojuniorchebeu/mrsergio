<?php

// app/Http/Controllers/FormationController.php

namespace App\Http\Controllers;

use App\Models\Formation;
use Inertia\Inertia;
use Inertia\Response;

class FormationController extends Controller
{
    // GET /formations
    public function index(): Response
    {
        $formations = Formation::published()
            ->ordered()
            ->get()
            ->map(fn($f) => [
                'id'                 => $f->id,
                'title'              => $f->title,
                'slug'               => $f->slug,
                'excerpt'            => $f->excerpt,
                'cover_image_url'    => $f->cover_image_url,
                'category'           => $f->category,
                'tags'               => $f->tags,
                'level'              => $f->level,
                'level_color'        => $f->level_color,
                'duration_formatted' => $f->duration_formatted,
                'lessons_count'      => $f->lessons_count,
                'students_count'     => $f->students_count,
                'is_free'            => $f->is_free,
                'price_formatted'    => $f->price_formatted,
                'featured'           => $f->featured,
            ]);

        // Catégories disponibles pour les filtres
        $categories = Formation::published()
            ->distinct()
            ->pluck('category')
            ->sort()
            ->values();

        return Inertia::render('Formations/Index', [
            'formations' => $formations,
            'categories' => $categories,
        ]);
    }

    // GET /formations/{formation:slug}
    public function show(Formation $formation): Response
    {
        abort_unless($formation->published, 404);

        $related = Formation::published()
            ->where('id', '!=', $formation->id)
            ->where('category', $formation->category)
            ->ordered()
            ->take(3)
            ->get()
            ->map(fn($f) => [
                'id'                 => $f->id,
                'title'              => $f->title,
                'slug'               => $f->slug,
                'excerpt'            => $f->excerpt,
                'cover_image_url'    => $f->cover_image_url,
                'category'           => $f->category,
                'tags'               => $f->tags,
                'level'              => $f->level,
                'level_color'        => $f->level_color,
                'duration_formatted' => $f->duration_formatted,
                'lessons_count'      => $f->lessons_count,
                'is_free'            => $f->is_free,
                'price_formatted'    => $f->price_formatted,
                'featured'           => $f->featured,
            ]);

        // Si pas de related dans la même catégorie, prendre d'autres formations
        if ($related->isEmpty()) {
            $related = Formation::published()
                ->where('id', '!=', $formation->id)
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn($f) => [
                    'id'                 => $f->id,
                    'title'              => $f->title,
                    'slug'               => $f->slug,
                    'excerpt'            => $f->excerpt,
                    'cover_image_url'    => $f->cover_image_url,
                    'category'           => $f->category,
                    'tags'               => $f->tags,
                    'level'              => $f->level,
                    'level_color'        => $f->level_color,
                    'duration_formatted' => $f->duration_formatted,
                    'lessons_count'      => $f->lessons_count,
                    'is_free'            => $f->is_free,
                    'price_formatted'    => $f->price_formatted,
                    'featured'           => $f->featured,
                ]);
        }

        return Inertia::render('Formations/Show', [
            'formation' => [
                'id'                  => $formation->id,
                'title'               => $formation->title,
                'slug'                => $formation->slug,
                'excerpt'             => $formation->excerpt,
                'content'             => $formation->content,
                'cover_image_url'     => $formation->cover_image_url,
                'preview_video_url'   => $formation->preview_video_url,
                'category'            => $formation->category,
                'tags'                => $formation->tags,
                'level'               => $formation->level,
                'level_color'         => $formation->level_color,
                'language'            => $formation->language,
                'duration_formatted'  => $formation->duration_formatted,
                'lessons_count'       => $formation->lessons_count,
                'students_count'      => $formation->students_count,
                'is_free'             => $formation->is_free,
                'price_formatted'     => $formation->price_formatted,
                'featured'            => $formation->featured,
                'published_at'        => optional($formation->published_at)->format('d/m/Y'),
            ],
            'related' => $related,
        ]);
    }
}