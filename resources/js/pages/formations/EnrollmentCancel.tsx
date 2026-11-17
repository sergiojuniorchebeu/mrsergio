// resources/js/pages/formations/EnrollmentCancel.tsx
// Lien « Libérer ma place » reçu par email : confirmation explicite avant d'annuler,
// la place revient automatiquement au premier de la liste d'attente.

import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { HeroBackdrop } from '@/components/ui/hero-backdrop';
import { Reveal } from '@/components/ui/reveal';
import MainLayout from '@/layouts/MainLayout';
import { useTranslation } from '@/lib/i18n';

interface EnrollmentCancelProps {
    enrollment: { name: string; status: string; can_cancel: boolean };
    formation: { title: string; url: string };
    session: { date_label: string; time_label: string } | null;
    cancel_url: string;
}

export default function EnrollmentCancel({
    enrollment,
    formation,
    session,
    cancel_url,
}: EnrollmentCancelProps) {
    const { l } = useTranslation();
    const [processing, setProcessing] = useState(false);
    const isCancelled = enrollment.status === 'annulée';
    const isWaitlisted = enrollment.status === 'en_attente';

    function cancel() {
        router.post(
            cancel_url,
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    }

    const heading = isCancelled
        ? l('Votre place est libérée', 'Your seat has been released')
        : enrollment.can_cancel
          ? isWaitlisted
              ? l("Quitter la liste d'attente ?", 'Leave the waiting list?')
              : l('Libérer votre place ?', 'Release your seat?')
          : l(
                'Cette inscription ne peut plus être annulée',
                'This registration can no longer be cancelled',
            );

    const description = isCancelled
        ? l(
              "Merci de l'avoir signalé : elle est proposée à la première personne en liste d'attente. Vous pouvez vous réinscrire tant qu'il reste des places.",
              'Thanks for letting me know: it goes to the first person on the waiting list. You can sign up again while seats remain.',
          )
        : enrollment.can_cancel
          ? l(
                "Si vous ne pouvez plus venir, libérez votre place : elle sera aussitôt donnée à une personne en liste d'attente.",
                'If you can no longer attend, release your seat: it will immediately go to someone on the waiting list.',
            )
          : l(
                'La session a déjà commencé ou est terminée.',
                'The session has already started or ended.',
            );

    return (
        <MainLayout>
            <Head title={`${heading} — ${formation.title}`} />

            <HeroBackdrop>
                <div className="container-main pt-[110px] pb-20 sm:pt-[130px] sm:pb-28">
                    <p className="mb-8 font-mono text-[12px] text-slate-500">
                        {l('Inscription', 'Registration')}
                    </p>
                    <Reveal>
                        <h1 className="max-w-2xl font-display text-[36px] leading-[1.05] font-bold tracking-[-0.04em] text-ink-primary sm:text-5xl">
                            {heading}
                        </h1>
                        <p className="mt-6 max-w-xl text-[18px] leading-[1.6] text-slate-600">
                            {description}
                        </p>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <div className="mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-5">
                            <p className="font-mono text-[11px] text-slate-500 uppercase">
                                {enrollment.name}
                            </p>
                            <p className="mt-1 font-display text-[18px] font-semibold text-slate-900">
                                {formation.title}
                            </p>
                            {session && (
                                <p className="mt-1 font-mono text-[13px] text-teal-700">
                                    {session.date_label} · {session.time_label}
                                </p>
                            )}
                        </div>
                    </Reveal>

                    <Reveal delay={0.25}>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {enrollment.can_cancel && !isCancelled && (
                                <button
                                    type="button"
                                    onClick={cancel}
                                    disabled={processing}
                                    className={buttonVariants()}
                                >
                                    {isWaitlisted
                                        ? l(
                                              "Quitter la liste d'attente",
                                              'Leave the waiting list',
                                          )
                                        : l(
                                              'Oui, libérer ma place',
                                              'Yes, release my seat',
                                          )}
                                </button>
                            )}
                            <Link
                                href={formation.url}
                                className={buttonVariants({
                                    variant: 'outline',
                                })}
                            >
                                {isCancelled || !enrollment.can_cancel
                                    ? l('Voir la formation', 'See the course')
                                    : l('Je garde ma place', 'Keep my seat')}
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </HeroBackdrop>
        </MainLayout>
    );
}
