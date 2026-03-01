<?php
// routes/web.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminProjectController;
use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminFormationController;
use App\Http\Controllers\Admin\AdminMessageController;

// ── AUTH ─────────────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login',  [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// ── PUBLIQUES ────────────────────────────────────────────────────────────────
Route::get('/',                            [HomeController::class,     'index'])->name('home');
Route::get('/projects',                    [ProjectController::class,  'index'])->name('projects.index');
Route::get('/projects/{project:slug}',     [ProjectController::class,  'show'])->name('projects.show');
Route::get('/blog',                        [BlogController::class,     'index'])->name('blog.index');
Route::get('/blog/{post:slug}',            [BlogController::class,     'show'])->name('blog.show');
Route::get('/formations',                  [FormationController::class,'index'])->name('formations.index');
Route::get('/formations/{formation:slug}', [FormationController::class,'show'])->name('formations.show');
Route::get('/contact',                     [ContactController::class,  'index'])->name('contact');
Route::post('/contact',                    [ContactController::class,  'send'])->name('contact.send');

// ── ADMIN ────────────────────────────────────────────────────────────────────
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'is_admin'])
    ->group(function () {

        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Projets — resource + toggle séparé
        Route::resource('projects', AdminProjectController::class)->except(['show']);
        Route::patch('projects/{project}/toggle', [AdminProjectController::class, 'togglePublished'])->name('projects.toggle');

        // Blog — resource + toggle séparé
        Route::resource('blog', AdminBlogController::class)->except(['show']);
        Route::patch('blog/{blog}/toggle', [AdminBlogController::class, 'togglePublished'])->name('blog.toggle');

        // Formations — resource + toggle séparé
        Route::resource('formations', AdminFormationController::class)->except(['show']);
        Route::patch('formations/{formation}/toggle', [AdminFormationController::class, 'togglePublished'])->name('formations.toggle');

        // Messages
        Route::get('/messages',                  [AdminMessageController::class, 'index'])->name('messages.index');
        Route::patch('/messages/{message}/read', [AdminMessageController::class, 'markRead'])->name('messages.read');
        Route::delete('/messages/{message}',     [AdminMessageController::class, 'destroy'])->name('messages.destroy');
    });