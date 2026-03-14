// resources/js/components/ui/Button.tsx
//
// Bouton pro minimal — zéro effet shiny, zéro gimmick.
// 3 variants : primary · ghost · dark
// Tailles : sm · md (défaut) · lg
// Usage :
//   <Button>Voir mes projets</Button>
//   <Button variant="ghost">Me contacter</Button>
//   <Button variant="dark" size="lg">Découvrir</Button>

import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────
type Variant = 'primary' | 'ghost' | 'dark'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?:  Variant
    size?:     Size
    children:  React.ReactNode
    icon?:     React.ReactNode  // icône droite optionnelle
    loading?:  boolean
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const base = cn(
    'relative inline-flex items-center justify-center gap-2',
    'font-medium tracking-[-0.01em] rounded-xl',
    'transition-all duration-200 ease-out',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2',
)

const variants: Record<Variant, string> = {
    // Teal plein — CTA principal
    primary: cn(
        'bg-teal-600 text-white',
        'shadow-[0_1px_2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(29,158,117,0.3)_inset]',
        'hover:bg-teal-700',
        'active:bg-teal-800 active:scale-[0.98]',
    ),
    // Contour transparent — CTA secondaire
    ghost: cn(
        'bg-transparent text-slate-700',
        'border border-slate-200',
        'hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900',
        'active:scale-[0.98]',
    ),
    // Dark section — bouton sur fond sombre
    dark: cn(
        'bg-white/10 text-white',
        'border border-white/15',
        'backdrop-blur-sm',
        'hover:bg-white/18 hover:border-white/25',
        'active:scale-[0.98]',
    ),
}

const sizes: Record<Size, string> = {
    sm: 'h-8  px-3.5 text-xs',
    md: 'h-10 px-5   text-sm',
    lg: 'h-11 px-6   text-[15px]',
}

// ─── Icône flèche par défaut ──────────────────────────────────────────────────
const ArrowRight = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="animate-spin">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
)

// ─── Composant ────────────────────────────────────────────────────────────────
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', children, icon, loading, className, disabled, ...props }, ref) => (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
            disabled={disabled || loading}
            className={cn(base, variants[variant], sizes[size], className)}
            {...props}
        >
            {loading ? <Spinner /> : null}
            {children}
            {!loading && icon ? icon : null}
        </motion.button>
    )
)

Button.displayName = 'Button'

// ─── Exports raccourcis ───────────────────────────────────────────────────────
export { ArrowRight }
export type { ButtonProps, Variant as ButtonVariant, Size as ButtonSize }