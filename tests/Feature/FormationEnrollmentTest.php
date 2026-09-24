<?php

namespace Tests\Feature;

use App\Models\Formation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FormationEnrollmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_visitor_can_submit_a_formation_enrollment(): void
    {
        $formation = Formation::create([
            'title' => 'Laravel pour débuter',
            'slug' => 'laravel-pour-debuter',
            'excerpt' => 'Une formation pratique.',
            'category' => 'Laravel',
            'published' => true,
        ]);

        $response = $this->post(route('formations.enroll', $formation), [
            'name' => 'Aline M.',
            'email' => 'aline@example.com',
            'phone' => '+237 690000000',
            'message' => 'Je souhaite connaître les prochaines dates.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('formation_enrollments', [
            'formation_id' => $formation->id,
            'email' => 'aline@example.com',
            'status' => 'nouvelle',
        ]);
    }

    public function test_an_enrollment_requires_a_valid_name_and_email(): void
    {
        $formation = Formation::create([
            'title' => 'Flutter pratique',
            'slug' => 'flutter-pratique',
            'excerpt' => 'Une formation pratique.',
            'category' => 'Flutter',
            'published' => true,
        ]);

        $response = $this->from(route('formations.show', $formation))
            ->post(route('formations.enroll', $formation), [
                'name' => '',
                'email' => 'invalid',
            ]);

        $response->assertRedirect(route('formations.show', $formation));
        $response->assertSessionHasErrors(['name', 'email']);
        $this->assertDatabaseCount('formation_enrollments', 0);
    }

    public function test_an_admin_can_update_a_formation(): void
    {
        $formation = Formation::create([
            'title' => 'Ancien titre',
            'slug' => 'ancien-titre',
            'excerpt' => 'Une formation pratique.',
            'category' => 'Laravel',
            'published' => true,
        ]);

        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $response = $this->put(route('admin.formations.update', $formation), [
            'title' => 'Nouveau titre',
            'excerpt' => 'Une nouvelle description.',
            'content' => '# Programme',
            'category' => 'Laravel',
            'tags' => ['Backend'],
            'level' => 'débutant',
            'language' => 'Français',
            'format' => 'Cours en ligne',
            'target_audience' => 'Débutants',
            'prerequisites' => 'Aucun',
            'outcomes' => ['Créer une application'],
            'cta_label' => 'S’inscrire',
            'cta_url' => '',
            'duration_hours' => 8,
            'lessons_count' => 12,
            'is_free' => true,
            'featured' => false,
            'published' => true,
            'sort_order' => 1,
        ]);

        $response->assertRedirect(route('admin.formations.index'));
        $this->assertDatabaseHas('formations', [
            'id' => $formation->id,
            'title' => 'Nouveau titre',
            'slug' => 'nouveau-titre',
        ]);
    }
}
