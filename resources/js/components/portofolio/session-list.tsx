// resources/js/components/portofolio/session-list.tsx
// Sessions de formation en direct : bloc date « calendrier », jauge de places,
// lignes d'agenda (liste des formations), sélecteur en cartes et billet de confirmation.

import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { cn, easings } from '@/lib/utils';
import type { FormationSession } from '@/types';

function useDateParts(isoDate: string) {
    const { language } = useTranslation();
    const date = new Date(isoDate);
    const locale = language === 'en' ? 'en-GB' : 'fr-FR';

    return {
        weekday: date
            .toLocaleDateString(locale, { weekday: 'short' })
            .replace('.', ''),
        day: date.toLocaleDateString(locale, { day: '2-digit' }),
        month: date
            .toLocaleDateString(locale, { month: 'short' })
            .replace('.', ''),
    };
}

/**
 * Petite page de calendrier : jour de la semaine, numéro, mois.
 */
export function SessionDate({
    startsAt,
    isMuted = false,
}: {
    startsAt: string;
    isMuted?: boolean;
}) {
    const { weekday, day, month } = useDateParts(startsAt);

    return (
        <span
            className={cn(
                'flex w-[60px] shrink-0 flex-col items-center overflow-hidden rounded-xl border bg-white text-center',
                isMuted ? 'border-slate-200 opacity-60' : 'border-slate-200',
            )}
        >
            <span className="w-full bg-slate-900 py-0.5 font-mono text-[10px] text-white capitalize">
                {weekday}
            </span>
            <span className="pt-1 font-display text-[24px] leading-none font-bold tracking-tight text-slate-900 tabular-nums">
                {day}
            </span>
            <span className="pb-1.5 font-mono text-[11px] text-slate-500 capitalize">
                {month}
            </span>
        </span>
    );
}

/**
 * Jauge de places : remplissage proportionnel + libellé court.
 */
export function SessionAvailability({
    session,
    label: customLabel,
    className,
}: {
    session: Pick<
        FormationSession,
        'capacity' | 'registered_count' | 'is_full' | 'places_remaining'
    >;
    /** Remplace le libellé par défaut (ex. « 3 / 10 inscrits » côté admin). */
    label?: string;
    className?: string;
}) {
    const { t } = useTranslation();
    const capacity = session.capacity ?? null;
    const fill = capacity
        ? Math.min(1, session.registered_count / capacity)
        : 0;
    const label =
        customLabel ??
        (session.is_full
            ? t('training.full')
            : session.places_remaining === null
              ? t('training.available')
              : `${session.places_remaining} ${session.places_remaining > 1 ? t('training.places_available') : t('training.place_available')}`);

    return (
        <span className={cn('flex flex-col gap-1.5', className)}>
            <span
                className={cn(
                    'font-mono text-[12px]',
                    session.is_full ? 'text-rose-600' : 'text-slate-500',
                )}
            >
                {label}
            </span>
            {capacity !== null && (
                <span className="relative h-1 w-full max-w-[140px] overflow-hidden rounded-full bg-slate-200">
                    <motion.span
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: fill }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: easings.smooth }}
                        className={cn(
                            'absolute inset-0 origin-left rounded-full',
                            session.is_full ? 'bg-rose-500' : 'bg-teal-500',
                        )}
                    />
                </span>
            )}
        </span>
    );
}

/**
 * Ligne d'agenda (page Formations) : date, titre, horaire, places, actions.
 */
export function SessionRow({
    session,
    index,
}: {
    session: FormationSession;
    index: number;
}) {
    const { t } = useTranslation();
    const formation = session.formation;

    return (
        <motion.li
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                duration: 0.6,
                delay: index * 0.06,
                ease: easings.smooth,
            }}
            className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-4 border-t border-slate-200 py-6 first:border-t-0 sm:grid-cols-[auto_minmax(0,1fr)_170px_auto] sm:gap-x-8"
        >
            <SessionDate startsAt={session.starts_at} />

            <div className="min-w-0">
                <p className="font-mono text-[12px] text-teal-600">
                    {session.time_label}
                </p>
                <h3 className="mt-1 truncate font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                    {session.title ||
                        formation?.title ||
                        t('training.live_session')}
                </h3>
                {formation && session.title && (
                    <p className="mt-0.5 truncate text-[15px] text-slate-500">
                        {formation.title}
                    </p>
                )}
            </div>

            <SessionAvailability
                session={session}
                className="col-span-2 sm:col-span-1"
            />

            <div className="col-span-2 flex flex-wrap gap-2 sm:col-span-1 sm:justify-end">
                {formation && (
                    <Link
                        href={`/formations/${formation.slug}?session=${session.id}#inscription`}
                        className={buttonVariants({
                            size: 'sm',
                            variant: session.is_full ? 'outline' : 'default',
                        })}
                    >
                        {session.is_full
                            ? t('training.waitlist')
                            : t('training.book_place')}
                    </Link>
                )}
                <a
                    href={session.calendar_url}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                >
                    {t('training.google_calendar')}
                </a>
            </div>
        </motion.li>
    );
}

