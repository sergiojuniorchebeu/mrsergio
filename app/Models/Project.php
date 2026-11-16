<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory, HasTranslations;

    protected static function booted(): void
    {
        $invalidate = fn (Project $project) => $project->flushContentCache();

        static::saved($invalidate);
        static::deleted($invalidate);
    }

    public function flushContentCache(): void
    {
        static::forgetLocalizedCache(
            'home.projects',
            'home.projects.v2',
            'home.projects.v3',
            'home.projects_count',
            'projects.index',
            "projects.related.{$this->id}",
        );
    }

    /**
     * @return list<string>
     */
    public function translatableAttributes(): array
    {
        return ['title', 'description', 'content'];
    }

    protected $fillable = [
        'title',
        'slug',
        'project_type',
        'description',
        'content',
        'image',
        'screenshots',
        'platforms',
        'demo_url',
        'github_url',
        'private_repo',
        'store_links',
        'tags',
        'featured',
        'published',
        'sort_order',
    ];

    protected $casts = [
        'tags' => 'array',
        'platforms' => 'array',
        'screenshots' => 'array',
        'store_links' => 'array',
        'private_repo' => 'boolean',
        'featured' => 'boolean',
        'published' => 'boolean',
    ];

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

    public function getImageUrlAttribute(): string
    {
        if ($this->image) {
            return asset('storage/'.$this->image);
        }

        return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=70&auto=format';
    }

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

    public function getProjectTypeLabelAttribute(): string
    {
        return match ($this->project_type) {
            'web' => 'Web',
            'mobile' => 'Mobile',
            'desktop' => 'Desktop',
            'api' => 'API',
            default => 'Projet',
        };
    }
}
