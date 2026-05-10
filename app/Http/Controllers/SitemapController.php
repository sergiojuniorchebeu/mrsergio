<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Formation;
use App\Models\Project;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $baseUrl = rtrim(config('app.url'), '/');

        $entries = collect([
            [
                'loc' => $baseUrl.route('home', absolute: false),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'weekly',
                'priority' => '1.0',
            ],
            [
                'loc' => $baseUrl.route('projects.index', absolute: false),
                'lastmod' => optional(Project::published()->latest('updated_at')->first()?->updated_at)->toDateString(),
                'changefreq' => 'weekly',
                'priority' => '0.9',
            ],
            [
                'loc' => $baseUrl.route('blog.index', absolute: false),
                'lastmod' => optional(BlogPost::published()->latest('updated_at')->first()?->updated_at)->toDateString(),
                'changefreq' => 'weekly',
                'priority' => '0.9',
            ],
            [
                'loc' => $baseUrl.route('formations.index', absolute: false),
                'lastmod' => optional(Formation::published()->latest('updated_at')->first()?->updated_at)->toDateString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ],
            [
                'loc' => $baseUrl.route('contact', absolute: false),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'monthly',
                'priority' => '0.6',
            ],
        ])->merge(
            Project::published()
                ->get(['slug', 'updated_at'])
                ->map(fn (Project $project) => [
                    'loc' => $baseUrl.route('projects.show', $project->slug, absolute: false),
                    'lastmod' => $project->updated_at?->toDateString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.8',
                ])
        )->merge(
            BlogPost::published()
                ->get(['slug', 'updated_at'])
                ->map(fn (BlogPost $post) => [
                    'loc' => $baseUrl.route('blog.show', $post->slug, absolute: false),
                    'lastmod' => $post->updated_at?->toDateString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.7',
                ])
        )->merge(
            Formation::published()
                ->get(['slug', 'updated_at'])
                ->map(fn (Formation $formation) => [
                    'loc' => $baseUrl.route('formations.show', $formation->slug, absolute: false),
                    'lastmod' => $formation->updated_at?->toDateString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.8',
                ])
        );

        $entries = $entries->filter(fn (array $entry) => filled($entry['loc']))->values();

        $xml = collect(['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'])
            ->merge($entries->flatMap(function (array $entry) {
                $lines = [
                    '    <url>',
                    '        <loc>'.e($entry['loc']).'</loc>',
                ];

                if (! empty($entry['lastmod'])) {
                    $lines[] = '        <lastmod>'.$entry['lastmod'].'</lastmod>';
                }

                if (! empty($entry['changefreq'])) {
                    $lines[] = '        <changefreq>'.$entry['changefreq'].'</changefreq>';
                }

                if (! empty($entry['priority'])) {
                    $lines[] = '        <priority>'.$entry['priority'].'</priority>';
                }

                $lines[] = '    </url>';

                return $lines;
            }))
            ->push('</urlset>')
            ->implode("\n");

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
