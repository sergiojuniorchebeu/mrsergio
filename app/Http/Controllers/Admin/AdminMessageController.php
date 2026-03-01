<?php
// app/Http/Controllers/Admin/AdminMessageController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminMessageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Messages/Index', [
            'messages' => ContactMessage::latest()->get(),
        ]);
    }

    public function markRead(ContactMessage $message): RedirectResponse
    {
        $message->update(['read' => true]);

        return back()->with('success', 'Message marqué comme lu.');
    }

    public function destroy(ContactMessage $message): RedirectResponse
    {
        $message->delete();

        return back()->with('success', 'Message supprimé.');
    }
}