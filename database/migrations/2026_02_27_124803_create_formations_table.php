<?php

// database/migrations/xxxx_create_formations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();

            // ── Infos principales ─────────────────────────────────────────
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt');               // résumé court — card
            $table->longText('content')->nullable(); // programme détaillé — show

            // ── Médias ────────────────────────────────────────────────────
            $table->string('cover_image')->nullable();
            $table->string('preview_video_url')->nullable(); // lien YouTube/Vimeo

            // ── Taxonomie ─────────────────────────────────────────────────
            $table->string('category');            // ex: "Laravel", "Flutter"...
            $table->json('tags')->default('[]');   // ex: ["Backend","API","Auth"]
            $table->enum('level', ['débutant', 'intermédiaire', 'avancé'])->default('débutant');
            $table->string('language')->default('Français');

            // ── Métriques ─────────────────────────────────────────────────
            $table->unsignedInteger('duration_hours')->default(0);   // durée totale en h
            $table->unsignedInteger('lessons_count')->default(0);    // nb de leçons
            $table->unsignedInteger('students_count')->default(0);   // nb d'inscrits

            // ── Tarif ─────────────────────────────────────────────────────
            $table->boolean('is_free')->default(false);
            $table->decimal('price', 8, 2)->nullable();              // null = gratuit
            $table->string('currency')->default('EUR');

            // ── Statut ────────────────────────────────────────────────────
            $table->boolean('featured')->default(false);
            $table->boolean('published')->default(true);
            $table->timestamp('published_at')->nullable();

            // ── Ordre ─────────────────────────────────────────────────────
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};