// resources/js/components/portofolio/reading-chrome.tsx
// Éléments communs aux pages de lecture (projet, article) :
// barre de progression de lecture et image de couverture qui s'agrandit au scroll.

import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import { useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ShotPreview } from '@/components/portofolio/shot-preview';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

function subscribeNever(): () => void {
    return () => {};
}

/**
 * Fin trait teal en haut de l'écran, rendu dans <body> pour passer au-dessus de la navigation.
 */
export function ReadingProgress() {
    const isClient = useSyncExternalStore(
        subscribeNever,
        () => true,
        () => false,
    );
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 40,
        mass: 0.3,
    });

    if (!isClient) {
        return null;
    }

    return createPortal(
        <motion.div
            aria-hidden
            style={{ scaleX: progress }}
            className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-teal-600"
        />,
        document.body,
    );
}

/**
 * Couverture qui s'agrandit et s'aplatit en entrant dans l'écran.
 */
export function ExpandingCover({
    src,
    alt,
    className,
    framed = false,
    moreSrcs = [],
}: {
    src: string;
    alt: string;
    className?: string;
    /** Capture d'écran : affichée entière dans un appareil adapté, sans rognage. */
    framed?: boolean;
    /** Autres captures, pour montrer plusieurs écrans mobiles. */
    moreSrcs?: string[];
}) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const isMobile = useIsMobile();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'start 0.15'],
    });
    const isStatic = Boolean(prefersReducedMotion);
    const scale = useTransform(
        scrollYProgress,
        [0, 1],
        isStatic ? [1, 1] : [isMobile ? 0.94 : 0.84, 1],
    );
    const radius = useTransform(
        scrollYProgress,
        [0, 1],
        isStatic ? [16, 16] : [40, 16],
    );
    const imageScale = useTransform(
        scrollYProgress,
        [0, 1],
        isStatic ? [1, 1] : [1.08, 1],
    );

    return (
        <div ref={ref} className="container-main">
            <motion.div
                style={{ scale, borderRadius: radius }}
                className={cn(
                    'relative overflow-hidden border border-slate-200 bg-slate-100',
                    framed && 'aspect-[16/10] sm:aspect-[16/9]',
                    className,
                )}
            >
                {framed ? (
                    <motion.div
                        style={{ scale: imageScale }}
                        className="absolute inset-0"
                    >
                        <ShotPreview
                            src={src}
                            alt={alt}
                            moreSrcs={moreSrcs}
                            eager
                            fit
                        />
                    </motion.div>
                ) : (
                    <motion.img
                        src={src}
                        alt={alt}
                        fetchPriority="high"
                        style={{ scale: imageScale }}
                        className="block h-auto w-full"
                    />
                )}
            </motion.div>
        </div>
    );
}
