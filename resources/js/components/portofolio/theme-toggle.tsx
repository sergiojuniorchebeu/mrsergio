// resources/js/components/portofolio/theme-toggle.tsx
// Bascule clair / sombre : bouton soleil-lune (barre de navigation) et
// sélecteur Clair · Sombre · Auto (menu mobile). Transition en cercle depuis le bouton.

import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useId } from 'react';
import { flushSync } from 'react-dom';
import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance } from '@/hooks/use-appearance';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type ViewTransitionDocument = Document & {
    startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/**
 * Applique le thème avec un cercle qui s'étend depuis le point (x, y),
 * quand le navigateur gère les View Transitions et que le mouvement est autorisé.
 */
function useThemeSwitch() {
    const { appearance, resolvedAppearance, updateAppearance } =
        useAppearance();

    const switchTo = (mode: Appearance, origin?: { x: number; y: number }) => {
        const viewDocument = document as ViewTransitionDocument;
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        if (
            !origin ||
            prefersReducedMotion ||
            !viewDocument.startViewTransition
        ) {
            updateAppearance(mode);

            return;
        }

        const radius = Math.hypot(
            Math.max(origin.x, window.innerWidth - origin.x),
            Math.max(origin.y, window.innerHeight - origin.y),
        );
        const transition = viewDocument.startViewTransition(() => {
            flushSync(() => updateAppearance(mode));
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${origin.x}px ${origin.y}px)`,
                        `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
                    ],
                },
                {
                    duration: 520,
                    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
                    pseudoElement: '::view-transition-new(root)',
                },
            );
        });
    };

    return { appearance, resolvedAppearance, switchTo };
}

export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedAppearance, switchTo } = useThemeSwitch();
    const { l } = useTranslation();
    const isDark = resolvedAppearance === 'dark';

    return (
        <button
            type="button"
            onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                switchTo(isDark ? 'light' : 'dark', {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                });
            }}
            aria-label={
                isDark
                    ? l('Passer au thème clair', 'Switch to light theme')
                    : l('Passer au thème sombre', 'Switch to dark theme')
            }
            title={
                isDark
                    ? l('Thème clair', 'Light theme')
                    : l('Thème sombre', 'Dark theme')
            }
            className={cn(
                'relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900',
                className,
            )}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={isDark ? 'moon' : 'sun'}
                    initial={{ y: 18, rotate: -60, opacity: 0 }}
                    animate={{ y: 0, rotate: 0, opacity: 1 }}
                    exit={{ y: -18, rotate: 60, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                    className="flex"
                >
                    {isDark ? (
                        <Moon className="h-[17px] w-[17px]" />
                    ) : (
                        <Sun className="h-[17px] w-[17px]" />
                    )}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}

const THEME_OPTIONS: {
    value: Appearance;
    label: [french: string, english: string];
    icon: typeof Sun;
}[] = [
    { value: 'light', label: ['Clair', 'Light'], icon: Sun },
    { value: 'dark', label: ['Sombre', 'Dark'], icon: Moon },
    { value: 'system', label: ['Auto', 'Auto'], icon: Monitor },
];

/**
 * Sélecteur à trois positions, pensé pour un fond sombre (menu mobile, footer).
 */
export function ThemeSelect({ className }: { className?: string }) {
    const { appearance, switchTo } = useThemeSwitch();
    const { l } = useTranslation();
    const pillId = useId();

    return (
        <div
            role="radiogroup"
            aria-label={l('Thème', 'Theme')}
            className={cn(
                'flex w-fit gap-1 rounded-full border border-white/10 p-1',
                className,
            )}
        >
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
                const isActive = appearance === value;

                return (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => switchTo(value)}
                        className={cn(
                            'relative isolate flex items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-[12px] font-semibold transition-colors duration-200',
                            isActive
                                ? 'text-slate-950'
                                : 'text-white/55 hover:text-white',
                        )}
                    >
                        {isActive && (
                            <motion.span
                                layoutId={`theme-pill-${pillId}`}
                                transition={{
                                    type: 'spring',
                                    stiffness: 420,
                                    damping: 34,
                                }}
                                className="absolute inset-0 -z-10 rounded-full bg-white"
                            />
                        )}
                        <Icon className="h-3.5 w-3.5" />
                        {l(...label)}
                    </button>
                );
            })}
        </div>
    );
}
