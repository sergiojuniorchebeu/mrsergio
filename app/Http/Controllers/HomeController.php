<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class HomeController extends Controller
{
    private const HOME_PROJECTS_CACHE_KEY = 'home.projects.v3';

    public function index()
    {
        $projects = Cache::remember(self::HOME_PROJECTS_CACHE_KEY, 600, function () {
            return \App\Models\Project::published()
                ->featured()
                ->ordered()
                ->take(6)
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'slug' => $p->slug,
                    'project_type' => $p->project_type,
                    'project_type_label' => $p->project_type_label,
                    'description' => $p->description,
                    'image_url' => $p->image_url,
                    'demo_url' => $p->demo_url,
                    'github_url' => $p->github_url,
                    'private_repo' => (bool) $p->private_repo,
                    'store_links' => $p->store_links,
                    'screenshots_urls' => $p->screenshots_urls,
                    'tags' => $p->tags ?? [],
                    'featured' => (bool) $p->featured,
                ]);
        });

        $posts = Cache::remember('home.posts', 600, function () {
            return \App\Models\BlogPost::published()
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn ($post) => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'cover_image_url' => $post->cover_image_url,
                    'tags' => $post->tags ?? [],
                    'published_at' => $post->published_at?->format('d M Y'),
                    'reading_time' => $post->reading_time,
                ]);
        });

        $formations = Cache::remember('home.formations', 600, function () {
            return \App\Models\Formation::published()
                ->featured()
                ->ordered()
                ->take(4)
                ->get()
                ->map(fn ($f) => [
                    'id' => $f->id,
                    'title' => $f->title,
                    'slug' => $f->slug,
                    'excerpt' => $f->excerpt,
                    'cover_image_url' => $f->cover_image_url,
                    'category' => $f->category,
                    'tags' => $f->tags ?? [],
                    'level' => $f->level,
                    'price_formatted' => $f->price_formatted,
                    'duration_formatted' => $f->duration_formatted,
                    'lessons_count' => $f->lessons_count,
                    'is_free' => $f->is_free,
                    'featured' => (bool) $f->featured,
                ]);
        });

        $projectsCount = Cache::remember('home.projects_count', 600, function () {
            return \App\Models\Project::published()->count();
        });

        return Inertia::render('Home', [
            'projects' => $projects,
            'posts' => $posts,
            'formations' => $formations,
            'projectsCount' => $projectsCount,
        ]);
    }
}
