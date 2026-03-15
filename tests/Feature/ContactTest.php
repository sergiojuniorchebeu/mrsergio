<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_page_renders_successfully(): void
    {
        $response = $this->get(route('contact'));

        $response->assertOk();
    }

    public function test_contact_form_stores_message_in_database(): void
    {
        $payload = [
            'name' => 'Jean Dupont',
            'email' => 'jean@example.com',
            'subject' => 'Projet web',
            'message' => 'Je souhaite discuter d\'un projet de site vitrine pour mon entreprise.',
        ];

        $response = $this->post(route('contact.send'), $payload);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Jean Dupont',
            'email' => 'jean@example.com',
            'subject' => 'Projet web',
        ]);
    }

    public function test_contact_form_validates_required_fields(): void
    {
        $response = $this->post(route('contact.send'), []);

        $response->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
    }

    public function test_contact_form_validates_email_format(): void
    {
        $response = $this->post(route('contact.send'), [
            'name' => 'Jean Dupont',
            'email' => 'not-an-email',
            'subject' => 'Test sujet',
            'message' => 'Un message suffisamment long pour la validation.',
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_contact_form_validates_minimum_lengths(): void
    {
        $response = $this->post(route('contact.send'), [
            'name' => 'J',
            'email' => 'j@e.com',
            'subject' => 'AB',
            'message' => 'Court',
        ]);

        $response->assertSessionHasErrors(['name', 'subject', 'message']);
    }

    public function test_contact_message_defaults_to_unread(): void
    {
        $payload = [
            'name' => 'Marie Test',
            'email' => 'marie@test.com',
            'subject' => 'Test unread',
            'message' => 'Ce message devrait être non lu par défaut.',
        ];

        $this->post(route('contact.send'), $payload);

        $message = ContactMessage::first();

        $this->assertNotNull($message);
        $this->assertFalse($message->read);
    }
}
