<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CookiePolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_cookie_policy_page_lists_the_cookies_used_by_the_site(): void
    {
        $this->get('/cookies')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Cookies')
                ->has('cookies', 5)
                ->where('cookies.0.name', config('session.cookie'))
                ->where('cookies.2.name', 'appearance')
                ->where('seo.canonical', route('cookies'))
            );
    }

    public function test_cookie_policy_is_translated_when_english_is_chosen(): void
    {
        $this->withUnencryptedCookie('language', 'en')
            ->get('/cookies')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('cookies.2.purpose', 'Remembers your chosen theme (light, dark or automatic).')
                ->where('cookies.3.name', 'language')
                ->where('cookies.4.duration', '5 years')
            );
    }

    public function test_appearance_cookie_is_shared_with_the_root_view(): void
    {
        $this->withUnencryptedCookie('appearance', 'dark')
            ->get('/cookies')
            ->assertOk()
            ->assertSee('class="dark"', false);
    }
}
