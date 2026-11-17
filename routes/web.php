<?php

// routes/web.php

use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminFormationController;
use App\Http\Controllers\Admin\AdminFormationEnrollmentController;
use App\Http\Controllers\Admin\AdminFormationSessionController;
use App\Http\Controllers\Admin\AdminGoogleCalendarController;
use App\Http\Controllers\Admin\AdminMessageController;
use App\Http\Controllers\Admin\AdminProjectController;
use App\Http\Controllers\Admin\AdminTranslationController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\BlogCommentController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\BlogLikeController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CookiePolicyController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\FormationEnrollmentController;
use App\Http\Controllers\FormationEnrollmentLinkController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

// ── AUTH ─────────────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// ── PUBLIQUES ────────────────────────────────────────────────────────────────
Route::get('/', [HomeController::class,     'index'])->name('home');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/projects', [ProjectController::class,  'index'])->name('projects.index');
Route::get('/projects/{project:slug}', [ProjectController::class,  'show'])->name('projects.show');
Route::get('/blog', [BlogController::class,     'index'])->name('blog.index');
Route::get('/blog/{post:slug}', [BlogController::class,     'show'])->name('blog.show');
Route::post('/blog/{post:slug}/like', [BlogLikeController::class,    'toggle'])->name('blog.like');
Route::post('/blog/{post:slug}/comments', [BlogCommentController::class, 'store'])->name('blog.comments.store');
Route::get('/formations', [FormationController::class, 'index'])->name('formations.index');
Route::get('/formations/{formation:slug}', [FormationController::class, 'show'])->name('formations.show');
Route::post('/formations/{formation:slug}/enroll', [FormationEnrollmentController::class, 'store'])->name('formations.enroll');
Route::middleware(['signed', 'throttle:30,1'])->prefix('/formations/inscriptions/{enrollment}')->group(function () {
    Route::get('/annuler', [FormationEnrollmentLinkController::class, 'showCancel'])->name('formations.enrollments.cancel');
    Route::post('/annuler', [FormationEnrollmentLinkController::class, 'cancel']);
    Route::get('/rejoindre', [FormationEnrollmentLinkController::class, 'join'])->name('formations.enrollments.join');
});
Route::get('/contact', [ContactController::class,  'index'])->name('contact');
Route::post('/contact', [ContactController::class,  'send'])->name('contact.send');
Route::get('/cookies', CookiePolicyController::class)->name('cookies');

// ── ADMIN ────────────────────────────────────────────────────────────────────
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'is_admin'])
    ->group(function () {

        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Projets — resource + toggle séparé
        Route::resource('projects', AdminProjectController::class)->except(['show']);
        Route::patch('projects/{project}/toggle', [AdminProjectController::class, 'togglePublished'])->name('projects.toggle');

        // Blog — resource + toggle + commentaires
        Route::resource('blog', AdminBlogController::class)->except(['show']);
        Route::patch('blog/{blog}/toggle', [AdminBlogController::class, 'togglePublished'])->name('blog.toggle');
        Route::get('blog/{blog}/comments', [AdminBlogController::class, 'comments'])->name('blog.comments');

        // Formations — resource + toggle séparé
        Route::resource('formations', AdminFormationController::class)->except(['show']);
        Route::patch('formations/{formation}/toggle', [AdminFormationController::class, 'togglePublished'])->name('formations.toggle');
        Route::get('formations/{formation}/sessions', [AdminFormationSessionController::class, 'index'])->name('formations.sessions.index');
        Route::post('formations/{formation}/sessions', [AdminFormationSessionController::class, 'store'])->name('formations.sessions.store');
        Route::patch('formation-sessions/{session}', [AdminFormationSessionController::class, 'update'])->name('formations.sessions.update');
        Route::delete('formation-sessions/{session}', [AdminFormationSessionController::class, 'destroy'])->name('formations.sessions.destroy');
        Route::patch('translations/{type}/{id}', [AdminTranslationController::class, 'update'])
            ->whereIn('type', ['projects', 'blog', 'formations'])->whereNumber('id')->name('translations.update');
        Route::post('translations/{type}/{id}/regenerate', [AdminTranslationController::class, 'regenerate'])
            ->whereIn('type', ['projects', 'blog', 'formations'])->whereNumber('id')->name('translations.regenerate');
        Route::get('google-calendar/connect', [AdminGoogleCalendarController::class, 'connect'])->name('google-calendar.connect');
        Route::get('google-calendar/callback', [AdminGoogleCalendarController::class, 'callback'])->name('google-calendar.callback');
        Route::delete('google-calendar', [AdminGoogleCalendarController::class, 'disconnect'])->name('google-calendar.disconnect');
        Route::get('formation-enrollments', [AdminFormationEnrollmentController::class, 'index'])->name('formation-enrollments.index');
        Route::patch('formation-enrollments/{enrollment}', [AdminFormationEnrollmentController::class, 'update'])->name('formation-enrollments.update');
        Route::patch('formation-enrollments/{enrollment}/session', [AdminFormationEnrollmentController::class, 'assignSession'])->name('formation-enrollments.assign-session');
        Route::delete('formation-enrollments/{enrollment}', [AdminFormationEnrollmentController::class, 'destroy'])->name('formation-enrollments.destroy');

        // Messages
        Route::get('/messages', [AdminMessageController::class, 'index'])->name('messages.index');
        Route::patch('/messages/{message}/read', [AdminMessageController::class, 'markRead'])->name('messages.read');
        Route::delete('/messages/{message}', [AdminMessageController::class, 'destroy'])->name('messages.destroy');

        // Commentaires
        Route::delete('/blog-comments/{comment}', [BlogCommentController::class, 'destroy'])->name('blog-comments.destroy');
    });
