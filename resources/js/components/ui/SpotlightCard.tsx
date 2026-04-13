// resources/js/components/ui/SpotlightCard.tsx
// Cursor-reactive teal glow border — trending 2025-2026 (Aceternity / react-bits pattern)
// Pure DOM manipulation — zero re-renders on mouse move.

import { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
    children: React.ReactNode;
    className?: string;
}

// Inactive border color — custom slate-200 from palette (#e2e0da)
const BORDER_INACTIVE = 'rgb(226, 224, 218)';

export function SpotlightCard({ children, className }: SpotlightCardProps) {
    const outerRef = useRef<HTMLDivElement>(null);
    const glowRef  = useRef<HTMLDivElement>(null);

    const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const el = outerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.background = `radial-gradient(380px circle at ${x}px ${y}px, rgba(26,163,137,0.28) 0%, ${BORDER_INACTIVE} 55%)`;
        if (glowRef.current) {
            glowRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(26,163,137,0.06), transparent 68%)`;
            glowRef.current.style.opacity = '1';
        }
    }, []);

    const onLeave = useCallback(() => {
        if (outerRef.current) {
            outerRef.current.style.background = BORDER_INACTIVE;
        }
        if (glowRef.current) {
            glowRef.current.style.opacity = '0';
        }
    }, []);

    return (
        <div
            ref={outerRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={cn(
                'group relative rounded-[20px]',
                'transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]',
                'hover:-translate-y-1.5 hover:shadow-[0_22px_55px_-12px_rgba(0,0,0,0.1)]',
                className,
            )}
            style={{ background: BORDER_INACTIVE, padding: '1px' }}
        >
            {/* Inner white card */}
            <div className="relative rounded-[19px] bg-white h-full flex flex-col overflow-hidden">
                {/* Cursor-reactive inner glow */}
                <div
                    ref={glowRef}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{ opacity: 0, transition: 'opacity 0.25s ease' }}
                />
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
