<?php

// app/Models/Project.php
// ─────────────────────────────────────────────────────────────────────────────
// Modèle Eloquent — Project
// Flutter équivalent : classe Dart avec fromJson/toJson + propriétés typées
// ─────────────────────────────────────────────────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class Project extends Model
{
    use HasFactory;

    // ── Champs assignables en masse ───────────────────────────────────────
    // Flutter équivalent : les propriétés du constructor
    // Sans cette liste → erreur MassAssignmentException sur create/update
    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'image',
        'demo_url',
        'github_url',
        'tags',
        'featured',
        'published',
        'sort_order',
    ];

    // ── Casts — typage automatique des champs ─────────────────────────────
    // Flutter équivalent : List.from(json['tags']) dans fromJson()
    // Ici Laravel le fait automatiquement à chaque lecture/écriture
    protected $casts = [
        'tags'      => 'array',    // JSON → PHP array → JSON automatiquement
        'featured'  => 'boolean',
        'published' => 'boolean',
    ];

    // ─────────────────────────────────────────────────────────────────────
    // SCOPES — filtres réutilisables (comme des méthodes static en Flutter)
    // Usage : Project::published()->featured()->get()
    // ─────────────────────────────────────────────────────────────────────

    // Seulement les projets publiés (visibles au public)
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('published', true);
    }

    // Seulement les projets mis en avant (pour la home)
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }

    // Trier par ordre d'affichage puis par date
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('created_at');
    }

    // ─────────────────────────────────────────────────────────────────────
    // ACCESSORS — propriétés calculées (comme des getters en Dart)
    // ─────────────────────────────────────────────────────────────────────

    // URL de l'image — retourne une image placeholder si pas d'image
    // Flutter équivalent : String get imageUrl => image ?? 'assets/placeholder.png'
    public function getImageUrlAttribute(): string
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }

        // Placeholder généré automatiquement avec le titre
        return 'https://og-image.vercel.app/' . urlencode($this->title) . '.png';
    }
}