<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_renders(): void
    {
        $this->get(route('login'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Auth/Login'));
    }

    public function test_admin_is_redirected_to_admin_after_login(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->post('/login', ['email' => $admin->email, 'password' => 'password', 'remember' => true])
            ->assertRedirect('/admin');

        $this->assertAuthenticatedAs($admin);
    }

    public function test_wrong_password_returns_an_email_error(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->from('/login')
            ->post('/login', ['email' => $admin->email, 'password' => 'mauvais-mot-de-passe'])
            ->assertRedirect('/login')
            ->assertSessionHasErrors(['email' => 'Ces identifiants ne correspondent à aucun compte.']);

        $this->assertGuest();
    }
}
