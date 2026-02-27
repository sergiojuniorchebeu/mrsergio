<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            // ── Infos principales ─────────────────────────────────────────
            $table->string('title');
            $table->string('slug')->unique();          // URL : /projects/mon-projet
            $table->text('description');               // Court — pour la card
            $table->longText('content')->nullable();   // Long — pour la page détail

            // ── Médias ────────────────────────────────────────────────────
            $table->string('image')->nullable();       // chemin : storage/projects/...
            $table->string('demo_url')->nullable();    // lien live
            $table->string('github_url')->nullable();  // lien repo

            // ── Taxonomie ─────────────────────────────────────────────────
            // JSON array ex: ["Laravel", "React", "MySQL"]
            // Flutter équivalent : List<String> tags
            $table->json('tags')->default('[]');

            // ── Statut & mise en avant ────────────────────────────────────
            $table->boolean('featured')->default(false);  // affiché en home
            $table->boolean('published')->default(true);  // visible publiquement

            // ── Ordre d'affichage (drag & drop plus tard) ─────────────────
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};