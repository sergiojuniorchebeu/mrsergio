<?php

// database/seeders/ProjectSeeder.php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        Project::truncate();

        $projects = [

            // ── Projet 1 — App mobile Flutter ────────────────────────────
            [
                'title'       => 'MrMarket — App de gestion de marché',
                'slug'        => 'mrmarket-app-gestion-marche',
                'description' => 'Application mobile Flutter pour la gestion des vendeurs, stocks et transactions d\'un marché local. Backend Laravel avec API REST et authentification JWT.',
                'content'     => '
## Contexte

MrMarket est une application mobile développée pour digitaliser la gestion d\'un marché local au Cameroun. Les vendeurs pouvaient gérer leurs stocks, suivre leurs ventes et recevoir des paiements en temps réel.

## Stack technique

- **Mobile** : Flutter (Dart) — iOS & Android
- **Backend** : Laravel 11 + API REST
- **Auth** : JWT (tymon/jwt-auth)
- **BDD** : MySQL
- **Paiements** : Mobile Money (Orange, MTN)

## Fonctionnalités clés

- Gestion des vendeurs et leurs emplacements
- Suivi des stocks en temps réel
- Tableau de bord des ventes avec graphiques
- Notifications push (Firebase Cloud Messaging)
- Mode hors-ligne avec synchronisation

## Ce que j\'ai appris

Ce projet m\'a permis de maîtriser l\'architecture clean en Flutter (BLoC pattern) et la mise en place d\'une API REST robuste avec Laravel Sanctum pour l\'authentification multi-device.
                ',
                'image'       => null,
                'screenshots' => null,
                'platforms'   => ['Android', 'iOS'],
                'demo_url'    => null,
                'github_url'  => 'https://github.com/sergiojuniorchebeu/mrmarket',
                'private_repo'=> false,
                'tags'        => ['Flutter', 'Laravel', 'MySQL', 'Firebase', 'Dart'],
                'featured'    => true,
                'published'   => true,
                'sort_order'  => 1,
            ],

            // ── Projet 2 — Plateforme web Laravel + React ─────────────────
            [
                'title'       => 'DevConnect — Communauté de développeurs',
                'slug'        => 'devconnect-communaute-developpeurs',
                'description' => 'Plateforme web de mise en relation de développeurs africains. Partage d\'articles, forum d\'entraide, profils publics et système de mentorat.',
                'content'     => '
## Contexte

DevConnect est une plateforme communautaire conçue pour connecter les développeurs d\'Afrique francophone. L\'objectif : créer un espace d\'apprentissage, de partage et d\'opportunités professionnelles.

## Stack technique

- **Frontend** : React 18 + TypeScript + Tailwind CSS
- **Backend** : Laravel 12 + Inertia.js
- **BDD** : PostgreSQL
- **Cache** : Redis
- **Stockage** : AWS S3
- **Déploiement** : DigitalOcean + Nginx

## Fonctionnalités clés

- Profils développeurs avec portfolio
- Système d\'articles avec éditeur Markdown
- Forum de questions/réponses (type Stack Overflow)
- Système de mentorat avec prise de rendez-vous
- Messagerie en temps réel (Laravel Echo + Pusher)
- Tableau de bord analytics pour les admins

## Architecture

J\'ai utilisé le pattern Repository pour abstraire la couche de données, et des Jobs Laravel pour les tâches asynchrones (envoi d\'emails, génération de thumbnails).
                ',
                'image'       => null,
                'screenshots' => null,
                'platforms'   => ['Web'],
                'demo_url'    => 'https://devconnect.demo',
                'github_url'  => 'https://github.com/sergiojuniorchebeu/devconnect',
                'private_repo'=> false,
                'tags'        => ['Laravel', 'React', 'TypeScript', 'PostgreSQL', 'Redis'],
                'featured'    => true,
                'published'   => true,
                'sort_order'  => 2,
            ],

            // ── Projet 3 — Dashboard analytique ──────────────────────────
            [
                'title'       => 'AnalyticsPro — Dashboard de suivi KPI',
                'slug'        => 'analyticspro-dashboard-kpi',
                'description' => 'Dashboard analytique en temps réel pour PME. Visualisation des KPI business, rapports automatisés, alertes configurables et export PDF/Excel.',
                'content'     => '
## Contexte

AnalyticsPro est un outil SaaS de suivi des indicateurs clés de performance pour les petites et moyennes entreprises. Il agrège des données de plusieurs sources (ventes, RH, finance) en une interface unifiée.

## Stack technique

- **Frontend** : React + Recharts + Tailwind CSS
- **Backend** : Laravel + API REST
- **BDD** : MySQL + Redis (cache des métriques)
- **Exports** : Laravel DomPDF + PhpSpreadsheet
- **Temps réel** : Laravel Reverb (WebSocket natif)

## Fonctionnalités clés

- Dashboard customisable par drag & drop
- Graphiques interactifs (ligne, barre, camembert, jauge)
- Alertes configurables par seuil (email + SMS)
- Rapports automatisés planifiés (cron)
- Export PDF et Excel des données
- Gestion multi-entreprises (multi-tenant)

## Défi technique

La partie la plus complexe était la gestion du cache des métriques avec Redis. J\'ai mis en place un système d\'invalidation intelligent qui recalcule uniquement les métriques impactées par une nouvelle entrée de données, réduisant le temps de chargement de 3s à 180ms.
                ',
                'image'       => null,
                'screenshots' => null,
                'platforms'   => ['Web'],
                'demo_url'    => 'https://analyticspro.demo',
                'github_url'  => 'https://github.com/sergiojuniorchebeu/analyticspro',
                'private_repo'=> false,
                'tags'        => ['Laravel', 'React', 'MySQL', 'Redis', 'Python'],
                'featured'    => true,
                'published'   => true,
                'sort_order'  => 3,
            ],

            // ── Projet 4 — Portfolio mrsergio ─────────────────────────────
            [
                'title'       => 'mrsergio.dev — Portfolio personnel',
                'slug'        => 'mrsergio-portfolio',
                'description' => 'Portfolio full stack avec Laravel 12, Inertia.js et React/TypeScript. Admin CMS intégré, blog, formations, gestion de projets et formulaire de contact.',
                'content'     => '
## Ce projet, justement

Ce portfolio est lui-même un projet full stack conçu pour démontrer mes compétences en développement web moderne.

## Stack technique

- **Backend** : Laravel 12
- **Frontend** : React 18 + TypeScript + Inertia.js
- **Styling** : Tailwind CSS + animations Framer Motion
- **BDD** : SQLite (local) / MySQL (prod)
- **Cache** : Laravel Cache (file/database)
- **Admin** : CMS maison avec authentification

## Fonctionnalités

- Portfolio de projets avec filtres par technologie
- Blog avec rendu Markdown
- Section formations avec prix et niveaux
- Formulaire de contact avec anti-spam
- Dashboard admin CRUD complet
- SEO optimisé (meta, Open Graph)
                ',
                'image'       => null,
                'screenshots' => null,
                'platforms'   => ['Web'],
                'demo_url'    => 'https://mrsergio.dev',
                'github_url'  => null,
                'private_repo'=> true,
                'tags'        => ['Laravel', 'React', 'TypeScript', 'Inertia', 'Tailwind'],
                'featured'    => false,
                'published'   => true,
                'sort_order'  => 4,
            ],
        ];

        foreach ($projects as $data) {
            Project::create($data);
        }

        $this->command->info('✅ 4 projets seedés avec succès !');
    }
}