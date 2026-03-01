<?php
// app/Http/Controllers/BlogController.php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        $posts = BlogPost::where('published', true)
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($post) => [
                'id'              => $post->id,
                'title'           => $post->title,
                'slug'            => $post->slug,
                'excerpt'         => $post->excerpt,
                'cover_image_url' => $post->cover_image_url,
                'tags'            => $post->tags ?? [],
                'featured'        => $post->featured,
                'published_at'    => $post->published_at?->format('d M Y'),
                'reading_time'    => $this->readingTime($post->content),
            ]);

        return Inertia::render('Blog/Index', compact('posts'));
    }

    public function show(BlogPost $post): Response
    {
        abort_unless($post->published, 404);

        $related = BlogPost::where('published', true)
            ->where('id', '!=', $post->id)
            ->latest()
            ->take(3)
            ->get()
            ->map(fn($p) => [
                'id'              => $p->id,
                'title'           => $p->title,
                'slug'            => $p->slug,
                'excerpt'         => $p->excerpt,
                'cover_image_url' => $p->cover_image_url,
                'tags'            => $p->tags ?? [],
                'published_at'    => $p->published_at?->format('d M Y'),
            ]);

        return Inertia::render('Blog/Show', [
            'post'    => [
                'id'              => $post->id,
                'title'           => $post->title,
                'slug'            => $post->slug,
                'excerpt'         => $post->excerpt,
                'content'         => $post->content,
                'cover_image_url' => $post->cover_image_url,
                'tags'            => $post->tags ?? [],
                'featured'        => $post->featured,
                'published_at'    => $post->published_at?->format('d M Y'),
                'reading_time'    => $this->readingTime($post->content),
            ],
            'related' => $related,
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