// resources/js/layouts/MainLayout.tsx
"use client";

import { Link, usePage }           from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants }           from 'framer-motion';
import type { ReactNode }          from 'react';
import { useState, useEffect }     from 'react';
import { cn }                      from '@/lib/utils';

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

const footerLinks = [
    { href: '/projects',   label: 'Projets' },
    { href: '/blog',       label: 'Blog' },
    { href: '/formations', label: 'Formations' },
    { href: '/contact',    label: 'Contact' },
];

// ── Easings ────────────────────────────────────────────────────────────────
const EASE_OUT: [number, number, number, number] = [0.0, 0.0, 0.2, 1.0];
const EASE_IN:  [number, number, number, number] = [0.4, 0.0, 1.0, 1.0];

const mobileMenuVariants: Variants = {
    hidden:  { opacity: 0, y: -10, scale: 0.96 },
    visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.28, ease: EASE_OUT } },
    exit:    { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.18, ease: EASE_IN  } },
};

const mobileItemVariants: Variants = {
    hidden:  { opacity: 0, x: -10 },
    visible: (i: number) => ({
        opacity: 1, x: 0,
        transition: { delay: i * 0.05, duration: 0.28, ease: EASE_OUT },
    }),
};

// ── Logo SVG mrsergio.dev ─────────────────────────────────────────────────
function LogoMark({ size = 32 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            aria-label="mrsergio.dev"
        >
            <polygon points="32,3 58,17 58,47 32,61 6,47 6,17"
                fill="#1D9E75" fillOpacity="0.13" />
            <polygon points="32,3 58,17 58,47 32,61 6,47 6,17"
                fill="none" stroke="#1D9E75" strokeWidth="1.5" />
            <path
                d="M20 24Q20 18 26 18L38 18Q44 18 44 24Q44 30 32 34Q20 38 20 44Q20 50 26 50L38 50Q44 50 44 44"
                stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" fill="none"
            />
            <circle cx="54" cy="17" r="5" fill="#1D9E75" />
        </svg>
    );
}

