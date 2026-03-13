<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Index sur la table projects
        Schema::table('projects', function (Blueprint $table) {
            if (!$this->hasIndex('projects', 'projects_published_index')) {
                $table->index('published', 'projects_published_index');
            }
            if (!$this->hasIndex('projects', 'projects_featured_index')) {
                $table->index('featured', 'projects_featured_index');
            }
            if (!$this->hasIndex('projects', 'projects_sort_order_index')) {
                $table->index('sort_order', 'projects_sort_order_index');
            }
        });

        // Index sur la table blog_posts
        Schema::table('blog_posts', function (Blueprint $table) {
            if (!$this->hasIndex('blog_posts', 'blog_posts_published_index')) {
                $table->index('published', 'blog_posts_published_index');
            }
            if (!$this->hasIndex('blog_posts', 'blog_posts_published_at_index')) {
                $table->index('published_at', 'blog_posts_published_at_index');
            }
        });

        // Index sur la table formations
        Schema::table('formations', function (Blueprint $table) {
            if (!$this->hasIndex('formations', 'formations_published_index')) {
                $table->index('published', 'formations_published_index');
            }
            if (!$this->hasIndex('formations', 'formations_featured_index')) {
                $table->index('featured', 'formations_featured_index');
            }
            if (!$this->hasIndex('formations', 'formations_category_index')) {
                $table->index('category', 'formations_category_index');
            }
            if (!$this->hasIndex('formations', 'formations_sort_order_index')) {
                $table->index('sort_order', 'formations_sort_order_index');
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex('projects_published_index');
            $table->dropIndex('projects_featured_index');
            $table->dropIndex('projects_sort_order_index');
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropIndex('blog_posts_published_index');
            $table->dropIndex('blog_posts_published_at_index');
        });

        Schema::table('formations', function (Blueprint $table) {
            $table->dropIndex('formations_published_index');
            $table->dropIndex('formations_featured_index');
            $table->dropIndex('formations_category_index');
            $table->dropIndex('formations_sort_order_index');
        });
    }

    private function hasIndex(string $table, string $index): bool
    {
        try {
            $indexes = \DB::select("PRAGMA index_list({$table})");
            return collect($indexes)->pluck('name')->contains($index);
        } catch (\Exception) {
            return false;
        }
    }
};
