// resources/js/components/portofolio/availability-badge.tsx
// Badge « Disponible » du hero : pastille teal + message qui alterne
// (projets / heure locale), lien vers la page contact.

import { Link } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { easings } from '@/lib/utils';

const ROTATION_INTERVAL_MS = 3200;

export function AvailabilityBadge({ localTime }: { localTime: string | null }) {
    const prefersReducedMotion = useReducedMotion();
    const [messageIndex, setMessageIndex] = useState(0);
    const { l } = useTranslation();
    const messages = [
        l('pour de nouveaux projets', 'for new projects'),
        ...(localTime
            ? [l(`${localTime} au Cameroun`, `${localTime} in Cameroon`)]
            : []),
    ];
    const canRotate = messages.length > 1 && !prefersReducedMotion;

    useEffect(() => {
        if (!canRotate) {
            return;
        }

        const interval = setInterval(
            () => setMessageIndex((index) => index + 1),
            ROTATION_INTERVAL_MS,
        );

        return () => clearInterval(interval);
    }, [canRotate]);

    const message = messages[messageIndex % messages.length];

    return (
        <Link
            href="/contact"
            aria-label={l(
                'Disponible pour de nouveaux projets — me contacter',
                'Available for new projects — get in touch',
            )}
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-slate-200/90 bg-white/80 py-1 pr-4 pl-1 shadow-[0_1px_2px_rgba(26,25,22,0.05)] backdrop-blur transition-[border-color,box-shadow] duration-300 hover:border-teal-300 hover:shadow-[0_6px_20px_-8px_rgba(19,135,112,0.35)] active:scale-[0.98]"
        >
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 font-display text-[12px] font-semibold text-teal-700 ring-1 ring-teal-100 ring-inset">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-70 motion-reduce:hidden" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
                </span>
                {l('Disponible', 'Available')}
            </span>

            <motion.span
                layout
                transition={{ duration: 0.45, ease: easings.smooth }}
                className="relative flex h-5 items-center overflow-hidden font-display text-[13px] font-medium whitespace-nowrap text-slate-600"
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={message}
                        initial={{ y: '110%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '-110%', opacity: 0 }}
                        transition={{ duration: 0.45, ease: easings.smooth }}
                        className="block tabular-nums"
                    >
                        {message}
                    </motion.span>
                </AnimatePresence>
            </motion.span>
        </Link>
    );
}
