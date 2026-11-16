<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\BlogPostComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BlogCommentController extends Controller
{
    // Limite par IP : 2 commentaires / heure
    private const PER_IP_LIMIT = 2;

    // Limite globale : 15 commentaires / heure (anti-spam site entier)
    private const GLOBAL_LIMIT = 15;

    public function store(Request $request, BlogPost $post): JsonResponse
    {
        abort_unless($post->published, 404);

        $request->validate([
            'author_name' => ['nullable', 'string', 'max:80'],
            'content' => ['required', 'string', 'min:3', 'max:1000'],
        ]);

        $ip = $request->ip();

        // Limite par IP
        $perIp = BlogPostComment::where('ip_address', $ip)
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($perIp >= self::PER_IP_LIMIT) {
            return response()->json([
                'error' => __('Vous avez atteint la limite de 2 commentaires par heure.'),
            ], 429);
        }

        // Limite globale
        $global = BlogPostComment::where('created_at', '>=', now()->subHour())->count();

        if ($global >= self::GLOBAL_LIMIT) {
            return response()->json([
                'error' => __('Trop de commentaires en ce moment. Réessayez dans quelques minutes.'),
            ], 429);
        }

        $comment = BlogPostComment::create([
            'post_id' => $post->id,
            'author_name' => $request->author_name ?: null,
            'content' => $request->content,
            'ip_address' => $ip,
        ]);

        return response()->json([
            'comment' => [
                'id' => $comment->id,
                'author_name' => $comment->author_name,
                'content' => $comment->content,
                'created_at' => __('À l\'instant'),
            ],
        ], 201);
    }

    /**
     * Supprime un commentaire : réponse JSON pour la page publique (fetch),
     * redirection avec message pour l'admin (Inertia).
     */
    public function destroy(Request $request, BlogPostComment $comment): JsonResponse|RedirectResponse
    {
        $comment->delete();

        if ($request->wantsJson()) {
            return response()->json(['deleted' => $comment->id]);
        }

        return back()->with('success', 'Commentaire supprimé.');
    }
}
