<?php

namespace App\Models;

use App\Notifications\FormationEnrollmentConfirmation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Throwable;

class FormationEnrollment extends Model
{
    /**
     * Inscrit à une session (place réservée), ou nouvelle demande pour une formation sans session.
     */
    public const STATUS_REGISTERED = 'inscrite';

    /**
     * Session complète : en attente d'une place libre.
     */
    public const STATUS_WAITLISTED = 'en_attente';

    /**
     * Demande sans session (formation payante) à laquelle l'admin a répondu.
     */
    public const STATUS_HANDLED = 'traitée';

    public const STATUS_CANCELLED = 'annulée';

    public const STATUSES = [
        self::STATUS_REGISTERED,
        self::STATUS_WAITLISTED,
        self::STATUS_HANDLED,
        self::STATUS_CANCELLED,
    ];

    protected static function booted(): void
    {
        static::saved(function (FormationEnrollment $enrollment): void {
            FormationSession::forgetLiveEvent();

            if ($enrollment->formation_session_id && ($enrollment->wasRecentlyCreated || $enrollment->wasChanged(['status', 'email']))) {
                FormationSession::syncCalendarLater($enrollment->formation_session_id);
            }
        });
        static::deleted(function (FormationEnrollment $enrollment): void {
            FormationSession::forgetLiveEvent();

            if ($enrollment->formation_session_id) {
                FormationSession::syncCalendarLater($enrollment->formation_session_id);
            }
        });
    }

    protected $attributes = [
        'status' => self::STATUS_REGISTERED,
    ];

    protected $fillable = [
        'formation_id',
        'formation_session_id',
        'name',
        'email',
        'phone',
        'message',
        'status',
        'confirmation_sent_at',
        'reminder_sent_at',
        'attended_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'confirmation_sent_at' => 'datetime',
            'reminder_sent_at' => 'datetime',
            'attended_at' => 'datetime',
        ];
    }

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(FormationSession::class, 'formation_session_id');
    }

    /**
     * Inscriptions qui occupent une place dans leur session.
     */
    public function scopeHoldingSeat(Builder $query): void
    {
        $query->where('status', self::STATUS_REGISTERED);
    }

    /**
     * Demandes sans session (formations payantes) auxquelles l'admin doit encore répondre.
     */
    public function scopeToHandle(Builder $query): void
    {
        $query->whereNull('formation_session_id')->where('status', self::STATUS_REGISTERED);
    }

    /**
     * Lien personnel (signé) envoyé par email pour annuler sa place.
     */
    public function cancelUrl(): string
    {
        return URL::signedRoute('formations.enrollments.cancel', $this);
    }

    /**
     * Lien personnel (signé) pour rejoindre le live : il enregistre la présence puis ouvre Google Meet.
     */
    public function joinUrl(): string
    {
        return URL::signedRoute('formations.enrollments.join', $this);
    }

    /**
     * Une place (ou une position en liste d'attente) peut être libérée tant que la session n'a pas commencé.
     */
    public function canBeCancelled(): bool
    {
        return $this->session !== null
            && in_array($this->status, [self::STATUS_REGISTERED, self::STATUS_WAITLISTED], true)
            && $this->session->starts_at->isFuture();
    }

    /**
     * Annule l'inscription et donne la place libérée au premier de la liste d'attente.
     */
    public function cancel(): void
    {
        $this->update(['status' => self::STATUS_CANCELLED]);
        $this->session?->promoteWaitlist();
    }

    /**
     * Un email qui ne part pas ne doit pas faire échouer l'inscription déjà enregistrée.
     */
    public function sendConfirmation(bool $promoted = false): void
    {
        $this->loadMissing(['formation', 'session']);

        try {
            Notification::route('mail', $this->email)
                ->notify(new FormationEnrollmentConfirmation($this, promoted: $promoted));
            $this->update(['confirmation_sent_at' => now()]);
        } catch (Throwable $exception) {
            report($exception);
        }
    }
}
