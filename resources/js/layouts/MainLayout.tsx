// resources/js/layouts/MainLayout.tsx
"use client";

import { Link, usePage }           from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { cn }                      from '@/lib/utils';
import { easings }                 from '@/lib/utils';

interface Props {
    children: ReactNode;
}

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

            {/* ── CONTENU DE LA PAGE ──────────────────────────────────────── */}
            <main>{children}</main>

            {/* ── FOOTER ─────────────────────────────────────────────────── */}
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