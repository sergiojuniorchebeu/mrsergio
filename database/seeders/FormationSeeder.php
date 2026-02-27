<?php

// database/seeders/FormationSeeder.php

namespace Database\Seeders;

use App\Models\Formation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class FormationSeeder extends Seeder
{
    public function run(): void
    {
        Formation::truncate();

        $formations = [

            // ── 1. Laravel complet ────────────────────────────────────────
            [
                'title'             => 'Laravel de zéro à l\'API REST',
                'slug'              => 'laravel-zero-api-rest',
                'excerpt'           => 'Maîtrisez Laravel 12 de l\'installation à la mise en production d\'une API REST sécurisée avec authentification JWT, tests et déploiement.',
                'content'           => '
## Ce que vous allez apprendre

- Installation et configuration de Laravel 12
- Architecture MVC et conventions Eloquent
- Migrations, seeders et factories
- Authentification avec Laravel Sanctum et JWT
- Création d\'une API REST complète (CRUD + pagination)
- Validation des données et gestion des erreurs
- Tests unitaires et d\'intégration avec Pest
- Déploiement sur VPS (DigitalOcean + Nginx + SSL)

## Prérequis

- Bases de PHP (variables, fonctions, tableaux)
- Notions de base de données (SQL)
- Terminal/ligne de commande

## Programme détaillé

### Module 1 — Fondations (4h)
Installation, structure, routing, contrôleurs, vues Blade.

### Module 2 — Base de données (5h)
Eloquent ORM, migrations, relations (hasMany, belongsTo, manyToMany).

### Module 3 — Authentification (3h)
Sanctum, JWT, middleware, rôles et permissions.

### Module 4 — API REST (6h)
Resources, collections, pagination, filtres, tri.

### Module 5 — Tests & Déploiement (3h)
Pest, factories, CI/CD basique, Nginx, SSL avec Let\'s Encrypt.
                ',
                'category'          => 'Laravel',
                'tags'              => ['PHP', 'API', 'Backend', 'MySQL', 'Sanctum'],
                'level'             => 'débutant',
                'language'          => 'Français',
                'duration_hours'    => 21,
                'lessons_count'     => 48,
                'students_count'    => 0,
                'is_free'           => false,
                'price'             => 29.99,
                'currency'          => 'EUR',
                'featured'          => true,
                'published'         => true,
                'published_at'      => Carbon::now()->subDays(5),
                'sort_order'        => 1,
            ],

            // ── 2. Flutter + Firebase ─────────────────────────────────────
            [
                'title'             => 'Flutter & Firebase — App mobile complète',
                'slug'              => 'flutter-firebase-app-mobile',
                'excerpt'           => 'Créez une application mobile iOS & Android complète avec Flutter, Firebase Auth, Firestore et notifications push. Du design à la publication sur les stores.',
                'content'           => '
## Ce que vous allez apprendre

- Widgets Flutter fondamentaux et personnalisés
- State management avec Provider et Riverpod
- Firebase Auth (email, Google, Apple Sign-in)
- Firestore : structure de données NoSQL en temps réel
- Firebase Storage pour les images
- Notifications push avec FCM
- Publication sur Google Play Store et App Store

## Prérequis

- Bases de la programmation (variables, conditions, boucles)
- Aucune expérience mobile requise

## Programme détaillé

### Module 1 — Dart & Flutter (5h)
Dart de zéro, widgets, layouts, navigation.

### Module 2 — UI avancée (4h)
Animations, thèmes, responsive design.

### Module 3 — Firebase (6h)
Auth, Firestore, Storage, règles de sécurité.

### Module 4 — Fonctionnalités avancées (4h)
Push notifications, offline mode, deep links.

### Module 5 — Publication (2h)
Signing, stores, mises à jour OTA.
                ',
                'category'          => 'Flutter',
                'tags'              => ['Dart', 'Firebase', 'Mobile', 'iOS', 'Android'],
                'level'             => 'débutant',
                'language'          => 'Français',
                'duration_hours'    => 21,
                'lessons_count'     => 52,
                'students_count'    => 0,
                'is_free'           => false,
                'price'             => 29.99,
                'currency'          => 'EUR',
                'featured'          => true,
                'published'         => true,
                'published_at'      => Carbon::now()->subDays(3),
                'sort_order'        => 2,
            ],

            // ── 3. Python Data & Automation ───────────────────────────────
            [
                'title'             => 'Python — Automatisation & Data',
                'slug'              => 'python-automatisation-data',
                'excerpt'           => 'Automatisez vos tâches répétitives et analysez vos données avec Python. Web scraping, manipulation de fichiers Excel/CSV, APIs et visualisations.',
                'content'           => '
## Ce que vous allez apprendre

- Python de zéro : syntaxe, fonctions, modules
- Manipulation de fichiers (CSV, Excel, JSON, PDF)
- Web scraping avec BeautifulSoup et Selenium
- Appels d\'API REST avec Requests
- Analyse de données avec Pandas
- Visualisations avec Matplotlib et Seaborn
- Automatisation de tâches planifiées (cron)

## Prérequis

- Aucune expérience en programmation requise

## Programme

### Module 1 — Python de zéro (4h)
Variables, listes, dictionnaires, fonctions, classes.

### Module 2 — Fichiers & APIs (4h)
Lecture/écriture CSV/Excel, appels REST, JSON.

### Module 3 — Web scraping (4h)
BeautifulSoup, Selenium, gestion des proxies.

### Module 4 — Data avec Pandas (4h)
DataFrames, nettoyage, agrégations, exports.

### Module 5 — Visualisations (2h)
Graphiques, dashboards simples, exports PDF.
                ',
                'category'          => 'Python',
                'tags'              => ['Data', 'Automatisation', 'Scraping', 'Pandas'],
                'level'             => 'débutant',
                'language'          => 'Français',
                'duration_hours'    => 18,
                'lessons_count'     => 40,
                'students_count'    => 0,
                'is_free'           => false,
                'price'             => 24.99,
                'currency'          => 'EUR',
                'featured'          => false,
                'published'         => true,
                'published_at'      => Carbon::now()->subDays(1),
                'sort_order'        => 3,
            ],

            // ── 4. Java POO ───────────────────────────────────────────────
            [
                'title'             => 'Java — Programmation orientée objet',
                'slug'              => 'java-programmation-orientee-objet',
                'excerpt'           => 'Maîtrisez les fondamentaux de Java et la programmation orientée objet. Classes, héritage, interfaces, collections et Spring Boot en introduction.',
                'content'           => '
## Ce que vous allez apprendre

- Syntaxe Java et types de données
- Programmation orientée objet (classes, objets, héritage)
- Interfaces, classes abstraites, polymorphisme
- Collections : List, Map, Set
- Gestion des exceptions
- Java streams et lambdas (Java 8+)
- Introduction à Spring Boot

## Prérequis

- Bases de logique algorithmique

## Programme

### Module 1 — Java fondamentaux (5h)
Types, opérateurs, conditions, boucles, tableaux.

### Module 2 — POO (6h)
Classes, constructeurs, héritage, encapsulation.

### Module 3 — Interfaces & Abstractions (4h)
Polymorphisme, design patterns de base.

### Module 4 — Collections & Streams (4h)
List, Map, Set, lambdas, streams, Optional.

### Module 5 — Spring Boot intro (3h)
REST controller, dépendances, JPA basique.
                ',
                'category'          => 'Java',
                'tags'              => ['POO', 'Spring Boot', 'Backend', 'Débutant'],
                'level'             => 'débutant',
                'language'          => 'Français',
                'duration_hours'    => 22,
                'lessons_count'     => 50,
                'students_count'    => 0,
                'is_free'           => true,
                'price'             => null,
                'currency'          => 'EUR',
                'featured'          => false,
                'published'         => true,
                'published_at'      => Carbon::now(),
                'sort_order'        => 4,
            ],
        ];

        foreach ($formations as $data) {
            Formation::create($data);
        }

        $this->command->info('✅ 4 formations seedées avec succès !');
    }
}