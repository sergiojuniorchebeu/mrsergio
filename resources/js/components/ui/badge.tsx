// resources/js/Components/ui/Badge.tsx
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'glow' | 'border-beam';
    className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
                'relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                variant === 'default' && 'bg-brand-50 text-brand-700',
                variant === 'glow' && 'bg-brand-600 text-white shadow-lg shadow-brand-500/40',
                variant === 'border-beam' && [
                    'bg-white text-gray-700 border border-gray-200',
                    'before:absolute before:inset-0 before:rounded-full',
                    'before:bg-gradient-to-r before:from-brand-500 before:to-brand-300',
                    'before:opacity-0 before:transition-opacity hover:before:opacity-10',
                ],
                className
            )}
        >
            {variant === 'glow' && (
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
            {children}

            {/* Border beam effect */}
            {variant === 'border-beam' && (
                <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-brand-400/50 opacity-60"
                    style={{
                        background: 'conic-gradient(from 0deg, transparent 0%, #4f6ef7 10%, transparent 20%)',
                        WebkitMask: 'padding-box, border-box',
                        WebkitMaskComposite: 'destination-out',
                        mask: 'padding-box, border-box',
                        maskComposite: 'exclude',
                    }}
                />
            )}
        </motion.div>
    );
}