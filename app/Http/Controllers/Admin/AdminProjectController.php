<?php
// app/Http/Controllers/Admin/AdminProjectController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Projects/Index', [
            'projects' => Project::orderBy('sort_order')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn (Project $project) => [
                    'id' => $project->id,
                    'title' => $project->title,
                    'slug' => $project->slug,
                    'project_type' => $project->project_type ?? 'web',
                    'tags' => $project->tags ?? [],
                    'featured' => (bool) $project->featured,
                    'published' => (bool) $project->published,
                    'image' => $project->image,
                    'created_at' => optional($project->created_at)?->format('d/m/Y'),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateProject($request);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('projects', 'public');
        }

        $screenshots = [];
        if ($request->hasFile('screenshots')) {
            foreach ($request->file('screenshots') as $file) {
                $screenshots[] = $file->store('projects/screenshots', 'public');
            }
        }

        if (! empty($screenshots)) {
            $data['screenshots'] = $screenshots;
        }

        $data['slug'] = Str::slug($data['title']);
        $data['private_repo'] = $request->boolean('private_repo');
        $data['featured'] = $request->boolean('featured');
        $data['published'] = $request->boolean('published');
        $data['tags'] = array_values($request->input('tags', []));
        $data['platforms'] = array_values($request->input('platforms', []));
        $data['store_links'] = array_filter($request->input('store_links', []), fn ($value) => filled($value));

        Project::create($data);

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Projet créé avec succès.');
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'project_type' => $project->project_type ?? 'web',
                'description' => $project->description,
                'content' => $project->content,
                'demo_url' => $project->demo_url,
                'github_url' => $project->github_url,
                'tags' => $project->tags ?? [],
                'featured' => (bool) $project->featured,
                'published' => (bool) $project->published,
                'sort_order' => $project->sort_order,
                'image' => $project->image,
                'private_repo' => (bool) $project->private_repo,
                'platforms' => $project->platforms ?? [],
                'screenshots' => $project->screenshots ?? [],
                'store_links' => $project->store_links ?? [],
            ],
        ]);
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $data = $this->validateProject($request);

        if ($request->hasFile('image')) {
            if ($project->image) {
                Storage::disk('public')->delete($project->image);
            }

            $data['image'] = $request->file('image')->store('projects', 'public');
        }

        $screenshots = $project->screenshots ?? [];
        if ($request->hasFile('screenshots')) {
            foreach ($request->file('screenshots') as $file) {
                $screenshots[] = $file->store('projects/screenshots', 'public');
            }
        }

        $data['screenshots'] = $screenshots;
        $data['slug'] = Str::slug($data['title']);
        $data['private_repo'] = $request->boolean('private_repo');
        $data['featured'] = $request->boolean('featured');
        $data['published'] = $request->boolean('published');
        $data['tags'] = array_values($request->input('tags', []));
        $data['platforms'] = array_values($request->input('platforms', []));
        $data['store_links'] = array_filter($request->input('store_links', []), fn ($value) => filled($value));

        $project->update($data);

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Projet mis à jour.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        foreach (($project->screenshots ?? []) as $shot) {
            Storage::disk('public')->delete($shot);
        }

        $project->delete();

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Projet supprimé.');
    }

    public function togglePublished(Request $request, Project $project): RedirectResponse
    {
        $project->update([
            'published' => $request->boolean('published'),
        ]);

        return back();
    }

    private function validateProject(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'project_type' => ['required', 'in:web,mobile,desktop,api'],
            'description' => ['required', 'string'],
            'content' => ['nullable', 'string'],
            'demo_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'private_repo' => ['nullable', 'boolean'],

            'platforms' => ['nullable', 'array'],
            'platforms.*' => ['string', 'max:50'],

            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],

            'store_links' => ['nullable', 'array'],
            'store_links.play_store' => ['nullable', 'url', 'max:255'],
            'store_links.app_store' => ['nullable', 'url', 'max:255'],
            'store_links.windows' => ['nullable', 'url', 'max:255'],
            'store_links.macos' => ['nullable', 'url', 'max:255'],
            'store_links.linux' => ['nullable', 'url', 'max:255'],
            'store_links.docs' => ['nullable', 'url', 'max:255'],
            'store_links.postman' => ['nullable', 'url', 'max:255'],
            'store_links.base_url' => ['nullable', 'url', 'max:255'],

            'screenshots' => ['nullable', 'array', 'max:12'],
            'screenshots.*' => ['image', 'max:4096'],

            'featured' => ['nullable', 'boolean'],
            'published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);
    }
}