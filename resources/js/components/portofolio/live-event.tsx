// resources/js/components/portofolio/live-event.tsx
// Annonce de la prochaine session en direct, partagée par le serveur (prop « liveEvent ») :
// billet avec compte à rebours dans le hero (accueil) et point sur le lien « Formations ».
// L'état (à venir, bientôt, en direct) se recalcule seul ; tout disparaît à la fin.

import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { cn, easings } from '@/lib/utils';

export interface LiveEvent {
    id: number;
    title: string;
    url: string;
    starts_at: string;
    ends_at: string;
    is_full: boolean;
}

export type LiveEventPhase = 'upcoming' | 'soon' | 'live';

const MENU_CLOCK_INTERVAL_MS = 30_000;
const COUNTDOWN_INTERVAL_MS = 1_000;
const SOON_THRESHOLD_MS = 24 * 60 * 60 * 1000;

function useNow(intervalMs: number): number {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const interval = window.setInterval(
            () => setNow(Date.now()),
            intervalMs,
        );

        return () => window.clearInterval(interval);
    }, [intervalMs]);

    return now;
}

/**
 * Événement à annoncer et sa phase, ou null s'il n'y a rien (ou s'il est terminé).
 */
export function useLiveEvent(intervalMs = MENU_CLOCK_INTERVAL_MS): {
    event: LiveEvent;
    phase: LiveEventPhase;
    now: number;
} | null {
    const event = usePage<{ liveEvent?: LiveEvent | null }>().props.liveEvent;
    const now = useNow(intervalMs);

    if (!event) {
        return null;
    }

    const startsAt = Date.parse(event.starts_at);
    const endsAt = Date.parse(event.ends_at);

    if (now >= endsAt) {
        return null;
    }

    const phase: LiveEventPhase =
        now >= startsAt
            ? 'live'
            : startsAt - now <= SOON_THRESHOLD_MS
              ? 'soon'
              : 'upcoming';

    return { event, phase, now };
}

function LiveDot({ phase }: { phase: LiveEventPhase }) {
    const isLive = phase === 'live';

    return (
        <span className="relative flex h-2 w-2 shrink-0">
            {phase !== 'upcoming' && (
                <span
                    className={cn(
                        'absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 motion-reduce:hidden',
                        isLive ? 'bg-rose-400' : 'bg-teal-400',
                    )}
                />
            )}
            <span
                className={cn(
                    'relative inline-flex h-2 w-2 rounded-full',
                    isLive ? 'bg-rose-500' : 'bg-teal-500',
                )}
            />
        </span>
    );
}

