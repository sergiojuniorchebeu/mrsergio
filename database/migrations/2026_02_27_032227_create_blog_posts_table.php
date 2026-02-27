<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();

            // Contenu
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt');
            $table->longText('content')->nullable();

            // Médias / SEO léger
            $table->string('cover_image')->nullable(); // storage/blog/...
            $table->json('tags')->default('[]');

            // Statut
            $table->boolean('featured')->default(false);
            $table->boolean('published')->default(true);
            $table->timestamp('published_at')->nullable();

            // Tri
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};