<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Project extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        $invalidate = function (Project $project): void {
            Cache::forget('home.projects');
            Cache::forget('projects.index');
            Cache::forget("projects.related.{$project->id}");
        };

        static::saved($invalidate);
        static::deleted($invalidate);
    }

    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'image',
        'screenshots',
        'platforms',
        'demo_url',
        'github_url',
        'private_repo',
        'tags',
        'featured',
        'published',
        'sort_order',
    ];

    protected $casts = [
        'tags' => 'array',
        'platforms' => 'array',
        'screenshots' => 'array',
        'private_repo' => 'boolean',
        'featured' => 'boolean',
        'published' => 'boolean',
    ];

    // ── Scopes ───────────────────────────────────────────────────────────

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('published', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('created_at');
    }

    // ── Accessors ────────────────────────────────────────────────────────

    public function getImageUrlAttribute(): string
    {
        if ($this->image) {
            return asset('storage/'.$this->image);
        }

        // Placeholder Unsplash (stable, fiable, pas de rate limit pour portfolios)
        return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=70&auto=format';
    }

    // URLs complètes des screenshots
    public function getScreenshotsUrlsAttribute(): array
    {
        if (! $this->screenshots) {
            return [];
        }

        return array_map(
            fn ($p) => asset('storage/'.$p),
            $this->screenshots
        );
    }
}
