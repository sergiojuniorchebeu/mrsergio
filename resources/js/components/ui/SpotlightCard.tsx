// resources/js/components/ui/SpotlightCard.tsx
// Carte sobre : bordure fine, ombre douce au survol, pas d'effet lumineux.
// Le nom est conservé pour ne pas casser les pages qui l'importent.

import { cn } from '@/lib/utils';

interface SpotlightCardProps {
    children: React.ReactNode;
    className?: string;
    /** Classes du conteneur interne (ex. passer en ligne sur desktop). */
    innerClassName?: string;
}

export function SpotlightCard({ children, className, innerClassName }: SpotlightCardProps) {
    return (
        <div
            className={cn(
                'group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white',
                'transition-[border-color,box-shadow,transform] duration-300 ease-out active:scale-[0.98]',
                'hover:border-slate-300 hover:shadow-[0_1px_2px_rgba(30,27,22,0.04),0_12px_32px_-16px_rgba(30,27,22,0.18)]',
                className,
            )}
        >
            <div className={cn('relative flex h-full flex-col', innerClassName)}>{children}</div>
        </div>
    );
}
