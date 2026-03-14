// resources/js/components/ui/shiny-button.tsx
"use client";

import React from "react";
import { motion, type MotionProps } from "motion/react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// SHINY BUTTON — Premium animated CTA with sweep shimmer
// Supports: size variants, color variants, icon slots
// ─────────────────────────────────────────────────────────────────────────────

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "ghost";

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-xs rounded-xl gap-1.5",
    md: "px-6 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-8 py-3.5 text-sm rounded-2xl gap-2.5",
};

const variantClasses: Record<ButtonVariant, string> = {
    primary: cn(
        "bg-teal-600 text-white border-teal-500/50",
        "shadow-[0_2px_12px_rgba(26,163,137,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]",
        "hover:bg-teal-500 hover:shadow-[0_4px_24px_rgba(26,163,137,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]",
    ),
    secondary: cn(
        "bg-white text-slate-800 border-slate-200/80",
        "shadow-[0_1px_3px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]",
        "hover:bg-slate-50 hover:border-slate-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
    ),
    ghost: cn(
        "bg-transparent text-slate-600 border-slate-200",
        "hover:bg-slate-100/60 hover:text-teal-700 hover:border-teal-200",
    ),
};

// Shimmer color per variant
const shimmerColors: Record<ButtonVariant, string> = {
    primary:   "rgba(255,255,255,0.15)",
    secondary: "rgba(26,163,137,0.08)",
    ghost:     "rgba(26,163,137,0.06)",
};

const animationProps: MotionProps = {
    initial: { "--x": "100%", scale: 0.97 } as any,
    animate: { "--x": "-100%", scale: 1 } as any,
    whileTap: { scale: 0.96 },
    transition: {
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 1.5,
        type: "spring",
        stiffness: 20,
        damping: 15,
        mass: 2,
        scale: {
            type: "spring",
            stiffness: 260,
            damping: 12,
            mass: 0.5,
        },
    },
};

interface ShinyButtonProps
    extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>,
            MotionProps {
    children: React.ReactNode;
    className?: string;
    size?: ButtonSize;
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    /** Disable the shimmer sweep animation */
    noShimmer?: boolean;
}

export const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
    (
        {
            children,
            className,
            size = "md",
            variant = "primary",
            icon,
            iconPosition = "right",
            noShimmer = false,
            ...props
        },
        ref,
    ) => {
        const shimmerColor = shimmerColors[variant];

        return (
            <motion.button
                ref={ref}
                className={cn(
                    "relative cursor-pointer border font-semibold",
                    "inline-flex items-center justify-center",
                    "transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    "overflow-hidden",
                    sizeClasses[size],
                    variantClasses[variant],
                    className,
                )}
                {...(noShimmer ? { whileTap: { scale: 0.96 } } : animationProps)}
                {...props}
            >
                {/* Shimmer sweep overlay */}
                {!noShimmer && (
                    <span
                        className="absolute inset-0 z-[1] pointer-events-none rounded-[inherit]"
                        style={{
                            backgroundImage: `linear-gradient(
                                -75deg,
                                transparent calc(var(--x) + 20%),
                                ${shimmerColor} calc(var(--x) + 25%),
                                transparent calc(var(--x) + 100%)
                            )`,
                        } as React.CSSProperties}
                    />
                )}

                {/* Border shimmer (subtle glow sweep on border) */}
                {!noShimmer && (
                    <span
                        className="absolute inset-0 z-[2] pointer-events-none rounded-[inherit] p-px"
                        style={{
                            mask: "linear-gradient(#000, #000) content-box exclude, linear-gradient(#000, #000)",
                            WebkitMask: "linear-gradient(#000, #000) content-box exclude, linear-gradient(#000, #000)",
                            backgroundImage: `linear-gradient(
                                -75deg,
                                transparent calc(var(--x) + 20%),
                                ${shimmerColor} calc(var(--x) + 25%),
                                transparent calc(var(--x) + 100%)
                            )`,
                        } as React.CSSProperties}
                    />
                )}

                {/* Content */}
                <span className="relative z-[3] flex items-center gap-[inherit]">
                    {icon && iconPosition === "left" && (
                        <span className="flex-shrink-0">{icon}</span>
                    )}
                    {children}
                    {icon && iconPosition === "right" && (
                        <span className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
                            {icon}
                        </span>
                    )}
                </span>
            </motion.button>
        );
    },
);

ShinyButton.displayName = "ShinyButton";