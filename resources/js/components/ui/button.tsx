// resources/js/Components/ui/Button.tsx
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'shine';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    onClick,
    className,
    disabled,
}: ButtonProps) {

    const base = 'relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl overflow-hidden transition-all duration-200 cursor-pointer select-none';

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    const variants = {
        primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/25',
        secondary: 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300',
        ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        // Effet "shine" inspiré Magic UI
        shine: 'bg-brand-600 text-white shadow-lg shadow-brand-500/25',
    };

    const content = (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            disabled={disabled}
            className={cn(base, sizes[size], variants[variant], className)}
        >
            {/* Effet shine animé (Magic UI style) */}
            {variant === 'shine' && (
                <span className="absolute inset-0 overflow-hidden rounded-xl">
                    <span className="absolute -inset-y-full left-0 w-1/3 bg-white/20 skew-x-12 animate-[shine_3s_ease-in-out_infinite]" />
                </span>
            )}
            {children}
        </motion.button>
    );

    return content;
}