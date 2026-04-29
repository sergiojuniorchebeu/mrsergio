import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-teal-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(29,158,117,0.3)_inset] hover:bg-teal-700',
                primary:
                    'bg-teal-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(29,158,117,0.3)_inset] hover:bg-teal-700',
                secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
                ghost:
                    'border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                outline:
                    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                dark: 'border border-white/15 bg-white/10 text-white hover:border-white/25 hover:bg-white/18',
                destructive: 'bg-red-600 text-white hover:bg-red-700',
                link: 'h-auto px-0 py-0 text-teal-600 underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-5 py-2',
                sm: 'h-8 px-3.5 text-xs',
                lg: 'h-11 px-6 text-[15px]',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

const ArrowRight = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Spinner = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
        className="animate-spin"
    >
        <circle
            cx="7"
            cy="7"
            r="5.5"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1.5"
        />
        <path
            d="M7 1.5A5.5 5.5 0 0112.5 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    icon?: React.ReactNode;
    loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            icon,
            loading = false,
            children,
            disabled,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? Slot : 'button';

        return (
            <Comp
                ref={ref}
                className={cn(buttonVariants({ variant, size }), className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? <Spinner /> : null}
                {children}
                {!loading && icon ? icon : null}
            </Comp>
        );
    },
);

Button.displayName = 'Button';

export const AppButton = Button;

export { ArrowRight, buttonVariants };
export type ButtonVariant = NonNullable<
    VariantProps<typeof buttonVariants>['variant']
>;
export type ButtonSize = NonNullable<
    VariantProps<typeof buttonVariants>['size']
>;
