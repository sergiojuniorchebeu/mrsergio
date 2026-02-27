<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class BlogPost extends Model
{
    use HasFactory;

    protected $table = 'blog_posts';

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'tags',
        'featured',
        'published',
        'published_at',
        'sort_order',
    ];

    protected $casts = [
        'tags'         => 'array',
        'featured'     => 'boolean',
        'published'    => 'boolean',
        'published_at' => 'datetime',
    ];

    // ── Scopes (même style que Project) ─────────────────────────────
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
        return $query->orderBy('sort_order')->orderByDesc('published_at')->orderByDesc('created_at');
    }

    // ── Accessor image ─────────────────────────────────────────────
    public function getCoverImageUrlAttribute(): string
    {
        if ($this->cover_image) {
            return asset('storage/' . $this->cover_image);
        }

        // Placeholder simple
        return 'https://og-image.vercel.app/' . urlencode($this->title) . '.png';
    }
}