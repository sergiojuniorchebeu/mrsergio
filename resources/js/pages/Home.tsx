// resources/js/Pages/Home.tsx
"use client";

import { Head, Link }          from '@inertiajs/react';
import { motion }              from 'framer-motion';
import type { Variants }       from 'framer-motion';
import { useState }            from 'react';

import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { RevealText }          from '@/components/ui/AnimatedText';
import { AvatarGlow }          from '@/components/ui/AvatarGlow';
import { Particles }           from '@/components/ui/particles';
import { ShinyButton }         from '@/components/ui/shiny-button';
import { TypingAnimation }     from '@/components/ui/typing-animation';

import MainLayout              from '@/layouts/MainLayout';
import { easings, cn }         from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const containerVariants: Variants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants: Variants = {
    hidden:  { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easings.smooth } },
};

// ─────────────────────────────────────────────────────────────────────────────
// SOCIALS (inchangé)
// ─────────────────────────────────────────────────────────────────────────────
const socials = [
    {
        label: 'GitHub',
        href:  'https://github.com/sergiojuniorchebeu',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href:  'https://linkedin.com/in/sergiojuniorchebeu',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: 'Email',
        href:  'mailto:contact@mrsergio.dev',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// ICÔNES SVG — sans emoji
// ─────────────────────────────────────────────────────────────────────────────
const ArrowIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BookOpenIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

/* UsersIcon removed (unused) */

const StarIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const GlobeIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// CARD BASE — identique pour les 3 sections
// ─────────────────────────────────────────────────────────────────────────────
const cardCls = cn(
    'h-full flex flex-col rounded-2xl overflow-hidden',
    'bg-white border border-slate-200/70',
    'shadow-sm',
    'transition-all duration-300',
    'hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/8 hover:border-slate-300/80',
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER avec ligne décorative
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ label, title, href, icon }: {
    label: string; title: string; href: string; icon: React.ReactNode;
}) {
    return (
        <div className="flex items-end justify-between mb-10">
            <div className="flex items-start gap-4">
                {/* Icône de section */}
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0 mt-1">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-semibold text-teal-600 uppercase tracking-[0.2em] mb-1.5">{label}</p>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-primary leading-tight">{title}</h2>
                </div>
            </div>
            <Link
                href={href}
                className="group flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-600 hover:gap-2.5 transition-all duration-200 flex-shrink-0 ml-4 border border-slate-200 hover:border-teal-200 hover:bg-teal-50 px-3.5 py-2 rounded-xl"
            >
                Voir tout
                <ArrowIcon />
            </Link>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT CARD — reference design
// ─────────────────────────────────────────────────────────────────────────────
function ProjectCard({ p, i }: { p: any; i: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: easings.smooth, delay: i * 0.08 }}
            className="h-full"
        >
            <Link href={`/projects/${p.slug}`} className="group block h-full">
                <div className={cardCls}>
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                            src={p.image_url ?? p.image}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        {/* Tags overlay */}
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                            {p.tags?.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {/* Featured badge */}
                        {p.featured && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-400/90 backdrop-blur-sm text-amber-900 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                <StarIcon />
                                Coup de cœur
                            </div>
                        )}
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors leading-snug mb-1.5">
                                {p.title}
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                {p.description ?? p.desc}
                            </p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <GlobeIcon />
                                <span>Projet web</span>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:gap-2 transition-all duration-200">
                                Voir le projet
                                <ArrowIcon />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG CARD — uniformisée sur le modèle Project
// ─────────────────────────────────────────────────────────────────────────────
function BlogCard({ p, i }: { p: any; i: number }) {
    const tags: string[] = p.tags ?? (p.tag ? [p.tag] : []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: easings.smooth, delay: i * 0.08 }}
            className="h-full"
        >
            <Link href={`/blog/${p.slug}`} className="group block h-full">
                <div className={cardCls}>
                    {/* Image — même hauteur que Project */}
                    <div className="relative h-44 overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                            src={p.cover_image_url ?? p.image}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        {/* Tags overlay — même position que Project */}
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                            {tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {/* Temps de lecture */}
                        {p.reading_time && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-xs font-medium border border-white/20">
                                <ClockIcon />
                                {p.reading_time}
                            </div>
                        )}
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors leading-snug mb-1.5">
                                {p.title}
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                {p.excerpt ?? p.desc}
                            </p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <ClockIcon />
                                <span>{p.published_at ?? p.date ?? '—'}</span>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:gap-2 transition-all duration-200">
                                Lire l'article
                                <ArrowIcon />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMATION CARD — uniformisée sur le modèle Project
// ─────────────────────────────────────────────────────────────────────────────

// Icône de catégorie SVG selon la techno
function CategoryIcon({ category }: { category: string }) {
    const cat = (category ?? '').toLowerCase();

    if (cat.includes('laravel') || cat.includes('php'))
        return (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.007-.04-.013-.059-.024L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.038.01-.073.014-.11.003-.017.003-.035.009-.05a.337.337 0 01.033-.067c.01-.016.018-.034.03-.05.015-.014.032-.025.048-.038.015-.012.027-.027.044-.038h.001L5.044.05a.375.375 0 01.376 0L9.93 2.788h.001c.018.01.03.026.044.038.016.013.033.024.048.039.012.015.02.033.03.05.015.02.027.04.033.066.006.016.006.033.01.051.003.036.012.072.012.109v9.653l3.76-2.164V5.528c0-.037.007-.072.012-.109.003-.016.003-.035.009-.05a.377.377 0 01.033-.067c.01-.016.018-.033.03-.05.015-.014.032-.025.048-.038.015-.012.027-.027.044-.038h.001l4.51-2.738a.375.375 0 01.376 0l4.51 2.738c.017.011.03.026.044.038.016.013.032.024.048.039.012.015.02.033.03.05.015.02.026.04.033.066.005.016.006.033.009.051z" />
            </svg>
        );

    if (cat.includes('flutter') || cat.includes('dart') || cat.includes('mobile'))
        return (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zm.159 11.871l-5.684 5.684 5.684 5.685 7.527-5.685z" />
            </svg>
        );

    if (cat.includes('react') || cat.includes('vue') || cat.includes('frontend'))
        return (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278zm-.005 1.09c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.143.945-.25 1.44a23.478 23.478 0 0 0-3.107-.534A23.6 23.6 0 0 0 12.768 5.13a14.68 14.68 0 0 1 2.124-2.151c.652-.56 1.257-.885 1.78-.885zm-7.269.005c.52 0 1.125.326 1.78.89.672.56 1.37 1.338 2.017 2.28a23.718 23.718 0 0 0-2.134 1.714 23.69 23.69 0 0 0-3.107.531 14.827 14.827 0 0 1-.26-1.434c-.226-1.868.067-3.32.733-3.702a.915.915 0 0 1 .45-.113z" />
            </svg>
        );

    if (cat.includes('python'))
        return (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.912S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.03v-2.868s-.109-3.403 3.345-3.403h5.77s3.234.052 3.234-3.127V3.107S18.28 0 11.914 0zM8.708 1.798a1.068 1.068 0 110 2.137 1.068 1.068 0 010-2.137z" />
                <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752H12v-.826h8.109S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.03v2.868s.109 3.403-3.345 3.403h-5.77S6.218 12.287 6.218 15.466v5.427S5.72 24 12.086 24zm3.206-1.798a1.068 1.068 0 110-2.137 1.068 1.068 0 010 2.137z" />
            </svg>
        );

    if (cat.includes('java'))
        return (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0 0-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0 0 .07-.063.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0 0 .553.457 3.393.639" />
            </svg>
        );

    // Fallback générique
    return <BookOpenIcon />;
}

function FormationCard({ f, i }: { f: any; i: number }) {
    const isFree = f.is_free ?? f.free ?? false;
    const price  = f.price_formatted ?? f.price ?? (isFree ? 'Gratuit' : null);
    const category = f.category ?? f.cat ?? 'Formation';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: easings.smooth, delay: i * 0.08 }}
            className="h-full"
        >
            <Link href={`/formations/${f.slug}`} className="group block h-full">
                <div className={cardCls}>
                    {/* Image — même hauteur que les autres */}
                    <div className="relative h-44 overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                            src={f.cover_image_url ?? f.image}
                            alt={f.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                        {/* Tag catégorie — même position que Project tags */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                            <span className="text-white">
                                <CategoryIcon category={category} />
                            </span>
                            <span className="text-xs font-semibold text-white">{category}</span>
                        </div>

                        {/* Badge prix — top right */}
                        <div className={cn(
                            'absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm',
                            isFree
                                ? 'bg-teal-500 text-white'
                                : 'bg-black/30 backdrop-blur-md text-white border border-white/20',
                        )}>
                            {price}
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors leading-snug mb-1.5">
                                {f.title}
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                {f.excerpt ?? f.description ?? f.desc}
                            </p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            {/* Métadonnées */}
                            <div className="flex items-center gap-2">
                                {(f.duration_hours || f.duration_formatted) && (
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <ClockIcon />
                                        <span>{f.duration_formatted ?? `${f.duration_hours}h`}</span>
                                    </div>
                                )}
                                {f.lessons_count && (
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <BookOpenIcon />
                                        <span>{f.lessons_count} leçons</span>
                                    </div>
                                )}
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:gap-2 transition-all duration-200">
                                Voir
                                <ArrowIcon />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION DIVIDER — ligne décorative entre sections
// ─────────────────────────────────────────────────────────────────────────────
function SectionDivider() {
    return (
        <div className="flex items-center gap-4 container-main py-0">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-100" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
    );
}

// Icônes de section
const ProjectsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);
const BlogIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
);
const FormationsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HOME
// ─────────────────────────────────────────────────────────────────────────────
export default function Home({
    projects = [], posts = [], formations = [],
}: {
    projects?: any[]; posts?: any[]; formations?: any[];
}) {
    const [particleColor] = useState('#1aa389');

    return (
        <MainLayout>
            <Head title="Accueil — Sergio Junior Chebeu" />

            {/* ══ HERO — INCHANGÉ ══════════════════════════════════════════ */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                <AnimatedGridPattern
                    numSquares={40}
                    maxOpacity={0.04}
                    duration={4}
                    repeatDelay={0.8}
                    className={cn(
                        'absolute inset-0 w-full h-full text-teal-600',
                        '[mask-image:radial-gradient(900px_circle_at_65%_45%,white,transparent)]',
                    )}
                />
                <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-400/4 rounded-full blur-2xl pointer-events-none" />

                <div className="container-main relative z-10 py-12 sm:py-16 lg:py-24 w-full">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-center"
                    >
                        <div className="order-1 space-y-6 sm:space-y-8">
                            <motion.div variants={itemVariants}>
                                <p className="text-ink-muted text-xs font-sans font-medium tracking-[0.2em] uppercase">
                                    Développeur Full Stack
                                </p>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <h1 className="leading-[1.08] tracking-tight">
                                    <RevealText text="Sergio Junior" className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-ink-primary" delay={0.15} />
                                    <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mt-1">
                                        <TypingAnimation duration={80} delay={600} className="gradient-text font-display font-bold">
                                            Chebeu
                                        </TypingAnimation>
                                    </span>
                                </h1>
                            </motion.div>
                            <motion.p variants={itemVariants} className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-md">
                                Je construis des produits web qui combinent{' '}
                                <span className="text-teal-600 font-medium">performance technique</span>{' '}
                                et expérience utilisateur soignée.
                                Laravel, React, Flutter — du backend à l'app mobile.
                            </motion.p>
                            <motion.div variants={itemVariants} className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Link href="/projects" className="flex-shrink-0">
                                        <ShinyButton className="bg-teal-600 text-white px-5 sm:px-7 py-2.5 sm:py-3 text-sm font-semibold rounded-xl">
                                            <span className="flex items-center gap-2">
                                                Voir mes projets
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </span>
                                        </ShinyButton>
                                    </Link>
                                    <Link href="/contact" className="flex-shrink-0 group inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-sm font-semibold text-ink-secondary bg-surface-card hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-all duration-200">
                                        Me contacter
                                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    {socials.map(social => (
                                        <motion.a key={social.label} href={social.href} target={social.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" aria-label={social.label} whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2, ease: easings.bounce }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-card border border-slate-200 text-ink-muted hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-colors duration-200 shadow-sm">
                                            {social.icon}
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Photo — INCHANGÉE */}
                        <motion.div variants={itemVariants} className="order-2 flex justify-center lg:justify-end">
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
                                <AvatarGlow src="/images/profile_avatar.jpg" alt="Sergio Junior Chebeu" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ══ SECTION PROJETS ════════════════════════════════════════ */}
            <section className="relative overflow-hidden border-t border-slate-200/60 bg-white">
                <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={30} ease={80} color={particleColor} />
                {/* Orb décoratif */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-400/6 rounded-full blur-3xl pointer-events-none" />
                <div className="container-main relative z-10 py-16 sm:py-20">
                    <SectionHeader label="Portfolio" title="Projets récents" href="/projects" icon={<ProjectsIcon />} />
                    {projects.length === 0 ? (
                        <EmptyState message="Aucun projet publié pour l'instant." />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {projects.map((p, i) => <ProjectCard key={p.slug ?? i} p={p} i={i} />)}
                        </div>
                    )}
                </div>
            </section>

            <SectionDivider />

            {/* ══ SECTION BLOG ═══════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-slate-50/80">
                <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={20} ease={80} color={particleColor} />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />
                <div className="container-main relative z-10 py-16 sm:py-20">
                    <SectionHeader label="Lecture" title="Articles récents" href="/blog" icon={<BlogIcon />} />
                    {posts.length === 0 ? (
                        <EmptyState message="Aucun article publié pour l'instant." />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {posts.map((p, i) => <BlogCard key={p.slug ?? i} p={p} i={i} />)}
                        </div>
                    )}
                </div>
            </section>

            <SectionDivider />

            {/* ══ SECTION FORMATIONS ═════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-white">
                <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={25} ease={80} color={particleColor} />
                <div className="absolute -top-20 right-0 w-80 h-80 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />
                <div className="container-main relative z-10 py-16 sm:py-20">
                    <SectionHeader label="Apprendre" title="Mes formations" href="/formations" icon={<FormationsIcon />} />
                    {formations.length === 0 ? (
                        <EmptyState message="Aucune formation publiée pour l'instant." />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {formations.map((f, i) => <FormationCard key={f.slug ?? i} f={f} i={i} />)}
                        </div>
                    )}
                </div>
            </section>

        </MainLayout>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <p className="text-sm text-slate-400 font-medium">{message}</p>
        </div>
    );
}