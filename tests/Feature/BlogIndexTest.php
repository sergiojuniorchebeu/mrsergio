<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BlogIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_blog_page_renders_the_expected_inertia_component(): void
    {
        $response = $this->get(route('blog.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Blog/Index')
            ->has('posts'));
    }
}
