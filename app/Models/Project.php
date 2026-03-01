<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class Project extends Model
{
    use HasFactory;

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
        'tags'        => 'array',
        'platforms'   => 'array',
        'screenshots' => 'array',
        'private_repo'=> 'boolean',
        'featured'    => 'boolean',
        'published'   => 'boolean',
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
            return asset('storage/' . $this->image);
        }

        return 'https://og-image.vercel.app/' . urlencode($this->title) . '.png';
    }

    // URLs complètes des screenshots
    public function getScreenshotsUrlsAttribute(): array
    {
        if (! $this->screenshots) return [];

        return array_map(
            fn ($p) => asset('storage/' . $p),
            $this->screenshots
        );
    }
}