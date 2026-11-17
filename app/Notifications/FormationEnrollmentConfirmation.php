<?php

namespace App\Notifications;

use App\Models\FormationEnrollment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Envoyé en file d'attente : l'inscription répond tout de suite, même avec des centaines d'emails à partir
 * (promotion de la liste d'attente, rappels). Les liens et le statut sont relus au moment de l'envoi.
 */
class FormationEnrollmentConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Un serveur SMTP indisponible est réessayé après 1, 5 puis 15 minutes.
     */
    public int $tries = 4;

    /**
     * @var array<int, int>
     */
    public array $backoff = [60, 300, 900];

    public function __construct(
        public FormationEnrollment $enrollment,
        public bool $reminder = false,
        public bool $promoted = false,
    ) {
        $this->afterCommit();
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $content = $this->content();

        return (new MailMessage)
            ->subject($content['subject'])
            ->view(['mail.formation-enrollment', 'mail.formation-enrollment-text'], $content);
    }

    /**
     * Textes et liens de l'email selon la situation : demande reçue, place réservée,
     * liste d'attente, place libérée ou rappel juste avant le live.
     *
     * @return array<string, mixed>
     */
    public function content(): array
    {
        $enrollment = $this->enrollment;
        $session = $enrollment->session;
        $formationTitle = $enrollment->formation->title;
        $hasSeat = $session && $enrollment->status === FormationEnrollment::STATUS_REGISTERED;
        $joinUrl = $hasSeat && $session->meet_url ? $enrollment->joinUrl() : null;

        $kind = match (true) {
            $session === null => 'received',
            $this->reminder => 'reminder',
            $enrollment->status === FormationEnrollment::STATUS_WAITLISTED => 'waitlisted',
            $this->promoted => 'promoted',
            default => 'registered',
        };

        [$subject, $eyebrow, $heading, $intro] = match ($kind) {
            'received' => [
                "Demande reçue : {$formationTitle}",
                'Demande reçue',
                'Merci, votre demande est bien arrivée',
                "Je reviens vers vous très vite avec toutes les informations sur la formation « {$formationTitle} ».",
            ],
            'reminder' => [
                "C'est bientôt : {$formationTitle}",
                'Rappel',
                'Le live commence bientôt',
                $joinUrl
                    ? 'Rejoignez la session avec le bouton ci-dessous : votre présence est enregistrée automatiquement.'
                    : 'Le lien de connexion vous sera communiqué juste avant le début.',
            ],
            'waitlisted' => [
                "Liste d'attente : {$formationTitle}",
                "Liste d'attente",
                "Vous êtes sur liste d'attente",
                "La session est complète pour le moment. Dès qu'une place se libère, elle vous est attribuée automatiquement et vous recevez le lien de connexion par email.",
            ],
            'promoted' => [
                "Votre place est confirmée : {$formationTitle}",
                'Place libérée',
                "Bonne nouvelle, une place s'est libérée",
                "Vous quittez la liste d'attente : votre place au live « {$formationTitle} » est réservée.",
            ],
            default => [
                "Votre place est réservée : {$formationTitle}",
                'Inscription confirmée',
                'Votre place est réservée',
                "Merci pour votre inscription au live gratuit « {$formationTitle} ». Voici l'essentiel à garder.",
            ],
        };

        $primaryAction = match (true) {
            $kind === 'reminder' && $joinUrl !== null => ['label' => 'Rejoindre le live', 'url' => $joinUrl],
            $session !== null && $kind !== 'reminder' => ['label' => 'Ajouter à mon agenda', 'url' => $session->googleCalendarUrl($joinUrl)],
            $session === null => ['label' => 'Voir la formation', 'url' => route('formations.show', $enrollment->formation)],
            default => null,
        };

        return [
            'kind' => $kind,
            'subject' => $subject,
            'eyebrow' => $eyebrow,
            'heading' => $heading,
            'greeting' => "Bonjour {$enrollment->name},",
            'intro' => $intro,
            'formationTitle' => $formationTitle,
            'sessionDate' => $session ? ucfirst($session->date_label) : null,
            'sessionTime' => $session?->time_label,
            'primaryAction' => $primaryAction,
            'joinUrl' => $kind === 'reminder' ? null : $joinUrl,
            'accountHint' => $joinUrl && $session->google_event_id
                ? "Pour entrer sans attendre, connectez-vous à Google avec l'adresse {$enrollment->email} : c'est elle qui figure sur la liste des invités."
                : null,
            'cancelUrl' => $enrollment->canBeCancelled() ? $enrollment->cancelUrl() : null,
            'siteUrl' => route('home'),
            'siteHost' => parse_url(route('home'), PHP_URL_HOST),
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [];
    }
}
