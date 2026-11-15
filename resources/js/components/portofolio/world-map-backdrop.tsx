// resources/js/components/portofolio/world-map-backdrop.tsx
// Carte du monde en points, utilisée comme fond de section.
// Le lieu mis en avant (Yaoundé) pulse doucement ; la carte glisse légèrement au scroll.

import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';
import { useMemo, useRef } from 'react';
import { createMap } from 'svg-dotted-map';
import { cn } from '@/lib/utils';

const MAP_WIDTH = 150;
const MAP_HEIGHT = 75;
const MAP_SAMPLES = 6000;
const DOT_RADIUS = 0.22;

interface HighlightedPlace {
    lat: number;
    lng: number;
}

export function WorldMapBackdrop({
    place,
    className,
}: {
    place: HighlightedPlace;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });
    const y = useTransform(
        scrollYProgress,
        [0, 1],
        prefersReducedMotion ? [0, 0] : [0, 80],
    );

    const { points, marker, xStep, rowOf } = useMemo(() => {
        const map = createMap({
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            mapSamples: MAP_SAMPLES,
        });
        const rows = new Map<number, number>();
        let step = 0;

        [...map.points]
            .sort((a, b) => a.y - b.y || a.x - b.x)
            .forEach((point, index, sorted) => {
                if (!rows.has(point.y)) {
                    rows.set(point.y, rows.size);
                }

                const previous = sorted[index - 1];

                if (previous && previous.y === point.y) {
                    const delta = point.x - previous.x;
                    step = step === 0 ? delta : Math.min(step, delta);
                }
            });

        return {
            points: map.points,
            marker: map.addMarkers([{ ...place, size: 0.6 }])[0],
            xStep: step || 1,
            rowOf: (pointY: number) => rows.get(pointY) ?? 0,
        };
    }, [place]);

    const offset = (pointY: number) =>
        rowOf(pointY) % 2 === 1 ? xStep / 2 : 0;

    return (
        <div
            ref={ref}
            aria-hidden
            className={cn(
                'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
                className,
            )}
        >
            <motion.svg
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                preserveAspectRatio="xMidYMid slice"
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
                style={{ y }}
                className="h-full w-full [mask-image:radial-gradient(ellipse_85%_80%_at_55%_55%,black_35%,transparent_85%)] text-slate-300/80"
            >
                {points.map((point, index) => (
                    <circle
                        key={index}
                        cx={point.x + offset(point.y)}
                        cy={point.y}
                        r={DOT_RADIUS}
                        fill="currentColor"
                    />
                ))}

                {marker && (
                    <g className="text-teal-600">
                        {!prefersReducedMotion && (
                            <circle
                                cx={marker.x + offset(marker.y)}
                                cy={marker.y}
                                r={0.6}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={0.12}
                            >
                                <animate
                                    attributeName="r"
                                    from="0.6"
                                    to="3.2"
                                    dur="2.6s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    from="0.9"
                                    to="0"
                                    dur="2.6s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        )}
                        <circle
                            cx={marker.x + offset(marker.y)}
                            cy={marker.y}
                            r={0.6}
                            fill="currentColor"
                        />
                    </g>
                )}
            </motion.svg>
        </div>
    );
}
