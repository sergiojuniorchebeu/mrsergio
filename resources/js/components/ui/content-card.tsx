// resources/js/components/ui/content-card.tsx
"use client";

import { Link }             from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState }  from 'react';
import { cn }                from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT CARD — Reusable card widget for Projects, Blog, Formations
// ─────────────────────────────────────────────────────────────────────────────
//
// Usage:
//   <ContentCard
//     href="/projects/my-slug"
//     image="/images/project.jpg"
//     title="Mon projet"
//     description="Description courte du projet"
//     tags={['Laravel', 'React']}
//     variant="project"
//     meta={{ left: 'Projet web', right: 'Voir le projet' }}
//   />
//
// Variants: "project" | "blog" | "formation"
// Each variant tweaks badge style and layout slightly.
// ─────────────────────────────────────────────────────────────────────────────

const ease = [0.25, 0.1, 0.25, 1.0] as [number, number, number, number];

type CardVariant = "project" | "blog" | "formation";

interface Badge {
    label: string;
    color?: "teal" | "amber" | "slate" | "default";
    icon?: React.ReactNode;
}

interface CardMeta {
    left?: string;
    leftIcon?: React.ReactNode;
    right?: string;
}

interface ContentCardProps {
    href: string;
    image: string;
    title: string;
    description?: string;
    tags?: string[];
    badges?: Badge[];
    variant?: CardVariant;
    meta?: CardMeta;
    delay?: number;
    className?: string;
}

// ── Arrow icon ────────────────────────────────────────────────────────────
const ArrowIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const ArrowUpRight = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
);

// ── Badge colors ──────────────────────────────────────────────────────────
const badgeColors: Record<string, string> = {
    teal:    "bg-teal-500/90 text-white",
    amber:   "bg-amber-400/90 text-amber-900",
    slate:   "bg-black/25 backdrop-blur-md text-white border border-white/15",
    default: "bg-black/25 backdrop-blur-md text-white border border-white/15",
};

export function ContentCard({
    href,
    image,
    title,
    description,
    tags = [],
    badges = [],
    variant = "project",
    meta,
    delay = 0,
    className,
}: ContentCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.65, ease, delay }}
            className={cn("h-full", className)}
        >
            <Link href={href} className="group block h-full">
                <div
                    className={cn(
                        'h-full flex flex-col rounded-2xl overflow-hidden',
                        'bg-white border border-slate-200/70',
                        'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]',
                        'transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]',
                        'hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.04)]',
                        'hover:border-slate-300/80',
                    )}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {/* ── Image ─────────────────────────────────────────── */}
                    <div className="relative h-48 overflow-hidden bg-slate-100 flex-shrink-0">
                        <motion.img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                            animate={{ scale: hovered ? 1.05 : 1 }}
                            transition={{ duration: 0.6, ease }}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                        {/* Tags — bottom left */}
                        {tags.length > 0 && (
                            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-10">
                                {tags.slice(0, 3).map(tag => (
                                    <span
                                        key={tag}
                                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/25 backdrop-blur-md text-white border border-white/15"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Badges — top right */}
                        {badges.length > 0 && (
                            <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                                {badges.map((badge, bi) => (
                                    <div
                                        key={bi}
                                        className={cn(
                                            "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm",
                                            badgeColors[badge.color ?? 'default'],
                                        )}
                                    >
                                        {badge.icon}
                                        {badge.label}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Hover arrow — top right (only if no badges) */}
                        {badges.length === 0 && (
                            <motion.div
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-teal-600 z-10"
                                animate={{
                                    scale: hovered ? 1 : 0.6,
                                    opacity: hovered ? 1 : 0,
                                }}
                                transition={{ duration: 0.25, ease }}
                            >
                                <ArrowUpRight />
                            </motion.div>
                        )}
                    </div>

                    {/* ── Content ───────────────────────────────────────── */}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                        <div className="flex-1">
                            <h3 className="text-[15px] font-bold text-slate-800 group-hover:text-teal-600 transition-colors duration-300 leading-snug mb-1.5 line-clamp-2">
                                {title}
                            </h3>
                            {description && (
                                <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* ── Footer meta ──────────────────────────────── */}
                        {meta && (
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                {meta.left && (
                                    <div className="flex items-center gap-1.5 text-[12px] text-slate-400 font-medium">
                                        {meta.leftIcon}
                                        <span>{meta.left}</span>
                                    </div>
                                )}
                                {meta.right && (
                                    <motion.span
                                        className="flex items-center gap-1.5 text-[12px] font-bold text-teal-600"
                                        animate={{ x: hovered ? 3 : 0 }}
                                        transition={{ duration: 0.25, ease }}
                                    >
                                        {meta.right}
                                        <ArrowIcon />
                                    </motion.span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE — Reusable placeholder when no content
// ─────────────────────────────────────────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <p className="text-sm text-slate-400 font-medium">{message}</p>
        </div>
    );
}