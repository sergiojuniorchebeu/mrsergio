<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Sept statuts deviennent quatre : inscrite, en_attente, traitée (demandes sans session), annulée.
     * La présence n'est plus pointée à la main.
     */
    public function up(): void
    {
        $enrollments = fn () => DB::table('formation_enrollments');

        $enrollments()->whereNotNull('formation_session_id')
            ->whereIn('status', ['nouvelle', 'contactée', 'confirmée', 'présente', 'absente'])
            ->update(['status' => 'inscrite']);
        $enrollments()->whereNotNull('formation_session_id')
            ->where('status', 'archivée')
            ->update(['status' => 'annulée']);
        $enrollments()->whereNull('formation_session_id')
            ->where('status', 'nouvelle')
            ->update(['status' => 'inscrite']);
        $enrollments()->whereNull('formation_session_id')
            ->whereNotIn('status', ['inscrite'])
            ->update(['status' => 'traitée']);

        Schema::table('formation_enrollments', function (Blueprint $table) {
            $table->string('status')->default('inscrite')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('formation_enrollments')->where('status', 'inscrite')->update(['status' => 'nouvelle']);
        DB::table('formation_enrollments')->whereIn('status', ['traitée', 'annulée'])->update(['status' => 'archivée']);

        Schema::table('formation_enrollments', function (Blueprint $table) {
            $table->string('status')->default('nouvelle')->change();
        });
    }
};
