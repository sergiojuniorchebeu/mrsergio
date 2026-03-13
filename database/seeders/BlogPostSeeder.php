<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        BlogPost::truncate();

        $posts = [
            [
                'title'        => 'Mon stack 2026 : Laravel + Inertia + React',
                'slug'         => 'mon-stack-2026-laravel-inertia-react',
                'excerpt'      => 'Pourquoi ce trio est ultra efficace pour un portfolio moderne : vitesse de développement, DX incroyable, UI clean et SEO correct — tout ça sans API séparée.',
                'content'      => trim('
## Pourquoi ce stack ?

En 2026, se battre entre "tout API REST" et "frontend découplé" ne devrait plus être le débat central. Laravel + Inertia.js + React vous donne le meilleur des deux mondes :

- **Laravel** pour la structure, l\'écosystème mature et la sécurité
- **Inertia** pour le confort "SPA" sans complexité d\'une API séparée
- **React** pour l\'UI composant-driven avec TypeScript pour la robustesse

## Ce que j\'applique dans ce portfolio

```php
// Controller simple — pas d\'API, juste du sens
public function index(): Response
{
    return Inertia::render(\'Projects/Index\', [
        \'projects\' => Project::published()->ordered()->get(),
    ]);
}
```

Les données passent directement du controller PHP à React via Inertia. Pas de fetch(), pas de useEffect() pour charger les données, pas d\'état de chargement à gérer.

## Les avantages concrets

1. **TypeScript natif** — Les types des props sont générés ou écrits une fois côté front
2. **SEO parfait** — Le SSR Inertia rend du HTML côté serveur
3. **Formulaires simples** — `useForm()` d\'Inertia gère validation + erreurs + reset
4. **Auth built-in** — Sanctum, sessions, middleware : tout Laravel

## Next step

Ajouter un mini CMS admin avec CRUD complet (déjà fait dans ce portfolio 😄).
                '),
                'cover_image'  => null,
                'tags'         => ['Laravel', 'Inertia', 'React', 'TypeScript'],
                'featured'     => true,
                'published'    => true,
                'published_at' => Carbon::now()->subDays(10),
                'sort_order'   => 1,
            ],
            [
                'title'        => 'Architecture propre côté Front avec Inertia',
                'slug'         => 'architecture-propre-front-inertia',
                'excerpt'      => 'Comment je structure Pages, Components, types TypeScript et hooks pour rester scalable quand le projet grossit.',
                'content'      => trim('
## La structure que j\'utilise

```
resources/js/
├── pages/          # Routes Inertia (une page = un fichier)
│   ├── Home.tsx
│   ├── Projects/
│   │   ├── Index.tsx
│   │   └── Show.tsx
│   └── Admin/
├── components/
│   ├── ui/         # Composants réutilisables (Button, Card...)
│   └── layout/     # Header, Footer, Sidebar
├── layouts/        # Layouts globaux (MainLayout, AdminLayout)
├── types/          # Interfaces TypeScript (Project, BlogPost...)
└── lib/
    └── utils.ts    # cn(), easings, helpers
```

## Règle d\'or

**Le backend décide des champs, le front consomme ce contrat.**

Je définis les interfaces TypeScript en miroir de ce que le controller envoie. Ça force la discipline côté PHP : on ne renvoie que ce dont le front a besoin.

```typescript
// types/index.ts
export interface Project {
    id: number;
    title: string;
    slug: string;
    image_url: string;
    tags: string[];
    featured: boolean;
}
```

## Les composants UI

Je sépare les composants "dumb" (UI pure, sans logique) des composants "smart" (avec état, effets). Les composants UI sont dans `components/ui/` et ne connaissent pas Laravel.
                '),
                'cover_image'  => null,
                'tags'         => ['Inertia', 'React', 'TypeScript', 'Architecture'],
                'featured'     => false,
                'published'    => true,
                'published_at' => Carbon::now()->subDays(6),
                'sort_order'   => 2,
            ],
            [
                'title'        => 'Optimiser les performances Laravel : Cache, Index & N+1',
                'slug'         => 'optimiser-performances-laravel',
                'excerpt'      => 'Les 3 leviers qui font passer une app Laravel de "ça marche" à "c\'est rapide" : cache applicatif, index de base de données et détection des requêtes N+1.',
                'content'      => trim('
## Le problème le plus courant : le N+1

```php
// ❌ N+1 — 1 query pour les projets + N queries pour les tags
$projects = Project::all();
foreach ($projects as $p) {
    echo $p->tags->count(); // Query à chaque itération !
}

// ✅ Eager loading — 2 queries au total
$projects = Project::with(\'tags\')->get();
```

Utilisez **Laravel Debugbar** en développement pour détecter les N+1 automatiquement.

## Le cache applicatif

Pour un portfolio, les données changent rarement. Le cache est le gain de performance le plus simple :

```php
$projects = Cache::remember(\'projects.index\', 600, function () {
    return Project::published()->ordered()->get();
});
```

600 secondes = 10 minutes. Votre base de données ne sera requêtée qu\'une fois toutes les 10 minutes au lieu de à chaque visite.

**Invalidation** : pensez à vider le cache quand vous sauvegardez un projet :

```php
// Dans votre Model ou Observer
protected static function booted(): void
{
    static::saved(fn() => Cache::forget(\'projects.index\'));
    static::deleted(fn() => Cache::forget(\'projects.index\'));
}
```

## Les index de base de données

Les colonnes utilisées dans les `WHERE` doivent avoir un index :

```php
// Migration
$table->index(\'published\');
$table->index(\'slug\'); // Déjà unique, donc automatiquement indexé
$table->index(\'sort_order\');
```

Sur SQLite, la différence est moindre pour des petits volumes. Mais en production avec MySQL + des milliers de lignes, c\'est 10-100x plus rapide.
                '),
                'cover_image'  => null,
                'tags'         => ['Laravel', 'Performance', 'MySQL', 'Cache'],
                'featured'     => false,
                'published'    => true,
                'published_at' => Carbon::now()->subDays(2),
                'sort_order'   => 3,
            ],
            [
                'title'        => 'Flutter vs React Native en 2026 : mon retour d\'expérience',
                'slug'         => 'flutter-vs-react-native-2026',
                'excerpt'      => 'Après avoir développé des apps sur les deux frameworks, voici ce que j\'aurais voulu savoir avant de choisir.',
                'content'      => trim('
## Le contexte

J\'ai utilisé React Native sur 2 projets en 2023-2024, puis Flutter sur 3 projets depuis. Voici mon retour honnête.

## Flutter : les points forts

- **Performance native** : Flutter se compile en bytecode ARM, pas de pont JavaScript
- **UI pixel-perfect** : les widgets Flutter sont les mêmes sur iOS et Android
- **Hot reload** : le rechargement à chaud est extrêmement rapide
- **Dart** : un langage propre, typé, avec une courbe d\'apprentissage courte si vous venez de TypeScript

## React Native : les points forts

- **Partage de code web/mobile** : si vous faites déjà React, l\'apprentissage est minimal
- **Écosystème npm** : accès à des milliers de packages JavaScript
- **Expo** : simplifie énormément le setup initial

## Mon verdict 2026

Pour les **nouveaux projets**, je choisis **Flutter**. La performance, la cohérence UI et le tooling (Dart DevTools) sont supérieurs. La seule exception : si l\'équipe est 100% web et doit livrer vite, React Native avec Expo est un bon choix.

## Ce que ça change pour le backend

Que ce soit Flutter ou React Native, le backend est identique : une API REST Laravel avec Sanctum. La différence se joue côté client, pas côté serveur.
                '),
                'cover_image'  => null,
                'tags'         => ['Flutter', 'React', 'Mobile', 'Dart'],
                'featured'     => true,
                'published'    => true,
                'published_at' => Carbon::now()->subDays(1),
                'sort_order'   => 4,
            ],
        ];

        foreach ($posts as $data) {
            BlogPost::create($data);
        }

        $this->command->info('✅ 4 articles de blog seedés avec succès !');
    }
}