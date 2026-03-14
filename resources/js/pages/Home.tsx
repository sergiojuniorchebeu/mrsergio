// resources/js/Pages/Home.tsx
"use client";

import { Head, Link }                                       from '@inertiajs/react';
import { motion, useScroll, useTransform, useInView }       from 'framer-motion';
import type { Variants }                                     from 'framer-motion';
import { useState, useRef }                                  from 'react';

import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { RevealText }          from '@/components/ui/AnimatedText';
import { AvatarGlow }          from '@/components/ui/AvatarGlow';
import { ContentCard, EmptyState } from '@/components/ui/content-card';
import { Particles }           from '@/components/ui/particles';
import { ShinyButton }         from '@/components/ui/shiny-button';
import { TypingAnimation }     from '@/components/ui/typing-animation';

import MainLayout              from '@/layouts/MainLayout';
import { easings, cn }         from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// EASINGS & VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const ease = [0.25, 0.1, 0.25, 1.0] as [number, number, number, number];

const stagger: Variants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const fadeUp: Variants = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easings.smooth } },
};

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL-TRIGGERED REVEAL
// ─────────────────────────────────────────────────────────────────────────────
function RevealSection({ children, className, delay = 0 }: {
    children: React.ReactNode; className?: string; delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// TECH STACK — tes vraies technos
// ─────────────────────────────────────────────────────────────────────────────
const techStack = [
    {
        name: 'Laravel',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.007-.04-.013-.059-.024L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.038.01-.073.014-.11.003-.017.003-.035.009-.05a.337.337 0 01.033-.067c.01-.016.018-.034.03-.05.015-.014.032-.025.048-.038.015-.012.027-.027.044-.038h.001L5.044.05a.375.375 0 01.376 0L9.93 2.788h.001c.018.01.03.026.044.038.016.013.033.024.048.039.012.015.02.033.03.05.015.02.027.04.033.066.006.016.006.033.01.051.003.036.012.072.012.109v9.653l3.76-2.164V5.528c0-.037.007-.072.012-.109.003-.016.003-.035.009-.05a.377.377 0 01.033-.067c.01-.016.018-.033.03-.05.015-.014.032-.025.048-.038.015-.012.027-.027.044-.038h.001l4.51-2.738a.375.375 0 01.376 0l4.51 2.738c.017.011.03.026.044.038.016.013.032.024.048.039.012.015.02.033.03.05.015.02.026.04.033.066.005.016.006.033.009.051z" />
            </svg>
        ),
    },
    {
        name: 'React',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278z" />
            </svg>
        ),
    },
    {
        name: 'Flutter',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zm.159 11.871l-5.684 5.684 5.684 5.685 7.527-5.685z" />
            </svg>
        ),
    },
    {
        name: 'Python',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.912S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.03v-2.868s-.109-3.403 3.345-3.403h5.77s3.234.052 3.234-3.127V3.107S18.28 0 11.914 0zM8.708 1.798a1.068 1.068 0 110 2.137 1.068 1.068 0 010-2.137z" />
                <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752H12v-.826h8.109S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.03v2.868s.109 3.403-3.345 3.403h-5.77S6.218 12.287 6.218 15.466v5.427S5.72 24 12.086 24zm3.206-1.798a1.068 1.068 0 110-2.137 1.068 1.068 0 010 2.137z" />
            </svg>
        ),
    },
    {
        name: 'Java',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0 0-8.216 2.051-4.292 6.573" />
            </svg>
        ),
    },
    {
        name: 'TailwindCSS',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
            </svg>
        ),
    },
    {
        name: 'MySQL',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.73-1.01 1.095-1.583 1.095-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.718-2.746-2.155-2.746-.704 0-1.254.232-1.65.697-.43.508-.646 1.256-.646 2.245 0 .972.19 1.686.574 2.14.35.41.822.615 1.42.615.26 0 .5-.04.723-.122l1.326.776.52-.602zm-3.21-2.882c0-1.384.453-2.076 1.358-2.076.39 0 .688.163.893.488.228.364.34.91.34 1.635 0 .756-.12 1.31-.36 1.664-.216.318-.512.477-.888.477-.376 0-.664-.165-.862-.494-.222-.37-.334-.916-.334-1.635l-.147-.06z" />
            </svg>
        ),
    },
    {
        name: 'Firebase',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z" />
            </svg>
        ),
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// SOCIALS
// ─────────────────────────────────────────────────────────────────────────────
const socials = [
    {
        label: 'GitHub',
        href: 'https://github.com/sergiojuniorchebeu',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/sergiojuniorchebeu',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: 'Email',
        href: 'mailto:contact@mrsergio.dev',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const ArrowIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BookIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const GlobeIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const StarIcon = () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ number, label, title, href }: {
    number: string; label: string; title: string; href: string;
}) {
    return (
        <div className="flex items-end justify-between mb-10">
            <div className="flex items-baseline gap-4">
                <span className="text-[11px] font-mono text-teal-500/50 tracking-wider">{number}</span>
                <div>
                    <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-[0.2em] mb-1.5">{label}</p>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-ink-primary tracking-tight">{title}</h2>
                </div>
            </div>
            <Link
                href={href}
                className="group hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-600 transition-all duration-200 border border-slate-200 hover:border-teal-200 hover:bg-teal-50 px-4 py-2 rounded-xl"
            >
                Voir tout
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Link>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// TECH MARQUEE (horizontal scroll of tech logos)
// ─────────────────────────────────────────────────────────────────────────────
function TechMarquee() {
    const doubled = [...techStack, ...techStack];
    return (
        <div className="overflow-hidden py-8 border-y border-slate-200/60 bg-white/50 backdrop-blur-sm">
            <motion.div
                className="flex gap-10 items-center"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
                {doubled.map((tech, i) => (
                    <div key={i} className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="text-slate-400">{tech.icon}</span>
                        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">{tech.name}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────
const stats = [
    { value: '3+',  label: 'Années d\'expérience' },
    { value: '20+', label: 'Projets livrés' },
    { value: '10+', label: 'Clients satisfaits' },
    { value: '8',   label: 'Technologies maîtrisées' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION DIVIDER
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

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HOME
// ─────────────────────────────────────────────────────────────────────────────
export default function Home({
    projects = [], posts = [], formations = [],
}: {
    projects?: any[]; posts?: any[]; formations?: any[];
}) {
    const [particleColor] = useState('#1aa389');

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <MainLayout>
            <Head title="Accueil — Sergio Junior Chebeu" />

            {/* ══ HERO ═══════════════════════════════════════════════ */}
            <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
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

                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="container-main relative z-10 py-12 sm:py-16 lg:py-24 w-full"
                >
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-center"
                    >
                        <div className="order-1 space-y-6 sm:space-y-8">
                            {/* Status badge */}
                            <motion.div variants={fadeUp}>
                                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                                    </span>
                                    <span className="text-[12px] text-slate-500 font-medium">
                                        Disponible pour de nouveaux projets
                                    </span>
                                </div>
                            </motion.div>

                            {/* Headline */}
                            <motion.div variants={fadeUp}>
                                <p className="text-ink-muted text-xs font-sans font-medium tracking-[0.2em] uppercase mb-3">
                                    Développeur Full Stack
                                </p>
                                <h1 className="leading-[1.08] tracking-tight">
                                    <RevealText text="Sergio Junior" className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-ink-primary" delay={0.15} />
                                    <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mt-1">
                                        <TypingAnimation duration={80} delay={600} className="gradient-text-hero font-display font-bold">
                                            Chebeu
                                        </TypingAnimation>
                                    </span>
                                </h1>
                            </motion.div>

                            {/* Description */}
                            <motion.p variants={fadeUp} className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-md">
                                Je construis des produits web qui combinent{' '}
                                <span className="text-teal-600 font-medium">performance technique</span>{' '}
                                et expérience utilisateur soignée.
                                Laravel, React, Flutter — du backend à l'app mobile.
                            </motion.p>

                            {/* CTAs */}
                            <motion.div variants={fadeUp} className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Link href="/projects" className="flex-shrink-0">
                                        <ShinyButton
                                            variant="primary"
                                            size="lg"
                                            icon={<ArrowIcon />}
                                        >
                                            Voir mes projets
                                        </ShinyButton>
                                    </Link>
                                    <Link href="/contact" className="flex-shrink-0">
                                        <ShinyButton
                                            variant="ghost"
                                            size="lg"
                                            noShimmer
                                            icon={
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            }
                                        >
                                            Me contacter
                                        </ShinyButton>
                                    </Link>
                                </div>

                                {/* Social links */}
                                <div className="flex items-center gap-2 pt-1">
                                    {socials.map(social => (
                                        <motion.a
                                            key={social.label}
                                            href={social.href}
                                            target={social.href.startsWith('mailto') ? undefined : '_blank'}
                                            rel="noreferrer"
                                            aria-label={social.label}
                                            whileHover={{ scale: 1.08, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: easings.bounce }}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-card border border-slate-200 text-ink-muted hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-colors duration-200 shadow-sm"
                                        >
                                            {social.icon}
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* ── Photo — AvatarGlow ──────────────────────────── */}
                        <motion.div variants={fadeUp} className="order-2 flex justify-center lg:justify-end">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <AvatarGlow src="/images/profile_avatar.jpg" alt="Sergio Junior Chebeu" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                >
                    <span className="text-[10px] text-ink-muted uppercase tracking-[0.2em] font-medium">Scroll</span>
                    <motion.div
                        className="w-px h-6 bg-gradient-to-b from-slate-400 to-transparent"
                        animate={{ scaleY: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ transformOrigin: 'top' }}
                    />
                </motion.div>
            </section>

            {/* ══ TECH MARQUEE ════════════════════════════════════════ */}
            <TechMarquee />

            {/* ══ STATS ══════════════════════════════════════════════ */}
            <section className="bg-surface py-16 sm:py-20">
                <div className="container-main">
                    <RevealSection>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-4xl sm:text-5xl font-display font-bold gradient-text tracking-tight">
                                        {stat.value}
                                    </p>
                                    <p className="mt-2 text-sm text-ink-muted font-medium">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ══ SECTION PROJETS ═════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-white">
                <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={30} ease={80} color={particleColor} />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-400/6 rounded-full blur-3xl pointer-events-none" />

                <div className="container-main relative z-10 py-16 sm:py-20">
                    <RevealSection>
                        <SectionHeader number="01" label="Portfolio" title="Projets récents" href="/projects" />
                    </RevealSection>

                    {projects.length === 0 ? (
                        <EmptyState message="Aucun projet publié pour l'instant." />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((p, i) => (
                                <ContentCard
                                    key={p.slug ?? i}
                                    href={`/projects/${p.slug}`}
                                    image={p.image_url ?? p.image}
                                    title={p.title}
                                    description={p.description ?? p.desc}
                                    tags={p.tags?.slice(0, 3)}
                                    badges={[
                                        ...(p.featured ? [{ label: 'Coup de cœur', color: 'amber' as const, icon: <StarIcon /> }] : []),
                                    ]}
                                    variant="project"
                                    meta={{ left: 'Projet web', leftIcon: <GlobeIcon />, right: 'Voir le projet' }}
                                    delay={i * 0.08}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <SectionDivider />

            {/* ══ SECTION BLOG ════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-slate-50/80">
                <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={20} ease={80} color={particleColor} />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container-main relative z-10 py-16 sm:py-20">
                    <RevealSection>
                        <SectionHeader number="02" label="Lecture" title="Articles récents" href="/blog" />
                    </RevealSection>

                    {posts.length === 0 ? (
                        <EmptyState message="Aucun article publié pour l'instant." />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((p, i) => {
                                const tags: string[] = p.tags ?? (p.tag ? [p.tag] : []);
                                return (
                                    <ContentCard
                                        key={p.slug ?? i}
                                        href={`/blog/${p.slug}`}
                                        image={p.cover_image_url ?? p.image}
                                        title={p.title}
                                        description={p.excerpt ?? p.desc}
                                        tags={tags.slice(0, 3)}
                                        badges={[
                                            ...(p.reading_time ? [{ label: p.reading_time, color: 'slate' as const, icon: <ClockIcon /> }] : []),
                                        ]}
                                        variant="blog"
                                        meta={{ left: p.published_at ?? p.date ?? '—', leftIcon: <ClockIcon />, right: "Lire l'article" }}
                                        delay={i * 0.08}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <SectionDivider />

            {/* ══ SECTION FORMATIONS ══════════════════════════════════ */}
            <section className="relative overflow-hidden bg-white">
                <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={25} ease={80} color={particleColor} />
                <div className="absolute -top-20 right-0 w-80 h-80 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container-main relative z-10 py-16 sm:py-20">
                    <RevealSection>
                        <SectionHeader number="03" label="Apprendre" title="Mes formations" href="/formations" />
                    </RevealSection>

                    {formations.length === 0 ? (
                        <EmptyState message="Aucune formation publiée pour l'instant." />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {formations.map((f, i) => {
                                const isFree = f.is_free ?? f.free ?? false;
                                const price = f.price_formatted ?? f.price ?? (isFree ? 'Gratuit' : null);
                                const category = f.category ?? f.cat ?? 'Formation';
                                return (
                                    <ContentCard
                                        key={f.slug ?? i}
                                        href={`/formations/${f.slug}`}
                                        image={f.cover_image_url ?? f.image}
                                        title={f.title}
                                        description={f.excerpt ?? f.description ?? f.desc}
                                        tags={[category]}
                                        badges={[
                                            ...(price ? [{ label: price, color: (isFree ? 'teal' : 'slate') as 'teal' | 'slate' }] : []),
                                        ]}
                                        variant="formation"
                                        meta={{
                                            left: [
                                                f.duration_formatted ?? (f.duration_hours ? `${f.duration_hours}h` : null),
                                                f.lessons_count ? `${f.lessons_count} leçons` : null,
                                            ].filter(Boolean).join(' · ') || undefined,
                                            leftIcon: <BookIcon />,
                                            right: 'Voir',
                                        }}
                                        delay={i * 0.08}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* ══ CTA SECTION ═════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-[#0F1A17]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/[0.03] to-transparent pointer-events-none" />
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundSize: '128px 128px',
                    }}
                />

                <div className="container-main relative z-10 py-20 sm:py-28">
                    <RevealSection>
                        <div className="max-w-2xl mx-auto text-center">
                            <p className="text-[11px] font-mono text-teal-400/60 uppercase tracking-[0.3em] mb-6">
                                Collaborons ensemble
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white/90 tracking-tight leading-[1.1]">
                                Un projet en tête ?
                            </h2>
                            <p className="mt-5 text-base text-white/35 leading-relaxed max-w-md mx-auto">
                                Discutons de votre idée et transformons-la en un produit digital d'exception.
                            </p>
                            <div className="mt-10 flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/contact"
                                    className="group inline-flex items-center gap-2.5 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-[#0F1A17] text-sm font-bold rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(26,163,137,0.3)]"
                                >
                                    Démarrer un projet
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <a
                                    href="mailto:contact@mrsergio.dev"
                                    className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium text-white/35 hover:text-white/60 transition-colors font-mono"
                                >
                                    contact@mrsergio.dev
                                </a>
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </section>

        </MainLayout>
    );
}