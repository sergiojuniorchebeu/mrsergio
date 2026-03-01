<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Projects — featured first on the homepage
        $projects = \App\Models\Project::published()
            ->featured()
            ->ordered()
            ->take(3)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'description' => $p->description,
                'image_url' => $p->image_url,
                'tags' => $p->tags ?? [],
            ]);

        // Blog posts — latest 3
        $posts = \App\Models\BlogPost::where('published', true)
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(fn($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'cover_image_url' => $post->cover_image_url,
                'published_at' => $post->published_at?->format('d M Y'),
            ]);

        // Formations — featured first
        $formations = \App\Models\Formation::published()
            ->featured()
            ->ordered()
            ->take(3)
            ->get()
            ->map(fn($f) => [
                'id' => $f->id,
                'title' => $f->title,
                'slug' => $f->slug,
                'cover_image_url' => $f->cover_image_url,
                'price_formatted' => $f->price_formatted,
                'is_free' => $f->is_free,
            ]);

        return Inertia::render('Home', [
            'projects' => $projects,
            'posts' => $posts,
            'formations' => $formations,
        ]);
    }
}