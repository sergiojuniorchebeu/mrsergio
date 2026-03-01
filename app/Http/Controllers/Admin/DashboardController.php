<?php
// app/Http/Controllers/Admin/DashboardController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\BlogPost;
use App\Models\Formation;
use App\Models\ContactMessage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'projects'        => Project::count(),
                'projects_pub'    => Project::where('published', true)->count(),
                'blog_posts'      => BlogPost::count(),
                'blog_posts_pub'  => BlogPost::where('published', true)->count(),
                'formations'      => Formation::count(),
                'formations_pub'  => Formation::where('published', true)->count(),
                'messages'        => ContactMessage::count(),
                'messages_unread' => ContactMessage::unread()->count(),
            ],
            'recent_messages' => ContactMessage::latest()
                ->take(5)
                ->get(['id', 'name', 'email', 'subject', 'read', 'created_at']),
        ]);
    }
}