export default function MainLayout({ children }: Props) {
    const { url } = usePage();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const id = setTimeout(() => setMenuOpen(false), 0);
        return () => clearTimeout(id);
    }, [url]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <div className="min-h-screen bg-surface">

            {/* ── NAVBAR — frosted glass light ─────────────────────── */}
            <div className="fixed top-0 inset-x-0 z-50 flex justify-center pt-3 px-4">
                <motion.header
                    layout
                    transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9 }}
                    className={cn(
                        'relative flex items-center justify-between overflow-visible',
                        'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
                        'rounded-[22px]',
                        'bg-white/75 backdrop-blur-[20px] backdrop-saturate-[1.6]',
                        'border border-white/60',
                        scrolled
                            ? 'w-full max-w-2xl mx-auto h-[52px] px-4 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.75),0_8px_32px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)]'
                            : 'w-full max-w-3xl mx-auto h-[54px] px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_16px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]',
                    )}
                >
                    <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-full" />

                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                        <div className={cn(
                            'transition-transform duration-300',
                            scrolled ? 'scale-90' : 'scale-100',
                            'group-hover:scale-105',
                        )}>
                            <LogoMark size={scrolled ? 28 : 34} />
                        </div>
                        <div className="flex flex-col leading-none gap-[1px]">
                            <span className={cn(
                                'font-bold tracking-tight font-display text-slate-900',
                                'transition-[font-size] duration-300',
                                scrolled ? 'text-[13px]' : 'text-[15px]',
                            )}>
                                mr<span className="text-teal-600">sergio</span>
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 tracking-[0.2em]">.dev</span>
                        </div>
                    </Link>

                    {/* NAV DESKTOP */}
                    <nav className="hidden md:flex items-center gap-0.5">
                        {navLinks.map(link => {
                            const isActive = url === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'relative px-3.5 py-[7px] rounded-xl text-[13px] font-medium',
                                        'transition-colors duration-200',
                                        isActive ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800',
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-pill-indicator"
                                            className={cn(
                                                'absolute inset-0 rounded-xl',
                                                scrolled
                                                    ? 'bg-teal-500/[0.09] border border-teal-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]'
                                                    : 'bg-teal-50/80 border border-teal-100/70',
                                            )}
                                            style={{ zIndex: -1 }}
                                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                        />
                                    )}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* CTA */}
                    <div className="hidden md:flex items-center">
                        <Link
                            href="/contact"
                            className={cn(
                                'inline-flex items-center gap-1.5 font-semibold text-white bg-teal-600 rounded-xl',
                                'transition-all duration-300',
                                scrolled
                                    ? 'px-3.5 py-1.5 text-[12px] shadow-[0_2px_8px_rgba(29,158,117,0.28)]'
                                    : 'px-4 py-2 text-[13px] shadow-[0_2px_12px_rgba(29,158,117,0.24)]',
                                'hover:bg-teal-700 hover:shadow-[0_4px_20px_rgba(29,158,117,0.38)]',
                            )}
                        >
                            Me contacter
                        </Link>
                    </div>

                    {/* HAMBURGER */}
                    <button
                        onClick={() => setMenuOpen(v => !v)}
                        aria-label={menuOpen ? 'Fermer' : 'Menu'}
                        className={cn(
                            'md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-xl',
                            'transition-colors duration-200',
                            scrolled ? 'hover:bg-white/50' : 'hover:bg-slate-100/70',
                        )}
                    >
                        <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} className="block w-[18px] h-[1.5px] bg-slate-700 rounded-full origin-center" />
                        <motion.span animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.16 }} className="block w-[18px] h-[1.5px] bg-slate-700 rounded-full" />
                        <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} className="block w-[18px] h-[1.5px] bg-slate-700 rounded-full origin-center" />
                    </button>
                </motion.header>

                {/* MOBILE MENU */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            key="mobile-menu"
                            variants={mobileMenuVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className={cn(
                                'absolute top-full inset-x-4 mt-2 rounded-2xl overflow-hidden',
                                'bg-white/72 backdrop-blur-[24px] backdrop-saturate-[1.6]',
                                'border border-white/55',
                                'shadow-[inset_0_1.5px_0_rgba(255,255,255,0.75),0_20px_60px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)]',
                            )}
                        >
                            <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />
                            <div className="p-3 space-y-1">
                                {navLinks.map((link, i) => {
                                    const isActive = url === link.href;
                                    return (
                                        <motion.div key={link.href} custom={i} variants={mobileItemVariants} initial="hidden" animate="visible">
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                                                    isActive
                                                        ? 'bg-teal-500/[0.08] text-teal-700 border border-teal-400/20'
                                                        : 'text-slate-600 hover:bg-white/50 hover:text-slate-900',
                                                )}
                                            >
                                                {link.label}
                                                {isActive && <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                <motion.div custom={navLinks.length} variants={mobileItemVariants} initial="hidden" animate="visible" className="pt-1">
                                    <Link href="/contact" className="flex items-center justify-center w-full bg-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-[0_2px_8px_rgba(29,158,117,0.25)]">
                                        Me contacter
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Spacer */}
            <div className="h-16" />

            <main>{children}</main>

            {/* ── FOOTER — Deep forest green ──────────────────────── */}
            <footer className="relative overflow-hidden bg-[#0F1A17]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-32 bg-teal-500/[0.06] rounded-full blur-[80px] pointer-events-none" />
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundSize: '128px 128px',
                    }}
                />

                <div className="container-main relative z-10 pt-16 pb-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 pb-10 border-b border-white/[0.06]">
                        {/* Brand */}
                        <div className="flex flex-col items-start gap-4 max-w-xs">
                            <Link href="/" className="flex items-center gap-2.5 group">
                                <div className="transition-transform duration-300 group-hover:scale-105">
                                    <LogoMark size={30} />
                                </div>
                                <div className="flex flex-col leading-none gap-[1px]">
                                    <span className="font-bold text-[14px] text-white/90 tracking-tight font-display">
                                        mr<span className="text-teal-400">sergio</span>
                                    </span>
                                    <span className="text-[9px] font-mono text-white/25 tracking-[0.2em]">.dev</span>
                                </div>
                            </Link>
                            <p className="text-[13px] text-white/30 leading-relaxed">
                                Développeur Full Stack passionné. Je crée des expériences web performantes et soignées.
                            </p>
                        </div>

                        {/* Navigation columns */}
                        <div className="flex gap-16">
                            <div>
                                <p className="text-[10px] font-semibold text-teal-400/60 uppercase tracking-[0.2em] mb-4">Navigation</p>
                                <ul className="space-y-2.5">
                                    {footerLinks.map(link => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-[13px] text-white/40 hover:text-teal-400 transition-colors duration-200 font-medium"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-teal-400/60 uppercase tracking-[0.2em] mb-4">Contact</p>
                                <ul className="space-y-2.5">
                                    <li>
                                        <a href="mailto:contact@mrsergio.dev" className="text-[13px] text-white/40 hover:text-teal-400 transition-colors duration-200 font-medium font-mono">
                                            contact@mrsergio.dev
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-2 pt-2">
                                        {footerSocials.map(social => (
                                            <a
                                                key={social.label}
                                                href={social.href}
                                                target={social.href.startsWith('mailto') ? undefined : '_blank'}
                                                rel="noreferrer"
                                                aria-label={social.label}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl text-white/30 hover:text-teal-400 bg-white/[0.04] border border-white/[0.06] hover:border-teal-500/20 hover:bg-teal-500/[0.06] transition-all duration-200"
                                            >
                                                {social.icon}
                                            </a>
                                        ))}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
                        <p className="text-[11px] text-white/15 font-medium">
                            © {new Date().getFullYear()} Sergio Junior Chebeu — Tous droits réservés.
                        </p>
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-50" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500" />
                            </span>
                            <span className="text-[11px] text-white/20 font-medium">Disponible pour de nouveaux projets</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}