<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocaleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_french_is_the_default_language(): void
    {
        $this->post('/contact', [])
            ->assertSessionHasErrors(['name' => 'Le nom est obligatoire.']);
    }

    public function test_the_language_cookie_switches_server_messages_to_english(): void
    {
        $this->withUnencryptedCookie('language', 'en')
            ->post('/contact', [])
            ->assertSessionHasErrors(['name' => 'Your name is required.']);
    }

    public function test_an_unknown_language_falls_back_to_french(): void
    {
        $this->withUnencryptedCookie('language', 'de')
            ->post('/contact', [])
            ->assertSessionHasErrors(['name' => 'Le nom est obligatoire.']);
    }

    public function test_default_validation_messages_are_translated_in_french(): void
    {
        $this->assertSame('Ce champ est obligatoire.', __('validation.required', [], 'fr'));
    }
}
