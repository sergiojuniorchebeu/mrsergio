<?php
// app/Http/Controllers/Admin/AdminFormationController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminFormationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Formations/Index', [
            'formations' => Formation::orderBy('sort_order')->orderByDesc('created_at')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Formations/Form', [
            'formation' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateFormation($request);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('formations', 'public');
        }

        $data['slug'] = Str::slug($data['title']);

        Formation::create($data);

        return redirect()->route('admin.formations.index')
            ->with('success', 'Formation créée avec succès.');
    }

    public function edit(Formation $formation): Response
    {
        return Inertia::render('Admin/Formations/Form', [
            'formation' => $formation,
        ]);
    }

    public function update(Request $request, Formation $formation): RedirectResponse
    {
        $data = $this->validateFormation($request);

        if ($request->hasFile('cover_image')) {
            if ($formation->cover_image) {
                Storage::disk('public')->delete($formation->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('formations', 'public');
        }

        $data['slug'] = Str::slug($data['title']);

        $formation->update($data);

        return redirect()->route('admin.formations.index')
            ->with('success', 'Formation mise à jour.');
    }

    public function destroy(Formation $formation): RedirectResponse
    {
        if ($formation->cover_image) {
            Storage::disk('public')->delete($formation->cover_image);
        }

        $formation->delete();

        return redirect()->route('admin.formations.index')
            ->with('success', 'Formation supprimée.');
    }

    public function togglePublished(Request $request, Formation $formation): RedirectResponse
    {
        $formation->update(['published' => $request->boolean('published')]);
        return back();
    }

    private function validateFormation(Request $request): array
    {
        return $request->validate([
            'title'          => ['required', 'string', 'max:200'],
            'excerpt'        => ['required', 'string', 'max:500'],
            'content'        => ['nullable', 'string'],
            'category'       => ['required', 'string'],
            'tags'           => ['nullable', 'array'],
            'tags.*'         => ['string'],
            'level'          => ['required', 'in:débutant,intermédiaire,avancé'],
            'language'       => ['required', 'string'],
            'duration_hours' => ['required', 'integer', 'min:1'],
            'lessons_count'  => ['required', 'integer', 'min:1'],
            'is_free'        => ['nullable', 'boolean'],
            'price'          => ['nullable', 'numeric', 'min:0'],
            'featured'       => ['nullable', 'boolean'],
            'published'      => ['nullable', 'boolean'],
            'sort_order'     => ['nullable', 'integer'],
            'cover_image'    => ['nullable', 'image', 'max:2048'],
        ]);
    }
}