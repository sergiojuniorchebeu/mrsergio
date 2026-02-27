<?php

// app/Models/Formation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'excerpt', 'content',
        'cover_image', 'preview_video_url',
        'category', 'tags', 'level', 'language',
        'duration_hours', 'lessons_count', 'students_count',
        'is_free', 'price', 'currency',
        'featured', 'published', 'published_at', 'sort_order',
    ];

    protected $casts = [
        'tags'         => 'array',
        'featured'     => 'boolean',
        'published'    => 'boolean',
        'is_free'      => 'boolean',
        'price'        => 'decimal:2',
        'published_at' => 'datetime',
    ];

    // ── Scopes ────────────────────────────────────────────────────────────
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('published', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('created_at');
    }

    // ── Accessors ─────────────────────────────────────────────────────────
    public function getCoverImageUrlAttribute(): string
    {
        if ($this->cover_image) {
            return asset('storage/' . $this->cover_image);
        }
        return 'https://og-image.vercel.app/' . urlencode($this->title) . '.png';
    }

    // Prix formaté — "Gratuit" ou "29,99 €"
    public function getPriceFormattedAttribute(): string
    {
        if ($this->is_free || !$this->price) return 'Gratuit';
        return number_format($this->price, 2, ',', ' ') . ' ' . $this->currency;
    }

    // Durée lisible — "4h 30min" ou "45 min"
    public function getDurationFormattedAttribute(): string
    {
        $h   = $this->duration_hours;
        if ($h === 0) return 'À venir';
        return $h . 'h';
    }

    // Badge de niveau avec couleur
    public function getLevelColorAttribute(): string
    {
        return match($this->level) {
            'débutant'       => 'green',
            'intermédiaire'  => 'amber',
            'avancé'         => 'red',
            default          => 'slate',
        };
    }
}