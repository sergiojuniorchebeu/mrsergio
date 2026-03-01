<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->json('platforms')->nullable()->after('tags');
            $table->json('screenshots')->nullable()->after('image');
            $table->boolean('private_repo')->default(false)->after('github_url');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['platforms', 'screenshots', 'private_repo']);
        });
    }
};
