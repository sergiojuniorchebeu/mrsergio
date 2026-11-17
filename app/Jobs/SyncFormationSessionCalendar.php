<?php

namespace App\Jobs;

use App\Models\FormationEnrollment;
use App\Models\FormationSession;
use App\Services\GoogleCalendar;
use Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

/**
 * Aligne l'événement Google Agenda d'une session sur la base : horaire et invités
 * (uniquement les inscrits avec une place). Recalcule toute la liste à chaque passage,
 * donc plusieurs inscriptions rapprochées donnent un seul appel à jour.
 */
class SyncFormationSessionCalendar implements ShouldBeUniqueUntilProcessing, ShouldQueue
{
    use Queueable;

    public int $tries = 4;

    /**
     * @var array<int, int>
     */
    public array $backoff = [60, 300, 900];

    /**
     * @param  string|null  $eventIdToDelete  Événement à supprimer quand la session n'existe plus.
     */
    public function __construct(public int $sessionId, public ?string $eventIdToDelete = null) {}

    public function uniqueId(): string
    {
        return (string) $this->sessionId;
    }

    public function handle(GoogleCalendar $calendar): void
    {
        if (! $calendar->isConnected()) {
            return;
        }

        $session = FormationSession::with('formation')->find($this->sessionId);

        if (! $session) {
            if ($this->eventIdToDelete) {
                $calendar->deleteEvent($this->eventIdToDelete);
            }

            return;
        }

        if (! $session->google_event_id) {
            if (filled($session->meet_url)) {
                return;
            }

            $event = $calendar->createEvent($session);
            $session->forceFill(['google_event_id' => $event['id'], 'meet_url' => $event['meet_url']])->saveQuietly();
        }

        $guestEmails = $session->enrollments()
            ->where('status', FormationEnrollment::STATUS_REGISTERED)
            ->pluck('email')
            ->map(fn (string $email): string => mb_strtolower(trim($email)))
            ->all();

        $meetUrl = $calendar->syncEvent($session, $guestEmails);

        if ($meetUrl && $meetUrl !== $session->meet_url) {
            $session->forceFill(['meet_url' => $meetUrl])->saveQuietly();
        }
    }
}
