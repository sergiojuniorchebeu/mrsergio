<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FormationsIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_formations_page_renders_the_expected_inertia_component(): void
    {
        $response = $this->get(route('formations.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('formations/FormationsIndex')
            ->has('formations')
            ->has('categories'));
    }
}
