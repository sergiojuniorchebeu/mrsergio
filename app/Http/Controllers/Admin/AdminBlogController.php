<?php

// app/Http/Controllers/Admin/AdminBlogController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminBlogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Blog/Index', [
            'posts' => BlogPost::withCount('comments')->orderByDesc('created_at')->get(),
        ]);
    }

    public function comments(BlogPost $blog): Response
    {
        return Inertia::render('Admin/Blog/Comments', [
            'post' => [
                'id' => $blog->id,
                'title' => $blog->title,
                'slug' => $blog->slug,
            ],
            'comments' => $blog->comments()
                ->latest()
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'author_name' => $c->author_name,
                    'content' => $c->content,
                    'ip_address' => $c->ip_address,
                    'created_at' => $c->created_at->format('d/m/Y à H:i'),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Blog/Form', [
            'post' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePost($request);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('blog', 'public');
        }

        $data['slug'] = Str::slug($data['title']);

        if (! empty($data['published']) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        BlogPost::create($data);

        return redirect()->route('admin.blog.index')
            ->with('success', 'Article créé avec succès.');
    }

    // NOTE: La route resource génère PUT/PATCH /admin/blog/{id}
    // Mais avec multipart/form-data (upload fichier), les navigateurs
    // n'envoient que POST. On utilise le method spoofing Laravel : _method=PUT
    // Inertia envoie bien _method dans le formData quand on utilise router.post()
    public function edit(BlogPost $blog): Response
    {
        return Inertia::render('Admin/Blog/Form', [
            'post' => $blog,
            'translation' => $blog->translationState(),
        ]);
    }

    public function update(Request $request, BlogPost $blog): RedirectResponse
    {
        $data = $this->validatePost($request, $blog->id);

        if ($request->hasFile('cover_image')) {
            if ($blog->cover_image) {
                Storage::disk('public')->delete($blog->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('blog', 'public');
        }

        $data['slug'] = Str::slug($data['title']);

        if (! empty($data['published']) && empty($blog->published_at) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $blog->update($data);

        return redirect()->route('admin.blog.index')
            ->with('success', 'Article mis à jour.');
    }

    public function destroy(BlogPost $blog): RedirectResponse
    {
        if ($blog->cover_image) {
            Storage::disk('public')->delete($blog->cover_image);
        }

        $blog->delete();

        return redirect()->route('admin.blog.index')
            ->with('success', 'Article supprimé.');
    }

    // Toggle published depuis la table (PATCH simple sans fichier)
    public function togglePublished(Request $request, BlogPost $blog): RedirectResponse
    {
        $blog->update(['published' => $request->boolean('published')]);

        return back();
    }

    private function validatePost(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'excerpt' => ['required', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'featured' => ['nullable', 'boolean'],
            'published' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'cover_image' => ['nullable', 'image', 'max:2048'],
        ]);
    }
}
