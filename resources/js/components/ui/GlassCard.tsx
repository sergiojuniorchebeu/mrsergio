// resources/js/Components/ui/GlassCard.tsx
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    tilt?: boolean;  // effet 3D au hover
}

export function GlassCard({ children, className, tilt = false }: GlassCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Transformer la position souris en rotation 3D (comme un gyroscope Flutter)
    const rotateX = useTransform(y, [-100, 100], [8, -8]);
    const rotateY = useTransform(x, [-100, 100], [-8, 8]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!tilt || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : {}}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
                'bg-white/80 backdrop-blur-sm border border-white/60',
                'rounded-2xl shadow-xl shadow-gray-200/50',
                'p-6',
                className
            )}
        >
            {children}
        </motion.div>
    );
}