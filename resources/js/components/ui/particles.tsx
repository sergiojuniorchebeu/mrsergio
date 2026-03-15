// resources/js/components/ui/particles.tsx
"use client";

import React, {
    ComponentPropsWithoutRef,
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLES — Ambient floating particles with mouse magnetism
//
// Performance upgrades vs original:
// - Throttled mouse tracking (RAF-based instead of every mousemove)
// - Debounced resize handler
// - Avoids re-creating particles on every render
// - Configurable density preset
//
// Usage:
//   <Particles quantity={30} color="#1aa389" ease={80} />
//   <Particles density="sparse" color="#1aa389" />
// ─────────────────────────────────────────────────────────────────────────────

interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
    className?: string;
    quantity?: number;
    staticity?: number;
    ease?: number;
    size?: number;
    refresh?: boolean;
    color?: string;
    vx?: number;
    vy?: number;
    /** Preset density: 'sparse' | 'normal' | 'dense' — overrides quantity */
    density?: 'sparse' | 'normal' | 'dense';
}

type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
};

function hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("");
    }
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const densityMap = { sparse: 20, normal: 50, dense: 100 };

export const Particles: React.FC<ParticlesProps> = ({
    className = "",
    quantity,
    staticity = 50,
    ease = 50,
    size = 0.4,
    refresh = false,
    color = "#ffffff",
    vx = 0,
    vy = 0,
    density,
    ...props
}) => {
    const canvasRef          = useRef<HTMLCanvasElement>(null);
    const containerRef       = useRef<HTMLDivElement>(null);
    const ctx                = useRef<CanvasRenderingContext2D | null>(null);
    const circles            = useRef<Circle[]>([]);
    const mouse              = useRef({ x: 0, y: 0 });
    const canvasSize         = useRef({ w: 0, h: 0 });
    const rafID              = useRef<number | null>(null);
    const mouseRAF           = useRef<number | null>(null);
    const resizeTimer        = useRef<ReturnType<typeof setTimeout> | null>(null);

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    const rgb = hexToRgb(color);
    const particleCount = quantity ?? (density ? densityMap[density] : 50);

    // ── Particle factory ─────────────────────────────────────────────────
    const createCircle = useCallback((): Circle => {
        const { w, h } = canvasSize.current;
        return {
            x: Math.floor(Math.random() * w),
            y: Math.floor(Math.random() * h),
            translateX: 0,
            translateY: 0,
            size: Math.floor(Math.random() * 2) + size,
            alpha: 0,
            targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
            dx: (Math.random() - 0.5) * 0.1,
            dy: (Math.random() - 0.5) * 0.1,
            magnetism: 0.1 + Math.random() * 4,
        };
    }, [size]);

    // ── Draw single circle ───────────────────────────────────────────────
    const drawCircle = useCallback((c: Circle) => {
        const context = ctx.current;
        if (!context) return;
        context.save();
        context.translate(c.translateX, c.translateY);
        context.beginPath();
        context.arc(c.x, c.y, c.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${c.alpha})`;
        context.fill();
        context.restore();
    }, [rgb]);

    // ── Init / resize canvas ─────────────────────────────────────────────
    const initCanvas = useCallback(() => {
        const container = containerRef.current;
        const canvas    = canvasRef.current;
        const context   = ctx.current;
        if (!container || !canvas || !context) return;

        canvasSize.current.w = container.offsetWidth;
        canvasSize.current.h = container.offsetHeight;

        canvas.width  = canvasSize.current.w * dpr;
        canvas.height = canvasSize.current.h * dpr;
        canvas.style.width  = `${canvasSize.current.w}px`;
        canvas.style.height = `${canvasSize.current.h}px`;
        context.scale(dpr, dpr);

        // Re-create all particles
        circles.current = Array.from({ length: particleCount }, () => createCircle());
    }, [dpr, particleCount, createCircle]);

    // ── Animate loop ─────────────────────────────────────────────────────
    const animate = useCallback(() => {
        const context = ctx.current;
        if (!context) return;

        const { w, h } = canvasSize.current;
        context.clearRect(0, 0, w, h);

        for (let i = circles.current.length - 1; i >= 0; i--) {
            const c = circles.current[i];

            // Edge fade
            const edgeDist = Math.min(
                c.x + c.translateX - c.size,
                w - c.x - c.translateX - c.size,
                c.y + c.translateY - c.size,
                h - c.y - c.translateY - c.size,
            );
            const edgeFactor = Math.max(0, Math.min(1, edgeDist / 20));

            if (edgeFactor > 1) {
                c.alpha = Math.min(c.alpha + 0.02, c.targetAlpha);
            } else {
                c.alpha = c.targetAlpha * edgeFactor;
            }

            // Move
            c.x += c.dx + vx;
            c.y += c.dy + vy;
            c.translateX += (mouse.current.x / (staticity / c.magnetism) - c.translateX) / ease;
            c.translateY += (mouse.current.y / (staticity / c.magnetism) - c.translateY) / ease;

            drawCircle(c);

            // Out of bounds → recycle
            if (
                c.x < -c.size || c.x > w + c.size ||
                c.y < -c.size || c.y > h + c.size
            ) {
                circles.current[i] = createCircle();
            }
        }

        rafID.current = requestAnimationFrame(animate);
    }, [vx, vy, staticity, ease, drawCircle, createCircle]);

    // ── Mouse tracking (throttled via RAF) ───────────────────────────────
    useEffect(() => {
        let pendingX = 0, pendingY = 0;

        const onMouseMove = (e: MouseEvent) => {
            pendingX = e.clientX;
            pendingY = e.clientY;

            if (mouseRAF.current === null) {
                mouseRAF.current = requestAnimationFrame(() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const rect = canvas.getBoundingClientRect();
                        const { w, h } = canvasSize.current;
                        const x = pendingX - rect.left - w / 2;
                        const y = pendingY - rect.top  - h / 2;
                        if (Math.abs(x) < w / 2 && Math.abs(y) < h / 2) {
                            mouse.current.x = x;
                            mouse.current.y = y;
                        }
                    }
                    mouseRAF.current = null;
                });
            }
        };

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            if (mouseRAF.current) cancelAnimationFrame(mouseRAF.current);
        };
    }, []);

    // ── Setup + cleanup ──────────────────────────────────────────────────
    useEffect(() => {
        if (canvasRef.current) {
            ctx.current = canvasRef.current.getContext("2d");
        }
        initCanvas();
        animate();

        const handleResize = () => {
            if (resizeTimer.current) clearTimeout(resizeTimer.current);
            resizeTimer.current = setTimeout(initCanvas, 200);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            if (rafID.current) cancelAnimationFrame(rafID.current);
            if (resizeTimer.current) clearTimeout(resizeTimer.current);
            window.removeEventListener("resize", handleResize);
        };
    }, [color, refresh, initCanvas, animate]);

    return (
        <div
            ref={containerRef}
            className={cn("pointer-events-none", className)}
            aria-hidden="true"
            {...props}
        >
            <canvas ref={canvasRef} className="size-full" />
        </div>
    );
};