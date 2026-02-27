<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    // GET /blog
    public function index(): Response
    {
        $posts = BlogPost::published()
            ->ordered()
            ->get()
            ->map(fn($p) => [
                'id'              => $p->id,
                'title'           => $p->title,
                'slug'            => $p->slug,
                'excerpt'         => $p->excerpt,
                'cover_image_url' => $p->cover_image_url,
                'tags'            => $p->tags,
                'featured'        => $p->featured,
                'published_at'    => optional($p->published_at)->format('d/m/Y'),
            ]);

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
        ]);
    }

    // GET /blog/{post:slug}
    public function show(BlogPost $post): Response
    {
        abort_unless($post->published, 404);

        $related = BlogPost::published()
            ->where('id', '!=', $post->id)
            ->ordered()
            ->take(3)
            ->get()
            ->map(fn($p) => [
                'id'              => $p->id,
                'title'           => $p->title,
                'slug'            => $p->slug,
                'excerpt'         => $p->excerpt,
                'cover_image_url' => $p->cover_image_url,
                'tags'            => $p->tags,
                'published_at'    => optional($p->published_at)->format('d/m/Y'),
            ]);

        return Inertia::render('Blog/Show', [
            'post' => [
                'id'              => $post->id,
                'title'           => $post->title,
                'slug'            => $post->slug,
                'excerpt'         => $post->excerpt,
                'content'         => $post->content,
                'cover_image_url' => $post->cover_image_url,
                'tags'            => $post->tags,
                'featured'        => $post->featured,
                'published_at'    => optional($post->published_at)->format('d/m/Y'),
            ],
            'related' => $related,
        ]);
    }
}