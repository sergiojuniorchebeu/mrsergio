<?php

namespace App\Notifications;

use App\Models\FormationEnrollment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FormationEnrollmentConfirmation extends Notification
{
    use Queueable;

    public function __construct(public FormationEnrollment $enrollment, public bool $reminder = false) {}

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
        $session = $this->enrollment->session;
        $mail = (new MailMessage)
            ->subject(($this->reminder ? 'Rappel : ' : '').$this->enrollment->formation->title)
            ->greeting('Bonjour '.$this->enrollment->name.',')
            ->line($this->reminder
                ? 'Votre session commence bientôt.'
                : 'Votre demande d’inscription a bien été reçue.');

        if ($session) {
            $mail->line('Session : '.$session->date_label.' à '.$session->time_label.'.');

            if ($session->meet_url && $this->enrollment->status !== 'en_attente') {
                $mail->line('Lien Google Meet : '.$session->meet_url);
            }

            $mail->action('Ajouter à Google Agenda', $session->googleCalendarUrl($this->enrollment->status !== 'en_attente'));
        }

        return $mail->line('À bientôt.');
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
