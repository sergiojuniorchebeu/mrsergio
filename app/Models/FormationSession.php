<?php

namespace App\Models;

use App\Http\Middleware\SetLocale;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

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

    protected static function booted(): void
    {
        static::saved(fn () => static::forgetLiveEvent());
        static::deleted(fn () => static::forgetLiveEvent());
    }

    protected $fillable = [
        'formation_id',
        'title',
        'starts_at',
        'ends_at',
        'meet_url',
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
            ->whereIn('status', ['nouvelle', 'confirmée', 'présente'])
            ->count();
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

    public function googleCalendarUrl(bool $includeMeet = false): string
    {
        $start = $this->starts_at->utc()->format('Ymd\THis\Z');
        $end = ($this->ends_at ?? $this->starts_at->copy()->addHours(2))->utc()->format('Ymd\THis\Z');
        $query = http_build_query([
            'action' => 'TEMPLATE',
            'text' => $this->formation->title,
            'dates' => $start.'/'.$end,
            'details' => 'Session gratuite avec Sergio Junior Chebeu'.($includeMeet && $this->meet_url ? "\n\nLien Google Meet : {$this->meet_url}" : ''),
            'location' => $includeMeet ? $this->meet_url : null,
        ]);

        return 'https://calendar.google.com/calendar/render?'.$query;
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
                        $query->whereIn('status', ['nouvelle', 'confirmée', 'présente']);
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
