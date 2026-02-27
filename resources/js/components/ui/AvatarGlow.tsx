// resources/js/components/ui/AvatarGlow.tsx
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AvatarGlowProps {
    src: string;
    alt: string;
    className?: string;
}

export function AvatarGlow({ src, alt, className }: AvatarGlowProps) {
    return (
        <div className={cn('relative flex items-center justify-center', className)}>

            {/* Glow soft derrière */}
            <motion.div
                animate={{ opacity: [0.12, 0.06, 0.12], scale: [1, 1.04, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-teal-400/15 rounded-3xl blur-3xl"
            />
            <motion.div
                animate={{ opacity: [0.08, 0.03, 0.08], scale: [1, 1.06, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -inset-4 bg-teal-300/8 rounded-3xl blur-3xl"
            />

            {/* Photo — tailles responsives mobile → desktop */}
            <div className="relative w-52 h-[300px] sm:w-64 sm:h-[370px] lg:w-80 lg:h-[480px] xl:w-96 xl:h-[540px] rounded-3xl overflow-hidden z-10 shadow-xl shadow-teal-900/10 border border-white/50">
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover object-top"
                />
                {/* Overlay bas léger */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/15 to-transparent" />
            </div>

        </div>
    );
}