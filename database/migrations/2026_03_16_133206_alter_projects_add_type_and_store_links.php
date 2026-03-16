<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (! Schema::hasColumn('projects', 'project_type')) {
                $table->string('project_type', 20)->default('web')->after('slug');
            }

            if (! Schema::hasColumn('projects', 'platforms')) {
                $table->json('platforms')->default('[]')->after('tags');
            }

            if (! Schema::hasColumn('projects', 'screenshots')) {
                $table->json('screenshots')->default('[]')->after('image');
            }

            if (! Schema::hasColumn('projects', 'private_repo')) {
                $table->boolean('private_repo')->default(false)->after('github_url');
            }

            if (! Schema::hasColumn('projects', 'store_links')) {
                $table->json('store_links')->default('{}')->after('private_repo');
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'store_links')) {
                $table->dropColumn('store_links');
            }
            if (Schema::hasColumn('projects', 'private_repo')) {
                $table->dropColumn('private_repo');
            }
            if (Schema::hasColumn('projects', 'screenshots')) {
                $table->dropColumn('screenshots');
            }
            if (Schema::hasColumn('projects', 'platforms')) {
                $table->dropColumn('platforms');
            }
            if (Schema::hasColumn('projects', 'project_type')) {
                $table->dropColumn('project_type');
            }
        });
    }
};