// resources/js/components/ui/AppButton.tsx
// Bouton réutilisable — Tech Premium
// Variants : primary (dark) · accent (teal) · outline · ghost
// Sizes    : sm · md (default) · lg
//
// Usage :
//   <AppButton variant="primary">Voir mes projets</AppButton>
//   <AppButton variant="accent" icon={<ArrowRight />}>Me contacter</AppButton>
//   <AppButton variant="outline" size="sm">Blog</AppButton>

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ButtonVariant = "primary" | "accent" | "outline" | "ghost";
export type ButtonSize    = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?:  ButtonVariant;
    size?:     ButtonSize;
    children?: React.ReactNode;
    icon?:     React.ReactNode;
    loading?:  boolean;
}

// ─── Base ─────────────────────────────────────────────────────────────────────
const base = cn(
    "relative inline-flex items-center justify-center gap-2",
    "font-medium tracking-[-0.01em] rounded-xl select-none",
    "transition-all duration-200 ease-out",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2",
);

// ─── Variants ─────────────────────────────────────────────────────────────────
const variantStyles: Record<ButtonVariant, string> = {
    // CTA principal — fond sombre, texte blanc
    primary: cn(
        "bg-[#1a1916] text-white",
        "hover:bg-slate-800",
        "active:scale-[0.98]",
    ),
    // CTA accent — teal pour sections / nav
    accent: cn(
        "bg-teal-600 text-white",
        "hover:bg-teal-700",
        "active:scale-[0.98]",
    ),
    // Secondaire — contour discret
    outline: cn(
        "bg-white text-slate-700",
        "border border-slate-200",
        "hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900",
        "active:scale-[0.98]",
    ),
    // Ghost — sur fond clair, pas de bordure
    ghost: cn(
        "bg-transparent text-slate-600",
        "hover:bg-slate-100 hover:text-slate-900",
        "active:scale-[0.98]",
    ),
};

// ─── Tailles ──────────────────────────────────────────────────────────────────
const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8  px-3.5 text-xs",
    md: "h-10 px-4.5 text-sm",
    lg: "h-11 px-6   text-[14px]",
};

// ─── Icônes intégrées ─────────────────────────────────────────────────────────
export const ArrowRight = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Spinner = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="animate-spin">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// ─── Composant ────────────────────────────────────────────────────────────────
export const AppButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant  = "primary",
            size     = "md",
            children,
            icon,
            loading,
            className,
            disabled,
            ...props
        },
        ref,
    ) => (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
            disabled={disabled || loading}
            className={cn(base, variantStyles[variant], sizeStyles[size], className)}
            {...props}
        >
            {loading ? <Spinner /> : null}
            {children}
            {!loading && icon ? icon : null}
        </motion.button>
    ),
);

AppButton.displayName = "AppButton";

// Alias
export { AppButton as Button };
