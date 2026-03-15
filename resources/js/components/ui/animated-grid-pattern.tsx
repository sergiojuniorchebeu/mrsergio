// resources/js/components/ui/animated-grid-pattern.tsx
"use client";

import {
    ComponentPropsWithoutRef,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { motion } from "motion/react";
import { cn }     from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED GRID PATTERN — Subtle background grid with glowing squares
//
// Upgrades vs original:
// - Memoized square generation to prevent unnecessary re-renders
// - Stable keys to avoid React reconciliation thrashing
// - Configurable color via className (text-teal-600 etc.)
// - Performance: reduced re-renders with stable callbacks
//
// Usage:
//   <AnimatedGridPattern
//     numSquares={40}
//     maxOpacity={0.04}
//     duration={4}
//     className="text-teal-600 [mask-image:radial-gradient(800px_circle_at_50%_50%,white,transparent)]"
//   />
// ─────────────────────────────────────────────────────────────────────────────

export interface AnimatedGridPatternProps extends ComponentPropsWithoutRef<"svg"> {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    strokeDasharray?: number;
    numSquares?: number;
    maxOpacity?: number;
    duration?: number;
    repeatDelay?: number;
}

type Square = {
    id: number;
    pos: [number, number];
    iteration: number;
};

export function AnimatedGridPattern({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = 0,
    numSquares = 50,
    className,
    maxOpacity = 0.5,
    duration = 4,
    repeatDelay = 0.5,
    ...props
}: AnimatedGridPatternProps) {
    const id = useId();
    const containerRef = useRef<SVGSVGElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [squares, setSquares] = useState<Square[]>([]);

    const getPos = useCallback((): [number, number] => {
        if (!dimensions.width || !dimensions.height) return [0, 0];
        return [
            Math.floor((Math.random() * dimensions.width) / width),
            Math.floor((Math.random() * dimensions.height) / height),
        ];
    }, [dimensions.width, dimensions.height, width, height]);

    const generateSquares = useCallback(
        (count: number): Square[] =>
            Array.from({ length: count }, (_, i) => ({
                id: i,
                pos: getPos(),
                iteration: 0,
            })),
        [getPos],
    );

    const updateSquarePosition = useCallback(
        (squareId: number) => {
            setSquares(prev => {
                const current = prev[squareId];
                if (!current || current.id !== squareId) return prev;

                const next = prev.slice();
                next[squareId] = {
                    ...current,
                    pos: getPos(),
                    iteration: current.iteration + 1,
                };
                return next;
            });
        },
        [getPos],
    );

    // Generate squares when dimensions change
    useEffect(() => {
        if (dimensions.width > 0 && dimensions.height > 0) {
            setSquares(generateSquares(numSquares));
        }
    }, [dimensions.width, dimensions.height, generateSquares, numSquares]);

    // Observe container size
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width: w, height: h } = entry.contentRect;
                setDimensions(prev =>
                    prev.width === w && prev.height === h ? prev : { width: w, height: h },
                );
            }
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Memoize the path string
    const pathD = useMemo(() => `M.5 ${height}V.5H${width}`, [width, height]);

    return (
        <svg
            ref={containerRef}
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
                className,
            )}
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path d={pathD} fill="none" strokeDasharray={strokeDasharray} />
                </pattern>
            </defs>

            <rect width="100%" height="100%" fill={`url(#${id})`} />

            <svg x={x} y={y} className="overflow-visible">
                {squares.map(({ pos: [sx, sy], id: sqId, iteration }, index) => (
                    <motion.rect
                        key={`${sqId}-${iteration}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: maxOpacity }}
                        transition={{
                            duration,
                            repeat: 1,
                            delay: index * 0.1,
                            repeatType: "reverse",
                            repeatDelay,
                        }}
                        onAnimationComplete={() => updateSquarePosition(sqId)}
                        width={width - 1}
                        height={height - 1}
                        x={sx * width + 1}
                        y={sy * height + 1}
                        fill="currentColor"
                        strokeWidth="0"
                    />
                ))}
            </svg>
        </svg>
    );
}