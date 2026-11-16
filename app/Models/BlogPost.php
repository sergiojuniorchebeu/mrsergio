<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlogPost extends Model
{
    use HasFactory, HasTranslations;

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
        $invalidate = fn (BlogPost $post) => $post->flushContentCache();

        static::saved($invalidate);
        static::deleted($invalidate);
    }

    public function flushContentCache(): void
    {
        static::forgetLocalizedCache(
            'home.posts',
            'blog.index',
            "blog.related.{$this->id}",
        );
    }

    /**
     * @return list<string>
     */
    public function translatableAttributes(): array
    {
        return ['title', 'excerpt', 'content'];
    }

    // ── Relations ──────────────────────────────────────────────────
    public function likes(): HasMany
    {
        return $this->hasMany(BlogPostLike::class, 'post_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(BlogPostComment::class, 'post_id');
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
