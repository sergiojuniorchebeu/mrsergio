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
        $posts = Cache::remember(BlogPost::localizedCacheKey('blog.index'), 600, function () {
            return BlogPost::published()
                ->ordered()
                ->get()
                ->map(fn ($post) => [
                    'id' => $post->id,
                    'title' => $post->translated('title'),
                    'slug' => $post->slug,
                    'excerpt' => $post->translated('excerpt'),
                    'cover_image_url' => $post->cover_image_url,
                    'tags' => $post->tags ?? [],
                    'featured' => (bool) $post->featured,
                    'published_at' => $post->published_at?->format('d M Y'),
                    'reading_time' => $post->reading_time,
                ]);
        });

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'seo' => [
                'title' => 'Blog | Sergio Junior Chebeu',
                'description' => 'Des articles sur le développement web, Laravel, Flutter, architecture produit et les choix qui rendent une application plus claire et plus robuste.',
                'image' => asset('images/profile_avatar.jpg'),
                'type' => 'website',
                'canonical' => route('blog.index'),
                'json_ld' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'Blog',
                    'name' => 'Blog de Sergio Junior Chebeu',
                    'url' => route('blog.index'),
                    'description' => 'Articles sur le développement web, mobile et produit.',
                ],
            ],
        ]);
    }

    public function show(BlogPost $post): Response
    {
        abort_unless($post->published, 404);

        $related = Cache::remember(BlogPost::localizedCacheKey("blog.related.{$post->id}"), 600, function () use ($post) {
            return BlogPost::published()
                ->where('id', '!=', $post->id)
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->translated('title'),
                    'slug' => $p->slug,
                    'excerpt' => $p->translated('excerpt'),
                    'cover_image_url' => $p->cover_image_url,
                    'tags' => $p->tags ?? [],
                    'published_at' => $p->published_at?->format('d M Y'),
                ]);
        });

        return Inertia::render('Blog/Show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->translated('title'),
                'slug' => $post->slug,
                'excerpt' => $post->translated('excerpt'),
                'content' => $post->translated('content'),
                'cover_image_url' => $post->cover_image_url,
                'tags' => $post->tags ?? [],
                'featured' => (bool) $post->featured,
                'published_at' => $post->published_at?->format('d M Y'),
                'reading_time' => $post->reading_time,
                'likes_count' => $post->likes()->count(),
                'liked' => $post->likes()->where('ip_address', request()->ip())->exists(),
            ],
            'related' => $related,
            'comments' => $post->comments()
                ->latest()
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'author_name' => $c->author_name,
                    'content' => $c->content,
                    'created_at' => $c->created_at->diffForHumans(),
                ]),
            'seo' => [
                'title' => $post->translated('title').' | Blog',
                'description' => $post->translated('excerpt'),
                'image' => $post->cover_image_url,
                'type' => 'article',
                'canonical' => route('blog.show', $post),
                'published_time' => $post->published_at?->toIso8601String(),
                'json_ld' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'BlogPosting',
                    'headline' => $post->translated('title'),
                    'description' => $post->translated('excerpt'),
                    'image' => [$post->cover_image_url],
                    'datePublished' => $post->published_at?->toIso8601String(),
                    'dateModified' => $post->updated_at?->toIso8601String(),
                    'author' => [
                        '@type' => 'Person',
                        'name' => 'Sergio Junior Chebeu',
                    ],
                    'publisher' => [
                        '@type' => 'Person',
                        'name' => 'Sergio Junior Chebeu',
                    ],
                    'mainEntityOfPage' => route('blog.show', $post),
                ],
            ],
        ]);
    }
}
