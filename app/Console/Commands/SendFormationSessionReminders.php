<?php

namespace App\Console\Commands;

use App\Models\FormationEnrollment;
use App\Notifications\FormationEnrollmentConfirmation;
use Illuminate\Console\Command;
use Illuminate\Notifications\AnonymousNotifiable;
use Throwable;

class SendFormationSessionReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'formations:send-session-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders before upcoming formation sessions';

    /**
     * Les inscrits reçoivent le rappel au plus tôt 35 minutes avant le début ;
     * la commande tourne toutes les 5 minutes, aucune session ne passe entre les mailles.
     */
    private const REMINDER_WINDOW_MINUTES = 35;

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $enrollments = FormationEnrollment::with(['formation', 'session'])
            ->holdingSeat()
            ->whereNull('reminder_sent_at')
            ->whereHas('session', function ($query): void {
                $query->whereBetween('starts_at', [now(), now()->addMinutes(self::REMINDER_WINDOW_MINUTES)]);
            })
            ->get();

        foreach ($enrollments as $enrollment) {
            try {
                (new AnonymousNotifiable)
                    ->route('mail', $enrollment->email)
                    ->notify(new FormationEnrollmentConfirmation($enrollment, true));
                $enrollment->update(['reminder_sent_at' => now()]);
            } catch (Throwable $exception) {
                report($exception);
            }
        }

        $this->info("{$enrollments->count()} reminder(s) sent.");

        return self::SUCCESS;
    }
}
