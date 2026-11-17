<?php

namespace App\Http\Middleware;

use App\Models\ContactMessage;
use App\Models\FormationEnrollment;
use App\Models\FormationSession;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'adminCounts' => fn (): ?array => $this->adminCounts($request),
            'liveEvent' => fn (): ?array => $request->routeIs('admin.*') ? null : FormationSession::liveEvent(),
            'flash' => [
                'success' => fn (): ?string => $request->session()->get('success'),
                'error' => fn (): ?string => $request->session()->get('error'),
                'enrollment' => fn (): mixed => $request->session()->get('enrollment'),
            ],
        ];
    }

    /**
     * Pastilles de la barre latérale de l'admin (éléments à traiter).
     *
     * @return array{messages: int, enrollments: int}|null
     */
    private function adminCounts(Request $request): ?array
    {
        if (! $request->routeIs('admin.*') || ! $request->user()?->is_admin) {
            return null;
        }

        return [
            'messages' => ContactMessage::query()->unread()->count(),
            'enrollments' => FormationEnrollment::query()->toHandle()->count(),
        ];
    }
}
