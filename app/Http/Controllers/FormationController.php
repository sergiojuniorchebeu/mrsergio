<?php

// app/Http/Controllers/FormationController.php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\FormationSession;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class FormationController extends Controller
{
    public function index(): Response
    {
        $formations = Cache::remember(Formation::localizedCacheKey('formations.index'), 600, function () {
            return Formation::published()
                ->ordered()
                ->get()
                ->map(fn ($f) => $this->formatFormation($f));
        });

        $categories = $formations->pluck('category')->unique()->values()->toArray();
        $upcomingSessions = FormationSession::query()
            ->with('formation:id,title,slug')
            ->withCount(['enrollments as registered_count' => function ($query): void {
                $query->holdingSeat();
            }])
            ->whereHas('formation', function ($query): void {
                $query->published()->where('is_free', true);
            })
            ->where('published', true)
            ->upcoming()
            ->limit(6)
            ->get()
            ->map(fn (FormationSession $session): array => $this->formatSession($session))
            ->values();

        return Inertia::render('formations/FormationsIndex', [
            'formations' => $formations,
            'categories' => $categories,
            'upcoming_sessions' => $upcomingSessions,
            'seo' => [
                'title' => 'Formations | Sergio Junior Chebeu',
                'description' => 'Des formations pratiques en développement web et mobile pour apprendre Laravel, Flutter, Python et Java avec une approche orientée résultat.',
                'image' => asset('images/profile_avatar.jpg'),
                'type' => 'website',
                'canonical' => route('formations.index'),
                'json_ld' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'ItemList',
                    'name' => 'Formations de Sergio Junior Chebeu',
                    'url' => route('formations.index'),
                ],
            ],
        ]);
    }

    public function show(Formation $formation): Response
    {
        abort_unless($formation->published, 404);

        $related = Cache::remember(Formation::localizedCacheKey("formations.related.{$formation->id}"), 600, function () use ($formation) {
            // Chercher dans la même catégorie en premier
            $related = Formation::published()
                ->where('id', '!=', $formation->id)
                ->where('category', $formation->category)
                ->take(3)
                ->get();

            // Compléter si pas assez
            if ($related->count() < 3) {
                $ids = $related->pluck('id')->push($formation->id);
                $more = Formation::published()
                    ->whereNotIn('id', $ids)
                    ->take(3 - $related->count())
                    ->get();
                $related = $related->merge($more);
            }

            return $related->map(fn ($f) => $this->formatFormation($f));
        });

        $formation->load([
            'sessions' => function ($query): void {
                $query->withCount(['enrollments as registered_count' => function ($enrollments): void {
                    $enrollments->holdingSeat();
                }])->where('published', true)->upcoming();
            },
        ]);

        return Inertia::render('formations/FormationsShow', [
            'formation' => $this->formatFormation($formation, true),
            'related' => $related,
            'seo' => [
                'title' => $formation->translated('title').' | Formation',
                'description' => $formation->translated('excerpt'),
                'image' => $formation->cover_image_url,
                'type' => 'article',
                'canonical' => route('formations.show', $formation),
                'json_ld' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'Course',
                    'name' => $formation->translated('title'),
                    'description' => $formation->translated('excerpt'),
                    'provider' => [
                        '@type' => 'Person',
                        'name' => 'Sergio Junior Chebeu',
                    ],
                    'image' => [$formation->cover_image_url],
                    'url' => route('formations.show', $formation),
                ],
            ],
        ]);
    }

    private function formatFormation(Formation $f, bool $withContent = false): array
    {
        $data = [
            'id' => $f->id,
            'title' => $f->translated('title'),
            'slug' => $f->slug,
            'excerpt' => $f->translated('excerpt'),
            'category' => $f->category,
            'tags' => $f->tags ?? [],
            'level' => $f->level,
            'level_color' => $f->level_color,
            'language' => $f->language,
            'format' => $f->translated('format'),
            'target_audience' => $f->translated('target_audience'),
            'prerequisites' => $f->translated('prerequisites'),
            'outcomes' => $f->translated('outcomes') ?? [],
            'cta_label' => $f->translated('cta_label'),
            'cta_url' => $f->cta_url,
            'duration_hours' => $f->duration_hours,
            'duration_formatted' => $f->duration_formatted,
            'lessons_count' => $f->lessons_count,
            'is_free' => $f->is_free,
            'price_formatted' => $f->price_formatted,
            'featured' => $f->featured,
            'cover_image_url' => $f->cover_image_url,
        ];

        if ($withContent) {
            $data['content'] = $f->translated('content');
            $data['sessions'] = $f->is_free
                ? $f->sessions->map(fn (FormationSession $session): array => $this->formatSession($session))->values()
                : [];
        }

        return $data;
    }

    private function formatSession(FormationSession $session): array
    {
        $registered = (int) ($session->registered_count ?? $session->confirmed_enrollments_count);
        $placesRemaining = $session->capacity === null
            ? null
            : max(0, $session->capacity - $registered);

        return [
            'id' => $session->id,
            'title' => $session->title,
            'starts_at' => $session->starts_at->toIso8601String(),
            'ends_at' => $session->ends_at?->toIso8601String(),
            'date_label' => $session->date_label,
            'time_label' => $session->time_label,
            'capacity' => $session->capacity,
            'registered_count' => $registered,
            'places_remaining' => $placesRemaining,
            'is_full' => $placesRemaining !== null && $placesRemaining === 0,
            'calendar_url' => $session->google_calendar_url,
            'formation' => $session->relationLoaded('formation') ? [
                'title' => $session->formation->translated('title'),
                'slug' => $session->formation->slug,
            ] : null,
        ];
    }
}
