<?php
// app/Http/Controllers/Admin/AdminBlogController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminBlogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Blog/Index', [
            'posts' => BlogPost::orderByDesc('created_at')->get(),
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

        if (!empty($data['published']) && empty($data['published_at'])) {
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

        if (!empty($data['published']) && empty($blog->published_at) && empty($data['published_at'])) {
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
            'title'        => ['required', 'string', 'max:200'],
            'excerpt'      => ['required', 'string', 'max:500'],
            'content'      => ['nullable', 'string'],
            'tags'         => ['nullable', 'array'],
            'tags.*'       => ['string'],
            'featured'     => ['nullable', 'boolean'],
            'published'    => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'cover_image'  => ['nullable', 'image', 'max:2048'],
        ]);
    }
}