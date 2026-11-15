// resources/js/components/ui/hero-backdrop.tsx
// Fond du hero : grille de points et points qui s'allument autour de la souris.

import { useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const DOTS = 'radial-gradient(circle, currentColor 1px, transparent 1.4px)';

export function HeroBackdrop({ children, className }: { children: ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        const element = ref.current;

        if (!element || event.pointerType !== 'mouse') {
            return;
        }

        const rect = element.getBoundingClientRect();
        element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
        element.style.setProperty('--spot-opacity', '1');
    }, []);

    const handlePointerLeave = useCallback(() => {
        ref.current?.style.setProperty('--spot-opacity', '0');
    }, []);

    return (
        <div
            ref={ref}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className={cn('relative isolate overflow-hidden', className)}
            style={{ ['--spot-opacity' as string]: 0 }}
        >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[100svh] max-h-full">

                <div
                    className="absolute inset-0 text-slate-300/70 [mask-image:radial-gradient(ellipse_75%_65%_at_65%_35%,black_20%,transparent_75%)]"
                    style={{ backgroundImage: DOTS, backgroundSize: '22px 22px' }}
                />

                <div
                    className="absolute inset-0 text-teal-500 transition-opacity duration-500"
                    style={{
                        backgroundImage: DOTS,
                        backgroundSize: '22px 22px',
                        opacity: 'var(--spot-opacity)',
                        maskImage:
                            'radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), black, transparent 75%)',
                        WebkitMaskImage:
                            'radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), black, transparent 75%)',
                    }}
                />
            </div>

            {children}
        </div>
    );
}
