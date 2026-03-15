<?php

// app/Http/Controllers/BlogController.php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        $posts = Cache::remember('blog.index', 600, function () {
            return BlogPost::published()
                ->ordered()
                ->get()
                ->map(fn ($post) => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'cover_image_url' => $post->cover_image_url,
                    'tags' => $post->tags ?? [],
                    'featured' => (bool) $post->featured,
                    'published_at' => $post->published_at?->format('d M Y'),
                    'reading_time' => $post->reading_time,
                ]);
        });

        return Inertia::render('Blog/Index', compact('posts'));
    }

    public function show(BlogPost $post): Response
    {
        abort_unless($post->published, 404);

        $related = Cache::remember("blog.related.{$post->id}", 600, function () use ($post) {
            return BlogPost::published()
                ->where('id', '!=', $post->id)
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'slug' => $p->slug,
                    'excerpt' => $p->excerpt,
                    'cover_image_url' => $p->cover_image_url,
                    'tags' => $p->tags ?? [],
                    'published_at' => $p->published_at?->format('d M Y'),
                ]);
        });

        return Inertia::render('Blog/Show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'cover_image_url' => $post->cover_image_url,
                'tags' => $post->tags ?? [],
                'featured' => (bool) $post->featured,
                'published_at' => $post->published_at?->format('d M Y'),
                'reading_time' => $post->reading_time,
            ],
            'related' => $related,
        ]);
    }
}
