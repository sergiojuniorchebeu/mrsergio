// resources/js/components/ui/AvatarGlow.tsx
import { cn } from '@/lib/utils';

interface AvatarGlowProps {
    src: string;
    alt: string;
    className?: string;
}

export function AvatarGlow({ src, alt, className }: AvatarGlowProps) {
    return (
        <div className={cn('relative flex items-center justify-center', className)}>
            {/* Photo — tailles responsives mobile → desktop */}
            <div className="relative w-52 h-[300px] sm:w-64 sm:h-[370px] lg:w-80 lg:h-[480px] xl:w-96 xl:h-[540px] rounded-3xl overflow-hidden shadow-lg shadow-slate-900/10 border border-slate-200/60">
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover object-top"
                />
            </div>
        </div>
    );
}