<?php

namespace App\Models;

use App\Http\Middleware\SetLocale;
use App\Jobs\SyncFormationSessionCalendar;
use App\Services\GoogleCalendar;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class FormationSession extends Model
{
    use HasFactory;

    /**
     * Clé de cache de l'événement annoncé sur tout le site (par langue).
     */
    public const LIVE_EVENT_CACHE_KEY = 'live_event';

    /**
     * Durée retenue quand une session n'a pas d'heure de fin.
     */
    public const DEFAULT_DURATION_HOURS = 2;

    private const LIVE_EVENT_CACHE_SECONDS = 60;

    private const ATTENDANCE_OPENS_MINUTES_BEFORE = 15;

    protected static function booted(): void
    {
        static::saved(function (FormationSession $session): void {
            static::forgetLiveEvent();

            if (! $session->wasRecentlyCreated && $session->wasChanged(['title', 'starts_at', 'ends_at'])) {
                static::syncCalendarLater($session->id);
            }
        });
        static::deleted(function (FormationSession $session): void {
            static::forgetLiveEvent();

            if ($session->google_event_id) {
                static::syncCalendarLater($session->id, $session->google_event_id);
            }
        });
    }

    /**
     * Met à jour l'événement Google Agenda (horaire, invités) en file d'attente, si un compte est relié.
     */
    public static function syncCalendarLater(int $sessionId, ?string $eventIdToDelete = null): void
    {
        if (app(GoogleCalendar::class)->isConnected()) {
            SyncFormationSessionCalendar::dispatch($sessionId, $eventIdToDelete);
        }
    }

    protected $fillable = [
        'formation_id',
        'title',
        'starts_at',
        'ends_at',
        'meet_url',
        'google_event_id',
        'capacity',
        'published',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'capacity' => 'integer',
            'published' => 'boolean',
        ];
    }

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(FormationEnrollment::class);
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('starts_at', '>=', now())->orderBy('starts_at');
    }

    public function getConfirmedEnrollmentsCountAttribute(): int
    {
        return $this->enrollments()
            ->holdingSeat()
            ->count();
    }

    /**
     * Statut d'une nouvelle inscription : une place si la session n'est pas complète, sinon la liste d'attente.
     * À appeler avec la session verrouillée (lockForUpdate) pour ne pas dépasser la capacité.
     */
    public function statusForNewEnrollment(): string
    {
        $isFull = $this->capacity !== null && $this->enrollments()->holdingSeat()->count() >= $this->capacity;

        return $isFull ? FormationEnrollment::STATUS_WAITLISTED : FormationEnrollment::STATUS_REGISTERED;
    }

    /**
     * Fait monter la liste d'attente (premiers arrivés d'abord) dans les places libres,
     * puis envoie à chaque personne promue son email avec le lien Meet.
     *
     * @return int Nombre de personnes promues.
     */
    public function promoteWaitlist(): int
    {
        if ($this->starts_at->isPast()) {
            return 0;
        }

        $promoted = DB::transaction(function (): Collection {
            $session = static::query()->lockForUpdate()->findOrFail($this->id);
            $waitlist = $session->enrollments()
                ->where('status', FormationEnrollment::STATUS_WAITLISTED)
                ->orderBy('created_at')
                ->orderBy('id');

            if ($session->capacity !== null) {
                $freeSeats = $session->capacity - $session->enrollments()->holdingSeat()->count();

                if ($freeSeats <= 0) {
                    return new Collection;
                }

                $waitlist->limit($freeSeats);
            }

            return $waitlist->get()->each(
                fn (FormationEnrollment $enrollment) => $enrollment->update(['status' => FormationEnrollment::STATUS_REGISTERED]),
            );
        });

        $promoted->each(fn (FormationEnrollment $enrollment) => $enrollment->sendConfirmation(promoted: true));

        return $promoted->count();
    }

    public function getIsFullAttribute(): bool
    {
        return $this->capacity !== null
            && $this->confirmed_enrollments_count >= $this->capacity;
    }

    public function getPlacesRemainingAttribute(): ?int
    {
        if ($this->capacity === null) {
            return null;
        }

        return max(0, $this->capacity - $this->confirmed_enrollments_count);
    }

    public function getDateLabelAttribute(): string
    {
        return $this->starts_at->locale(app()->getLocale())->translatedFormat('D d M Y');
    }

    public function getTimeLabelAttribute(): string
    {
        $start = $this->starts_at->format('H\hi');

        if (! $this->ends_at) {
            return $start;
        }

        return $start.' – '.$this->ends_at->format('H\hi');
    }

    public function getGoogleCalendarUrlAttribute(): string
    {
        return $this->googleCalendarUrl();
    }

    /**
     * Lien « Ajouter à Google Agenda ». Le lien personnel pour rejoindre (qui enregistre la présence)
     * n'est ajouté que pour une place confirmée, jamais le lien Meet brut.
     */
    public function googleCalendarUrl(?string $joinUrl = null): string
    {
        $includeJoinLink = $joinUrl !== null && $this->meet_url;
        $start = $this->starts_at->utc()->format('Ymd\THis\Z');
        $end = $this->endsAtOrDefault()->utc()->format('Ymd\THis\Z');
        $query = http_build_query([
            'action' => 'TEMPLATE',
            'text' => $this->formation->title,
            'dates' => $start.'/'.$end,
            'details' => 'Session gratuite avec Sergio Junior Chebeu'.($includeJoinLink ? "\n\nRejoindre la session : {$joinUrl}" : ''),
            'location' => $includeJoinLink ? $joinUrl : null,
        ]);

        return 'https://calendar.google.com/calendar/render?'.$query;
    }

    /**
     * La présence n'est comptée qu'à partir de 15 minutes avant le début : les antivirus de messagerie
     * qui ouvrent les liens à la réception du rappel (30 minutes avant) ne la faussent pas.
     */
    public function isOpenForAttendance(): bool
    {
        return now()->between($this->starts_at->copy()->subMinutes(self::ATTENDANCE_OPENS_MINUTES_BEFORE), $this->endsAtOrDefault());
    }

    public function endsAtOrDefault(): CarbonInterface
    {
        return $this->ends_at ?? $this->starts_at->copy()->addHours(self::DEFAULT_DURATION_HOURS);
    }

    /**
     * Prochaine session publique (en cours ou à venir) d'une formation gratuite publiée,
     * annoncée sur toutes les pages du site. Ne contient jamais le lien Meet.
     *
     * @return array{id: int, title: string, url: string, starts_at: string, ends_at: string, is_full: bool}|null
     */
    public static function liveEvent(): ?array
    {
        return Cache::remember(
            Formation::localizedCacheKey(self::LIVE_EVENT_CACHE_KEY),
            self::LIVE_EVENT_CACHE_SECONDS,
            function (): ?array {
                $session = static::query()
                    ->with('formation')
                    ->withCount(['enrollments as registered_count' => function (Builder $query): void {
                        $query->holdingSeat();
                    }])
                    ->whereHas('formation', fn (Builder $query) => $query->published()->where('is_free', true))
                    ->where('published', true)
                    ->where('starts_at', '>=', now()->subDay())
                    ->orderBy('starts_at')
                    ->limit(10)
                    ->get()
                    ->first(fn (FormationSession $session): bool => $session->endsAtOrDefault()->isFuture());

                if (! $session) {
                    return null;
                }

                return [
                    'id' => $session->id,
                    'title' => $session->title ?: $session->formation->translated('title'),
                    'url' => route('formations.show', $session->formation).'?session='.$session->id.'#inscription',
                    'starts_at' => $session->starts_at->toIso8601String(),
                    'ends_at' => $session->endsAtOrDefault()->toIso8601String(),
                    'is_full' => $session->capacity !== null && $session->registered_count >= $session->capacity,
                ];
            },
        );
    }

    public static function forgetLiveEvent(): void
    {
        foreach (SetLocale::SUPPORTED_LOCALES as $locale) {
            Cache::forget(self::LIVE_EVENT_CACHE_KEY.'.'.$locale);
        }
    }
}
