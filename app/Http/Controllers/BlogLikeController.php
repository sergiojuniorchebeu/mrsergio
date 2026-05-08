<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\BlogPostLike;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogLikeController extends Controller
{
    public function toggle(Request $request, BlogPost $post): JsonResponse
    {
        abort_unless($post->published, 404);

        $ip = $request->ip();

        $existing = BlogPostLike::where('post_id', $post->id)
            ->where('ip_address', $ip)
            ->first();

        if ($existing) {
            $existing->delete();
            $liked = false;
        } else {
            BlogPostLike::create(['post_id' => $post->id, 'ip_address' => $ip]);
            $liked = true;
        }

        $count = $post->likes()->count();

        return response()->json(['liked' => $liked, 'likes_count' => $count]);
    }
}
