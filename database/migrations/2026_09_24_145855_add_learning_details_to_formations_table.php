<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->string('format')->default('Cours en ligne')->after('language');
            $table->text('target_audience')->nullable()->after('format');
            $table->text('prerequisites')->nullable()->after('target_audience');
            $table->json('outcomes')->default('[]')->after('prerequisites');
            $table->string('cta_label')->nullable()->after('outcomes');
            $table->string('cta_url')->nullable()->after('cta_label');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropColumn(['format', 'target_audience', 'prerequisites', 'outcomes', 'cta_label', 'cta_url']);
        });
    }
};
