<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $projects = Cache::remember('home.projects', 600, function () {
            return \App\Models\Project::published()
                ->featured()
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
                    'featured'    => (bool) $p->featured,
                ]);
        });

        $posts = Cache::remember('home.posts', 600, function () {
            return \App\Models\BlogPost::published()
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn($post) => [
                    'id'              => $post->id,
                    'title'           => $post->title,
                    'slug'            => $post->slug,
                    'excerpt'         => $post->excerpt,
                    'cover_image_url' => $post->cover_image_url,
                    'tags'            => $post->tags ?? [],
                    'published_at'    => $post->published_at?->format('d M Y'),
                    'reading_time'    => $this->readingTime($post->content),
                ]);
        });

        $formations = Cache::remember('home.formations', 600, function () {
            return \App\Models\Formation::published()
                ->featured()
                ->ordered()
                ->take(4)
                ->get()
                ->map(fn($f) => [
                    'id'              => $f->id,
                    'title'           => $f->title,
                    'slug'            => $f->slug,
                    'excerpt'         => $f->excerpt,
                    'cover_image_url' => $f->cover_image_url,
                    'category'        => $f->category,
                    'tags'            => $f->tags ?? [],
                    'level'           => $f->level,
                    'price_formatted' => $f->price_formatted,
                    'duration_formatted' => $f->duration_formatted,
                    'lessons_count'   => $f->lessons_count,
                    'is_free'         => $f->is_free,
                    'featured'        => (bool) $f->featured,
                ]);
        });

        return Inertia::render('Home', [
            'projects'   => $projects,
            'posts'      => $posts,
            'formations' => $formations,
        ]);
    }

    private function readingTime(?string $content): string
    {
        if (!$content) return '1 min';
        $words = str_word_count(strip_tags($content));
        $minutes = max(1, (int) ceil($words / 200));
        return "{$minutes} min";
    }
}