// ─── Compte à rebours (chiffres qui défilent, façon daisyUI « countdown ») ───
function RollingDigits({ value }: { value: number }) {
    const prefersReducedMotion = useReducedMotion();
    const text = String(value).padStart(2, '0');

    return (
        <span className="relative inline-flex h-[1.15em] overflow-hidden tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={text}
                    initial={prefersReducedMotion ? false : { y: '100%' }}
                    animate={{ y: 0 }}
                    exit={prefersReducedMotion ? undefined : { y: '-100%' }}
                    transition={{ duration: 0.35, ease: easings.smooth }}
                    className="block leading-[1.15]"
                >
                    {text}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

function Countdown({ milliseconds }: { milliseconds: number }) {
    const { l } = useTranslation();
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const days = Math.floor(totalSeconds / 86_400);
    const units = [
        ...(days > 0 ? [{ value: days, label: l('j', 'd') }] : []),
        { value: Math.floor((totalSeconds % 86_400) / 3600), label: 'h' },
        { value: Math.floor((totalSeconds % 3600) / 60), label: 'min' },
        { value: totalSeconds % 60, label: 's' },
    ];

    return (
        <span
            className="flex items-end gap-1.5 font-mono text-slate-900"
            aria-hidden
        >
            {units.map((unit, index) => (
                <span key={unit.label} className="flex items-end gap-1.5">
                    {index > 0 && (
                        <span className="pb-px text-[13px] text-slate-300">
                            :
                        </span>
                    )}
                    <span className="flex items-baseline gap-0.5">
                        <span className="text-[20px] font-semibold">
                            <RollingDigits value={unit.value} />
                        </span>
                        <span className="text-[11px] text-slate-400">
                            {unit.label}
                        </span>
                    </span>
                </span>
            ))}
        </span>
    );
}

/**
 * Billet d'événement du hero : date façon calendrier, titre, compte à rebours, action.
 */
export function LiveEventCard({ className }: { className?: string }) {
    const live = useLiveEvent(COUNTDOWN_INTERVAL_MS);
    const { l, t, language } = useTranslation();

    if (!live) {
        return null;
    }

    const { event, phase, now } = live;
    const isLive = phase === 'live';
    const startsAt = new Date(event.starts_at);
    const locale = language === 'en' ? 'en-GB' : 'fr-FR';
    const time = startsAt.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
    });
    const fullDate = startsAt.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
    const action = isLive
        ? l('Voir la session', 'See the session')
        : event.is_full
          ? t('training.waitlist')
          : t('training.book_place');

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easings.smooth }}
            className={cn('w-full max-w-[26rem]', className)}
        >
            <Link
                href={event.url}
                aria-label={`${isLive ? l('En direct maintenant', 'Live now') : l('Session en direct gratuite', 'Free live session')} : ${event.title}, ${fullDate}, ${time}`}
                className={cn(
                    'group flex items-stretch overflow-hidden rounded-2xl border bg-white/90 shadow-[0_1px_2px_rgba(26,25,22,0.05)] backdrop-blur transition-[border-color,box-shadow] duration-300 hover:shadow-[0_14px_34px_-18px_rgba(19,135,112,0.45)] active:scale-[0.99]',
                    isLive
                        ? 'border-rose-200 hover:border-rose-300'
                        : 'border-slate-200/90 hover:border-teal-300',
                )}
            >
                {/* Talon : date façon page de calendrier */}
                <span
                    className={cn(
                        'flex w-[68px] shrink-0 flex-col items-center justify-center border-r border-dashed py-3 text-center',
                        isLive
                            ? 'border-rose-200 bg-rose-50/60'
                            : 'border-slate-200 bg-slate-50/80',
                    )}
                >
                    <span className="font-mono text-[10px] text-slate-500 uppercase">
                        {startsAt
                            .toLocaleDateString(locale, { weekday: 'short' })
                            .replace('.', '')}
                    </span>
                    <span className="font-display text-[26px] leading-none font-bold tracking-tight text-slate-900 tabular-nums">
                        {startsAt.getDate()}
                    </span>
                    <span className="mt-0.5 font-mono text-[10px] text-slate-500 uppercase">
                        {startsAt
                            .toLocaleDateString(locale, { month: 'short' })
                            .replace('.', '')}
                    </span>
                </span>

                {/* Corps du billet */}
                <span className="flex min-w-0 flex-1 flex-col gap-2 px-4 py-3">
                    <span className="flex items-center gap-2 font-mono text-[11px]">
                        <LiveDot phase={phase} />
                        <span
                            className={cn(
                                'font-semibold uppercase',
                                isLive ? 'text-rose-600' : 'text-teal-700',
                            )}
                        >
                            {isLive
                                ? l('En direct', 'Live now')
                                : l('Live gratuit', 'Free live')}
                        </span>
                        <span className="text-slate-400">· {time}</span>
                    </span>

                    <span className="truncate font-display text-[15px] leading-tight font-semibold text-slate-900">
                        {event.title}
                    </span>

                    <span className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                        {isLive ? (
                            <span className="text-[13px] text-slate-500">
                                {l(
                                    'La session a commencé',
                                    'The session has started',
                                )}
                            </span>
                        ) : (
                            <Countdown
                                milliseconds={Date.parse(event.starts_at) - now}
                            />
                        )}
                        <span
                            className={cn(
                                'font-display text-[13px] font-semibold underline-offset-4 group-hover:underline',
                                isLive ? 'text-rose-600' : 'text-teal-700',
                            )}
                        >
                            {action}
                        </span>
                    </span>
                </span>
            </Link>
        </motion.div>
    );
}

/**
 * Point posé sur le lien « Formations » du menu tant qu'une session est annoncée.
 */
export function LiveEventDot({ className }: { className?: string }) {
    const live = useLiveEvent();
    const { l } = useTranslation();

    if (!live) {
        return null;
    }

    return (
        <span
            className={cn('inline-flex', className)}
            title={
                live.phase === 'live'
                    ? l('Session en direct maintenant', 'Live session now')
                    : l('Session en direct à venir', 'Upcoming live session')
            }
        >
            <LiveDot phase={live.phase} />
            <span className="sr-only">
                {live.phase === 'live'
                    ? l('(en direct)', '(live)')
                    : l('(session à venir)', '(upcoming session)')}
            </span>
        </span>
    );
}
