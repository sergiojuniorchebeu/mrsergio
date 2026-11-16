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
        Schema::table('formation_enrollments', function (Blueprint $table) {
            $table->foreignId('formation_session_id')
                ->nullable()
                ->after('formation_id')
                ->constrained('formation_sessions')
                ->nullOnDelete();
            $table->timestamp('confirmation_sent_at')->nullable();
            $table->timestamp('reminder_sent_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formation_enrollments', function (Blueprint $table) {
            //
        });
    }
};