/**
 * Choix de la session dans le formulaire d'inscription : cartes sélectionnables.
 */
export function SessionPicker({
    sessions,
    value,
    onChange,
    error,
}: {
    sessions: FormationSession[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
}) {
    const { t } = useTranslation();
    const options = [
        ...sessions.map((session) => ({ id: String(session.id), session })),
        { id: '', session: null },
    ];

    return (
        <fieldset className="sm:col-span-2">
            <legend className="mb-2 font-display text-[13px] font-semibold text-slate-700">
                {t('training.choose_session')}
            </legend>
            <div role="radiogroup" className="grid gap-2">
                {options.map(({ id, session }) => {
                    const isSelected = value === id;

                    return (
                        <button
                            key={id || 'later'}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => onChange(id)}
                            className={cn(
                                'relative flex items-center gap-4 rounded-xl border p-3 text-left transition-[border-color,background-color,box-shadow] duration-200',
                                isSelected
                                    ? 'border-teal-500 bg-teal-50/60 ring-4 ring-teal-500/10'
                                    : 'border-slate-200 hover:border-slate-300',
                            )}
                        >
                            {session ? (
                                <>
                                    <SessionDate startsAt={session.starts_at} />
                                    <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                                        <span className="truncate font-display text-[15px] font-semibold text-slate-900">
                                            {session.title ||
                                                t('training.live_session')}
                                        </span>
                                        <span className="font-mono text-[12px] text-teal-600">
                                            {session.time_label}
                                        </span>
                                        <SessionAvailability
                                            session={session}
                                        />
                                    </span>
                                </>
                            ) : (
                                <span className="flex min-h-[44px] flex-1 items-center text-[15px] text-slate-600">
                                    {t('training.next_dates')}
                                </span>
                            )}
                            <span
                                aria-hidden
                                className={cn(
                                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                    isSelected
                                        ? 'border-teal-600'
                                        : 'border-slate-300',
                                )}
                            >
                                {isSelected && (
                                    <motion.span
                                        layoutId="session-picker-dot"
                                        className="h-2.5 w-2.5 rounded-full bg-teal-600"
                                    />
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>
            {error && (
                <span className="mt-1.5 block text-[13px] text-rose-600">
                    {error}
                </span>
            )}
        </fieldset>
    );
}

export interface EnrollmentFlash {
    status: string;
    date_label?: string | null;
    time_label?: string | null;
    meet_url?: string | null;
    calendar_url?: string | null;
}

/**
 * Billet de confirmation, avec talon détachable : date, horaire et liens utiles.
 */
export function EnrollmentTicket({
    enrollment,
    title,
}: {
    enrollment: EnrollmentFlash;
    title: string;
}) {
    const { t } = useTranslation();
    const isWaitlisted = enrollment.status === 'en_attente';

    return (
        <motion.div
            initial={{ opacity: 0, y: 14, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easings.smooth }}
            className="w-full overflow-hidden rounded-xl border border-slate-200"
        >
            <div className="flex items-center justify-between gap-4 px-4 py-4">
                <div className="min-w-0">
                    <p className="font-mono text-[11px] text-slate-500">
                        {t('training.live_session')}
                    </p>
                    <p className="mt-1 truncate font-display text-[16px] font-bold text-slate-900">
                        {title}
                    </p>
                    <p className="mt-1 font-mono text-[12px] text-teal-600">
                        {enrollment.date_label} · {enrollment.time_label}
                    </p>
                </div>
                <span
                    className={cn(
                        'shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px]',
                        isWaitlisted
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-teal-50 text-teal-700',
                    )}
                >
                    {isWaitlisted
                        ? t('training.waitlist')
                        : t('training.confirmed')}
                </span>
            </div>
            <div
                aria-hidden
                className="relative h-0 border-t border-dashed border-slate-300"
            >
                <span className="absolute -top-2 -left-2 h-4 w-4 rounded-full border border-slate-200 bg-white" />
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full border border-slate-200 bg-white" />
            </div>
            <div className="flex flex-wrap gap-2 px-4 py-3">
                {enrollment.meet_url && !isWaitlisted && (
                    <a
                        href={enrollment.meet_url}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({ size: 'sm' })}
                    >
                        {t('training.join_meet')}
                    </a>
                )}
                {enrollment.calendar_url && (
                    <a
                        href={enrollment.calendar_url}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                        })}
                    >
                        {t('training.add_calendar')}
                    </a>
                )}
            </div>
        </motion.div>
    );
}
