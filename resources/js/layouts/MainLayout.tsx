// resources/js/layouts/MainLayout.tsx
"use client";

import { Link, usePage }           from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { cn }                      from '@/lib/utils';
import { easings }                 from '@/lib/utils';
import { Particles }               from '@/components/ui/particles';

interface Props {
    children: ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV DATA
// ─────────────────────────────────────────────────────────────────────────────
const navLinks = [
    { href: '/',           label: 'Accueil' },
    { href: '/projects',   label: 'Projets' },
    { href: '/blog',       label: 'Blog' },
    { href: '/formations', label: 'Formations' },
];

const footerSocials = [
    {
        label: 'GitHub',
        href:  'https://github.com/sergiojuniorchebeu',
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href:  'https://linkedin.com/in/sergiojuniorchebeu',
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: 'Email',
        href:  'mailto:contact@mrsergio.dev',
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW DATA — sera remplacé par Inertia::share() plus tard
// ─────────────────────────────────────────────────────────────────────────────
const previewProjects = [
    {
        slug:  'mrmarket-app-gestion-marche',
        title: 'MrMarket — App de gestion de marché',
        desc:  'Application mobile Flutter pour la gestion des vendeurs, stocks et transactions.',
        tags:  ['Flutter', 'Laravel'],
        // Unsplash image libre de droit — mobile app / market
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    },
    {
        slug:  'devconnect-communaute-developpeurs',
        title: 'DevConnect — Communauté de développeurs',
        desc:  'Plateforme de mise en relation de développeurs africains avec forum et mentorat.',
        tags:  ['React', 'Laravel'],
        image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80',
    },
    {
        slug:  'analyticspro-dashboard-kpi',
        title: 'AnalyticsPro — Dashboard de suivi KPI',
        desc:  'Dashboard analytique en temps réel pour PME avec graphiques et exports.',
        tags:  ['React', 'MySQL'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    },
];

const previewPosts = [
    {
        slug:  'mon-stack-2026-laravel-inertia-tailwind',
        title: 'Mon stack 2026 : Laravel + Inertia + Tailwind',
        date:  'il y a 10 jours',
        tag:   'Laravel',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    },
    {
        slug:  'architecture-propre-front-inertia',
        title: 'Architecture propre côté Front Inertia',
        date:  'il y a 6 jours',
        tag:   'Inertia',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    },
    {
        slug:  'seeders-avancer-vite-sans-dashboard',
        title: 'Seeders : avancer vite sans dashboard',
        date:  'il y a 2 jours',
        tag:   'Tips',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    },
];

const previewFormations = [
    { slug: 'laravel-zero-api-rest',              title: "Laravel — API REST",             cat: 'Laravel', icon: '🔴', price: '29,99 €', free: false, image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80' },
    { slug: 'flutter-firebase-app-mobile',        title: 'Flutter & Firebase',             cat: 'Flutter', icon: '🔵', price: '29,99 €', free: false, image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80' },
    { slug: 'python-automatisation-data',         title: 'Python — Automatisation',        cat: 'Python',  icon: '🐍', price: '24,99 €', free: false, image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80' },
    { slug: 'java-programmation-orientee-objet',  title: 'Java — POO',                     cat: 'Java',    icon: '☕', price: 'Gratuit',  free: true,  image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MENU VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const mobileMenuVariants = {
    hidden:  { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.2,  ease: easings.snappy } },
    visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.25, ease: easings.smooth } },
    exit:    { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.18, ease: easings.snappy } },
};
const mobileItemVariants = {
    hidden:  { opacity: 0, x: -12 },
    visible: (i: number) => ({
        opacity: 1, x: 0,
        transition: { delay: i * 0.06, duration: 0.3, ease: easings.smooth },
    }),
};

// ─────────────────────────────────────────────────────────────────────────────
// SOUS-COMPOSANTS CARDS
// ─────────────────────────────────────────────────────────────────────────────

// Card Projet — image pleine largeur + overlay + tags
function ProjectCard({ p, i }: { p: typeof previewProjects[0]; i: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease: easings.smooth, delay: i * 0.09 }}
        >
            <Link href={`/projects/${p.slug}`} className="group block h-full">
                <div className={cn(
                    'h-full flex flex-col rounded-2xl overflow-hidden',
                    'bg-surface-raised border border-slate-200/60',
                    'shadow-sm hover:shadow-xl hover:shadow-teal-900/8',
                    'transition-all duration-300 hover:-translate-y-1',
                )}>
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                        <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        {/* Tags sur l'image */}
                        <div className="absolute bottom-3 left-3 flex gap-1.5">
                            {p.tags.map(tag => (
                                <span key={tag} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Texte */}
                    <div className="flex flex-col flex-1 p-4 gap-2">
                        <p className="text-sm font-semibold text-ink-primary group-hover:text-teal-600 transition-colors leading-snug flex-1">
                            {p.title}
                        </p>
                        <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">{p.desc}</p>
                        <div className="flex items-center gap-1 text-xs font-semibold text-teal-600 pt-2 border-t border-slate-100 group-hover:gap-2 transition-all duration-200">
                            Voir le projet
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Card Blog — image + tag badge + date
function BlogCard({ p, i }: { p: typeof previewPosts[0]; i: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease: easings.smooth, delay: i * 0.09 }}
        >
            <Link href={`/blog/${p.slug}`} className="group block h-full">
                <div className={cn(
                    'h-full flex flex-col rounded-2xl overflow-hidden',
                    'bg-surface-card border border-slate-200/60',
                    'shadow-sm hover:shadow-xl hover:shadow-teal-900/8',
                    'transition-all duration-300 hover:-translate-y-1',
                )}>
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                        <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        {/* Tag pill en bas */}
                        <div className="absolute top-3 left-3">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-ink-secondary border border-white/60 shadow-sm">
                                {p.tag}
                            </span>
                        </div>
                    </div>

                    {/* Texte */}
                    <div className="flex flex-col flex-1 p-4 gap-2">
                        <p className="text-sm font-semibold text-ink-primary group-hover:text-teal-600 transition-colors leading-snug flex-1">
                            {p.title}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-xs text-ink-subtle">{p.date}</span>
                            <span className="text-xs font-semibold text-teal-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                                Lire
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Card Formation — image + prix badge + niveau
function FormationCard({ f, i }: { f: typeof previewFormations[0]; i: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease: easings.smooth, delay: i * 0.09 }}
        >
            <Link href={`/formations/${f.slug}`} className="group block h-full">
                <div className={cn(
                    'h-full flex flex-col rounded-2xl overflow-hidden',
                    'bg-surface-raised border border-slate-200/60',
                    'shadow-sm hover:shadow-xl hover:shadow-teal-900/8',
                    'transition-all duration-300 hover:-translate-y-1',
                )}>
                    {/* Image */}
                    <div className="relative h-36 overflow-hidden">
                        <img
                            src={f.image}
                            alt={f.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {/* Catégorie + icône */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/60 shadow-sm">
                            <span className="text-sm">{f.icon}</span>
                            <span className="text-xs font-semibold text-ink-secondary">{f.cat}</span>
                        </div>
                        {/* Prix badge */}
                        <div className={cn(
                            'absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm',
                            f.free ? 'bg-teal-600 text-white' : 'bg-white/90 backdrop-blur-sm text-ink-primary border border-white/60',
                        )}>
                            {f.price}
                        </div>
                    </div>

                    {/* Texte */}
                    <div className="flex flex-col flex-1 p-4 gap-2">
                        <p className="text-sm font-semibold text-ink-primary group-hover:text-teal-600 transition-colors leading-snug flex-1">
                            {f.title}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className={cn('text-xs font-bold', f.free ? 'text-teal-600' : 'text-ink-primary')}>
                                {f.price}
                            </span>
                            <span className="text-xs text-teal-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                Voir
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Header de section
function SectionHeader({ label, title, href, linkLabel }: { label: string; title: string; href: string; linkLabel: string }) {
    return (
        <div className="flex items-end justify-between mb-8">
            <div>
                <p className="text-xs font-medium text-ink-muted uppercase tracking-[0.2em] mb-1.5">{label}</p>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-primary">{title}</h2>
            </div>
            <Link
                href={href}
                className="group flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:gap-3 transition-all duration-200 flex-shrink-0 ml-4"
            >
                {linkLabel}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Link>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function MainLayout({ children }: Props) {
    const { url } = usePage();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [url]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <div className="min-h-screen bg-surface">

            {/* ── NAVBAR ─────────────────────────────────────────────────── */}
            <header className={cn(
                'sticky top-0 z-50 transition-all duration-300',
                scrolled
                    ? 'bg-surface/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-100'
                    : 'bg-surface/60 backdrop-blur-md border-b border-transparent',
            )}>
                <div className="container-main h-16 flex items-center justify-between">

                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm shadow-teal-500/30 group-hover:bg-teal-700 transition-colors duration-200">
                            <span className="text-white font-bold text-sm font-display">S</span>
                        </div>
                        <span className="font-semibold text-ink-primary text-base font-display tracking-tight">mrsergio</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => {
                            const isActive = url === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                                        isActive ? 'text-teal-600' : 'text-ink-muted hover:text-ink-primary hover:bg-slate-100/80',
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-indicator"
                                            className="absolute inset-0 bg-teal-50 rounded-lg border border-teal-100"
                                            style={{ zIndex: -1 }}
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/contact" className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors duration-200 shadow-sm shadow-teal-500/20">
                            Me contacter
                        </Link>
                    </div>

                    <button
                        onClick={() => setMenuOpen(v => !v)}
                        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                    >
                        <motion.span animate={menuOpen ? { rotate: 45,  y: 7  } : { rotate: 0, y: 0 }} transition={{ duration: 0.22 }} className="block w-5 h-[1.5px] bg-ink-primary rounded-full origin-center" />
                        <motion.span animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.18 }} className="block w-5 h-[1.5px] bg-ink-primary rounded-full" />
                        <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.22 }} className="block w-5 h-[1.5px] bg-ink-primary rounded-full origin-center" />
                    </button>
                </div>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            key="mobile-menu"
                            variants={mobileMenuVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="md:hidden border-t border-slate-100 bg-surface/95 backdrop-blur-xl"
                        >
                            <div className="container-main py-4 space-y-1">
                                {navLinks.map((link, i) => {
                                    const isActive = url === link.href;
                                    return (
                                        <motion.div key={link.href} custom={i} variants={mobileItemVariants} initial="hidden" animate="visible">
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                                                    isActive ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'text-ink-secondary hover:bg-slate-100 hover:text-ink-primary',
                                                )}
                                            >
                                                {link.label}
                                                {isActive && <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                <motion.div custom={navLinks.length} variants={mobileItemVariants} initial="hidden" animate="visible" className="pt-2">
                                    <Link href="/contact" className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors duration-200">
                                        Me contacter
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ── PAGE CONTENT ────────────────────────────────────────────── */}
            <main>{children}</main>

            {/* ══════════════════════════════════════════════════════════════
                SECTIONS DÉFILANTES
            ══════════════════════════════════════════════════════════════ */}

            {/* ── Projets ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-t border-slate-200/60 bg-surface-card">
                <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={30} ease={80} color="#1aa389" />
                <div className="container-main relative z-10 py-14 sm:py-16">
                    <SectionHeader label="Portfolio" title="Projets récents" href="/projects" linkLabel="Voir tout" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {previewProjects.map((p, i) => <ProjectCard key={p.slug} p={p} i={i} />)}
                    </div>
                </div>
            </section>

            {/* ── Blog ────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-t border-slate-200/60 bg-surface">
                <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={25} ease={80} color="#1aa389" />
                <div className="container-main relative z-10 py-14 sm:py-16">
                    <SectionHeader label="Lecture" title="Articles récents" href="/blog" linkLabel="Voir tout" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {previewPosts.map((p, i) => <BlogCard key={p.slug} p={p} i={i} />)}
                    </div>
                </div>
            </section>

            {/* ── Formations ──────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-t border-slate-200/60 bg-surface-card">
                <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={30} ease={80} color="#1aa389" />
                <div className="container-main relative z-10 py-14 sm:py-16">
                    <SectionHeader label="Apprendre" title="Mes formations" href="/formations" linkLabel="Voir tout" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {previewFormations.map((f, i) => <FormationCard key={f.slug} f={f} i={i} />)}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ──────────────────────────────────────────────────── */}
            <footer className="border-t border-slate-200/70 bg-surface-card">
                <div className="container-main py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                        <div className="flex flex-col items-center md:items-start gap-2">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-teal-600 rounded-md flex items-center justify-center">
                                    <span className="text-white font-bold text-xs font-display">S</span>
                                </div>
                                <span className="font-semibold text-ink-primary text-sm font-display">mrsergio</span>
                            </Link>
                            <p className="text-xs text-ink-subtle text-center md:text-left max-w-xs">
                                Développeur Full Stack · Laravel · React · Flutter
                            </p>
                        </div>

                        <nav className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                            {navLinks.map(link => (
                                <Link key={link.href} href={link.href} className="text-xs text-ink-muted hover:text-teal-600 transition-colors duration-200 font-medium">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            {footerSocials.map(social => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target={social.href.startsWith('mailto') ? undefined : '_blank'}
                                    rel="noreferrer"
                                    aria-label={social.label}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-subtle hover:text-teal-600 hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all duration-200"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 my-8" />

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        <p className="text-xs text-ink-subtle">
                            © {new Date().getFullYear()} Sergio Junior Chebeu — Tous droits réservés.
                        </p>
                        <p className="text-xs text-ink-subtle">contact@mrsergio.dev</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}