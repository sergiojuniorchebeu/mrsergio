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
            'projects' => Project::orderBy('sort_order')->orderByDesc('created_at')->get(),
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

        // handle screenshots uploads (multiple)
        $screenshots = [];
        if ($request->hasFile('screenshots')) {
            foreach ($request->file('screenshots') as $file) {
                $screenshots[] = $file->store('projects/screenshots', 'public');
            }
        }
        if (! empty($screenshots)) $data['screenshots'] = $screenshots;

        $data['slug'] = Str::slug($data['title']);

        Project::create($data);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Projet créé avec succès.');
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => $project,
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

        // append new screenshots if provided
        $screenshots = $project->screenshots ?? [];
        if ($request->hasFile('screenshots')) {
            foreach ($request->file('screenshots') as $file) {
                $screenshots[] = $file->store('projects/screenshots', 'public');
            }
            $data['screenshots'] = $screenshots;
        }

        $data['slug'] = Str::slug($data['title']);

        $project->update($data);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Projet mis à jour.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        $project->delete();

        return redirect()->route('admin.projects.index')
            ->with('success', 'Projet supprimé.');
    }

    public function togglePublished(Request $request, Project $project): RedirectResponse
    {
        $project->update(['published' => $request->boolean('published')]);
        return back();
    }

    private function validateProject(Request $request): array
    {
        return $request->validate([
            'title'       => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'content'     => ['nullable', 'string'],
            'demo_url'    => ['nullable', 'url', 'max:255'],
            'github_url'  => ['nullable', 'url', 'max:255'],
            'private_repo' => ['nullable', 'boolean'],
            'platforms'   => ['nullable', 'array'],
            'platforms.*' => ['string'],
            'screenshots' => ['nullable', 'array', 'max:8'],
            'screenshots.*' => ['image', 'max:2048'],
            'tags'        => ['nullable', 'array'],
            'tags.*'      => ['string'],
            'featured'    => ['nullable', 'boolean'],
            'published'   => ['nullable', 'boolean'],
            'sort_order'  => ['nullable', 'integer'],
            'image'       => ['nullable', 'image', 'max:2048'],
        ]);
    }
}