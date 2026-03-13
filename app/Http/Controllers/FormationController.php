<?php
// app/Http/Controllers/FormationController.php

namespace App\Http\Controllers;

use App\Models\Formation;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class FormationController extends Controller
{
    public function index(): Response
    {
        $formations = Cache::remember('formations.index', 600, function () {
            return Formation::published()
                ->ordered()
                ->get()
                ->map(fn($f) => $this->formatFormation($f));
        });

        $categories = $formations->pluck('category')->unique()->values()->toArray();

        return Inertia::render('formations/FormationsIndex', compact('formations', 'categories'));
    }

    public function show(Formation $formation): Response
    {
        abort_unless($formation->published, 404);

        $related = Cache::remember("formations.related.{$formation->id}", 600, function () use ($formation) {
            // Chercher dans la même catégorie en premier
            $related = Formation::published()
                ->where('id', '!=', $formation->id)
                ->where('category', $formation->category)
                ->take(3)
                ->get();

            // Compléter si pas assez
            if ($related->count() < 3) {
                $ids  = $related->pluck('id')->push($formation->id);
                $more = Formation::published()
                    ->whereNotIn('id', $ids)
                    ->take(3 - $related->count())
                    ->get();
                $related = $related->merge($more);
            }

            return $related->map(fn($f) => $this->formatFormation($f));
        });

        return Inertia::render('formations/FormationsShow', [
            'formation' => $this->formatFormation($formation, true),
            'related'   => $related,
        ]);
    }

    private function formatFormation(Formation $f, bool $withContent = false): array
    {
        $data = [
            'id'                 => $f->id,
            'title'              => $f->title,
            'slug'               => $f->slug,
            'excerpt'            => $f->excerpt,
            'category'           => $f->category,
            'tags'               => $f->tags ?? [],
            'level'              => $f->level,
            'level_color'        => $f->level_color,
            'language'           => $f->language,
            'duration_hours'     => $f->duration_hours,
            'duration_formatted' => $f->duration_formatted,
            'lessons_count'      => $f->lessons_count,
            'is_free'            => $f->is_free,
            'price_formatted'    => $f->price_formatted,
            'featured'           => $f->featured,
            'cover_image_url'    => $f->cover_image_url,
        ];

        if ($withContent) {
            $data['content'] = $f->content;
        }

        return $data;
    }
}