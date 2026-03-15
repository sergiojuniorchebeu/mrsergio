<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

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
        'tags' => 'array',
        'featured' => 'boolean',
        'published' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        $invalidate = function (BlogPost $post): void {
            Cache::forget('home.posts');
            Cache::forget('blog.index');
            Cache::forget("blog.related.{$post->id}");
        };

        static::saved($invalidate);
        static::deleted($invalidate);
    }

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
            return asset('storage/'.$this->cover_image);
        }

        // Placeholder fiable — image de blog générique
        return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=70&auto=format';
    }

    // ── Reading time ───────────────────────────────────────────────
    public function getReadingTimeAttribute(): string
    {
        if (! $this->content) {
            return '1 min';
        }

        $words = str_word_count(strip_tags($this->content));
        $minutes = max(1, (int) ceil($words / 200));

        return "{$minutes} min";
    }
}
