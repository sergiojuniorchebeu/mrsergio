// resources/js/components/ui/hover-underline.tsx
// Soulignement de titre : au survol avec une souris,
// et à l'arrivée à l'écran sur les appareils tactiles (pas de survol au doigt).

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useSyncExternalStore } from 'react';

const TOUCH_QUERY = '(hover: none)';
const UNDERLINE_BASE = 'bg-[linear-gradient(currentColor,currentColor)] bg-left-bottom bg-no-repeat';

function subscribeToTouch(callback: () => void): () => void {
    const query = window.matchMedia(TOUCH_QUERY);
    query.addEventListener('change', callback);

    return () => query.removeEventListener('change', callback);
}

export function useIsTouchDevice(): boolean {
    return useSyncExternalStore(
        subscribeToTouch,
        () => window.matchMedia(TOUCH_QUERY).matches,
        () => false,
    );
}

export function HoverUnderline({ children }: { children: ReactNode }) {
    const isTouchDevice = useIsTouchDevice();
    const prefersReducedMotion = useReducedMotion();

    if (!isTouchDevice) {
        return (
            <span
                className={`${UNDERLINE_BASE} bg-[length:0%_1px] transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_1px]`}
            >
                {children}
            </span>
        );
    }

    return (
        <motion.span
            className={UNDERLINE_BASE}
            initial={{ backgroundSize: prefersReducedMotion ? '100% 1px' : '0% 1px' }}
            whileInView={{ backgroundSize: '100% 1px' }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
            {children}
        </motion.span>
    );
}
