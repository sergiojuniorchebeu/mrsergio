// resources/js/components/portofolio/cookie-notice.tsx
// Bandeau d'information cookies : le site n'utilise que des cookies nécessaires
// et de préférence (pas de pub ni de mesure d'audience), donc pas de consentement
// à recueillir, seulement à informer. Le choix « Compris » est mémorisé localement.

import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { easings } from '@/lib/utils';

const STORAGE_KEY = 'cookie-notice-dismissed';
const SHOW_DELAY_MS = 1200;

function isDismissed(): boolean {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return false;
    }
}

export function CookieNotice() {
    const { l } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isDismissed()) {
            return;
        }

        const timer = window.setTimeout(
            () => setIsVisible(true),
            SHOW_DELAY_MS,
        );

        return () => window.clearTimeout(timer);
    }, []);

    const dismiss = () => {
        setIsVisible(false);

        try {
            window.localStorage.setItem(STORAGE_KEY, '1');
        } catch {
            // Stockage indisponible (navigation privée) : le bandeau reviendra, sans gravité.
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    role="region"
                    aria-label={l(
                        'Information sur les cookies',
                        'About cookies',
                    )}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.45, ease: easings.smooth }}
                    className="theme-lock fixed inset-x-3 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+4.5rem)] z-[65] mx-auto max-w-md rounded-2xl border border-white/10 bg-[#171511] p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] md:inset-x-auto md:right-6 md:bottom-6 md:mx-0"
                >
                    <p className="font-display text-[14px] font-semibold text-white">
                        Cookies
                    </p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/60">
                        {l(
                            "Ce site n'utilise que des cookies nécessaires à son fonctionnement et à la mémorisation de votre thème et de votre langue. Aucune publicité, aucun suivi.",
                            'This site only uses cookies needed for it to work and to remember your theme and language. No ads, no tracking.',
                        )}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={dismiss}
                            className={buttonVariants({ size: 'sm' })}
                        >
                            {l('Compris', 'Got it')}
                        </button>
                        <Link
                            href="/cookies"
                            onClick={dismiss}
                            className={buttonVariants({
                                variant: 'dark',
                                size: 'sm',
                            })}
                        >
                            {l('En savoir plus', 'Learn more')}
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
