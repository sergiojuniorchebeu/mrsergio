// resources/js/components/portofolio/formation-deck.tsx
// Formations comme un jeu de cartes : empilées puis distribuées au scroll (desktop),
// carrousel horizontal à glisser (mobile).

import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef, useSyncExternalStore } from 'react';
import { FormationCard } from '@/components/ui/FormationCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { easings } from '@/lib/utils';
import type { Formation } from '@/types';

const DESKTOP_QUERY = '(min-width: 1024px)';
const COLUMNS = 3;

function subscribeToDesktop(callback: () => void): () => void {
    const query = window.matchMedia(DESKTOP_QUERY);
    query.addEventListener('change', callback);

    return () => query.removeEventListener('change', callback);
}

function useIsDesktop(): boolean {
    return useSyncExternalStore(
        subscribeToDesktop,
        () => window.matchMedia(DESKTOP_QUERY).matches,
        () => false,
    );
}

function DealtCard({
    formation,
    index,
    total,
    progress,
}: {
    formation: Formation;
    index: number;
    total: number;
    progress: MotionValue<number>;
}) {
    const column = index % COLUMNS;
    const row = Math.floor(index / COLUMNS);
    const centerColumn = (Math.min(COLUMNS, total) - 1) / 2;
    const start = index * 0.06;

    const x = useTransform(progress, [start, 1], [`${(centerColumn - column) * 104}%`, '0%']);
    const y = useTransform(progress, [start, 1], [`${-row * 100 + 18}%`, '0%']);
    const rotate = useTransform(progress, [start, 1], [(column - centerColumn) * 9 + row * 3, 0]);
    const scale = useTransform(progress, [start, 1], [0.9, 1]);

    return (
        <motion.div style={{ x, y, rotate, scale, zIndex: total - index }} className="relative h-full">
            <FormationCard formation={formation} index={index} withEntrance={false} />
        </motion.div>
    );
}

function DesktopDeck({ formations }: { formations: Formation[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.95', 'start 0.3'],
    });
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.5 });

    return (
        <div ref={ref} className="grid grid-cols-3 gap-6">
            {formations.map((formation, index) => (
                <DealtCard
                    key={formation.slug}
                    formation={formation}
                    index={index}
                    total={formations.length}
                    progress={progress}
                />
            ))}
        </div>
    );
}

function MobileCarousel({ formations }: { formations: Formation[] }) {
    return (
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
            {formations.map((formation, index) => (
                <motion.div
                    key={formation.slug}
                    initial={{ opacity: 0, x: 60, rotate: 3 }}
                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: index * 0.08, ease: easings.smooth }}
                    className="w-[82%] shrink-0 snap-center"
                >
                    <FormationCard formation={formation} index={index} withEntrance={false} />
                </motion.div>
            ))}
        </div>
    );
}

export function FormationDeck({ formations }: { formations: Formation[] }) {
    const prefersReducedMotion = useReducedMotion();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();

    if (isMobile) {
        return <MobileCarousel formations={formations} />;
    }

    if (isDesktop && !prefersReducedMotion) {
        return <DesktopDeck formations={formations} />;
    }

    return (
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            {formations.map((formation, index) => (
                <FormationCard key={formation.slug} formation={formation} index={index} />
            ))}
        </div>
    );
}
