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
                'title'        => 'Mon stack 2026 : Laravel + Inertia + Tailwind',
                'slug'         => 'mon-stack-2026-laravel-inertia-tailwind',
                'excerpt'      => 'Pourquoi ce trio est ultra efficace pour un portfolio moderne : vitesse, DX, UI clean et SEO correct.',
                'content'      => trim('
## Pourquoi ce stack ?
- Laravel pour la structure, l’écosystème et la sécurité
- Inertia pour le confort “SPA” sans complexité API
- Tailwind pour itérer vite avec une UI cohérente

## Ce que j’applique dans ce portfolio
- Pages publiques simples et performantes
- Données servies via Controller (map only needed fields)
- Seeders pour avancer sans dashboard

## Next step
Ajouter un mini CMS admin plus tard (auth + CRUD).
                '),
                'cover_image'  => null,
                'tags'         => ['Laravel', 'Inertia', 'Tailwind', 'TypeScript'],
                'featured'     => true,
                'published'    => true,
                'published_at' => Carbon::now()->subDays(10),
                'sort_order'   => 1,
            ],
            [
                'title'        => 'Architecture propre côté Front Inertia',
                'slug'         => 'architecture-propre-front-inertia',
                'excerpt'      => 'Comment je structure Pages, Components, UI, et types TS pour rester scalable.',
                'content'      => trim('
## Structure
- resources/js/Pages (routes)
- resources/js/components (UI réutilisable)
- resources/js/types (contrats front/back)

## Règle d’or
Le backend décide des champs, le front consomme ce contrat.
                '),
                'cover_image'  => null,
                'tags'         => ['Inertia', 'React', 'TypeScript'],
                'featured'     => false,
                'published'    => true,
                'published_at' => Carbon::now()->subDays(6),
                'sort_order'   => 2,
            ],
            [
                'title'        => 'Seeders : avancer vite sans dashboard',
                'slug'         => 'seeders-avancer-vite-sans-dashboard',
                'excerpt'      => 'Le meilleur hack quand tu construis vite : données réalistes, UI finalisée, admin plus tard.',
                'content'      => trim('
## Pourquoi seed ?
- UI prête rapidement
- Contenu réaliste pour tester
- Moins de temps perdu sur admin trop tôt

## Ensuite
Quand tout est validé, tu ajoutes ton dashboard CRUD.
                '),
                'cover_image'  => null,
                'tags'         => ['Laravel', 'Database', 'Productivité'],
                'featured'     => false,
                'published'    => true,
                'published_at' => Carbon::now()->subDays(2),
                'sort_order'   => 3,
            ],
        ];

        foreach ($posts as $data) {
            BlogPost::create($data);
        }

        $this->command->info('✅ Blog posts seedés avec succès !');
    }
}