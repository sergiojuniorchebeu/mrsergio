import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { RevealText } from '@/components/ui/AnimatedText';
import { cn } from '@/lib/utils';

interface Props {
    children: ReactNode;
}

const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/projects', label: 'Projets' },
    { href: '/blog', label: 'Blog' },
    { href: '/formations', label: 'Formations' },
];

const footerLinks = [
    { href: '/projects', label: 'Projets' },
    { href: '/blog', label: 'Blog' },
    { href: '/formations', label: 'Formations' },
];

const footerNotes = [
    'Interfaces claires',
    'Architecture simple',
    'Produits qui tiennent',
];

const socials = [
    {
        label: 'GitHub',
        href: 'https://github.com/sergiojuniorchebeu',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden
            >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/sergiojuniorchebeu',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden
            >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: 'Email',
        href: 'mailto:contact@mrsergio.dev',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
            </svg>
        ),
    },
];

// ─── Logo SVG ─────────────────────────────────────────────────────────────────
function LogoMark({ size = 26 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden
        >
            <polygon
                points="16,2 28,9 28,23 16,30 4,23 4,9"
                fill="#1aa389"
                fillOpacity="0.14"
                stroke="#1aa389"
                strokeWidth="1.2"
            />
            <path
                d="M11 12.5Q11 9.5 14 9.5H18Q21 9.5 21 12.5Q21 15.5 16 17Q11 18.5 11 21.5Q11 24.5 14 24.5H18Q21 24.5 21 21.5"
                stroke="#1aa389"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
            />
            <circle cx="26" cy="9" r="3" fill="#1aa389" />
        </svg>
    );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function MainLayout({ children }: Props) {
    const { url } = usePage();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    // Scroll detection
    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 12);
                    ticking = false;
                });
                ticking = true;
            }
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    return (
        <div className="min-h-screen bg-surface">
            {/* ══ NAV ═══════════════════════════════════════════════════════ */}
            <div className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
                <div className="mx-auto w-full max-w-5xl">
                    <header
                        className={cn(
                            'flex items-center justify-between rounded-2xl border transition-all duration-300',
                            'bg-white/90 supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:backdrop-blur-md',
                            'border-slate-200/70',
                            scrolled
                                ? 'h-[52px] px-4 shadow-[0_8px_24px_rgba(15,23,42,0.09)]'
                                : 'h-[58px] px-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]',
                        )}
                    >
                        {/* Logo */}
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className="flex shrink-0 items-center gap-2.5"
                        >
                            <LogoMark size={scrolled ? 24 : 26} />
                            <div className="flex flex-col gap-[2px] leading-none">
                                <span className="font-display text-[13px] font-bold tracking-tight text-slate-900">
                                    mr
                                    <span className="text-teal-600">
                                        sergio
                                    </span>
                                </span>
                                <span className="font-mono text-[9px] tracking-[0.18em] text-slate-400">
                                    .dev
                                </span>
                            </div>
                        </Link>

                        {/* Séparateur */}
                        <div className="mx-1 hidden h-4 w-px bg-slate-200 md:block" />

                        {/* Desktop links */}
                        <nav className="hidden items-center gap-0.5 md:flex">
                            {navLinks.map((link) => {
                                const isActive =
                                    link.href === '/'
                                        ? url === '/'
                                        : url.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={closeMenu}
                                        className={cn(
                                            'relative rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors duration-150',
                                            isActive
                                                ? 'text-teal-700'
                                                : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-900',
                                        )}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-teal-500" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Séparateur */}
                        <div className="mx-1 hidden h-4 w-px bg-slate-200 md:block" />

                        {/* Desktop CTA */}
                        <div className="hidden md:block">
                            <Link
                                href="/contact"
                                onClick={closeMenu}
                                className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(26,163,137,0.2)_inset] transition-all duration-200 hover:bg-teal-700 hover:shadow-[0_2px_8px_rgba(26,163,137,0.25)]"
                            >
                                Me contacter
                            </Link>
                        </div>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label={
                                menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'
                            }
                            aria-expanded={menuOpen}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
                        >
                            <div className="relative h-[14px] w-[18px]">
                                <span
                                    className={cn(
                                        'absolute top-0 left-0 h-[1.5px] w-full rounded-full bg-current transition-all duration-200',
                                        menuOpen ? 'top-[6px] rotate-45' : '',
                                    )}
                                />
                                <span
                                    className={cn(
                                        'absolute top-[6px] left-0 h-[1.5px] w-full rounded-full bg-current transition-opacity duration-200',
                                        menuOpen ? 'opacity-0' : '',
                                    )}
                                />
                                <span
                                    className={cn(
                                        'absolute top-[12px] left-0 h-[1.5px] w-full rounded-full bg-current transition-all duration-200',
                                        menuOpen ? 'top-[6px] -rotate-45' : '',
                                    )}
                                />
                            </div>
                        </button>
                    </header>

                    {/* Mobile dropdown */}
                    {menuOpen && (
                        <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.10)] supports-[backdrop-filter]:backdrop-blur-md md:hidden">
                            <div className="space-y-1">
                                {navLinks.map((link) => {
                                    const isActive =
                                        link.href === '/'
                                            ? url === '/'
                                            : url.startsWith(link.href);
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={closeMenu}
                                            className={cn(
                                                'flex items-center justify-between rounded-lg px-4 py-3 text-[14px] font-medium transition-colors',
                                                isActive
                                                    ? 'border border-teal-100/80 bg-teal-50 text-teal-700'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                                            )}
                                        >
                                            {link.label}
                                            {isActive && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                                            )}
                                        </Link>
                                    );
                                })}
                                <div className="pt-1">
                                    <Link
                                        href="/contact"
                                        onClick={closeMenu}
                                        className="flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-teal-700"
                                    >
                                        Me contacter
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ══ CONTENU ═══════════════════════════════════════════════════ */}
            <main>{children}</main>

            {/* ══ FOOTER ════════════════════════════════════════════════════ */}
            <footer className="relative overflow-hidden border-t border-white/[0.04] bg-[#171511]">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden select-none"
                >
                    <span
                        className="translate-y-8 font-display leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap text-slate-50/[0.03] uppercase"
                        style={{ fontSize: 'clamp(72px, 15vw, 220px)' }}
                    >
                        Mr Sergio
                    </span>
                </div>
                <div className="container-main py-16 sm:py-20">
                    <div className="border-b border-white/[0.08] pb-12 sm:pb-14">
                        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.75fr)] lg:items-end">
                            <div className="max-w-2xl">
                                <p className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-teal-400/90 uppercase">
                                    Signature
                                </p>
                                <h2 className="max-w-xl font-display text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                                    J&apos;aide a transformer des idees floues
                                    en produits solides.
                                </h2>
                                <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/46">
                                    Developpeur full stack, j&apos;aime les
                                    interfaces nettes, les architectures simples
                                    et les experiences qui restent lisibles
                                    longtemps apres le lancement.
                                </p>
                            </div>
                            <div className="max-w-sm lg:justify-self-end">
                                <p className="text-[11px] font-semibold tracking-[0.18em] text-white/26 uppercase">
                                    Contact
                                </p>
                                <a
                                    href="mailto:contact@mrsergio.dev"
                                    className="mt-4 inline-flex text-[15px] text-white/68 transition-colors duration-200 hover:text-white"
                                >
                                    contact@mrsergio.dev
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-10 border-b border-white/[0.08] py-10 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:py-12 lg:grid-cols-[minmax(0,1.1fr)_220px_260px]">
                        <div className="max-w-md">
                            <Link
                                href="/"
                                onClick={closeMenu}
                                className="flex items-center gap-2.5"
                            >
                                <LogoMark size={26} />
                                <span className="font-display text-[14px] font-bold tracking-tight text-white/80">
                                    mr
                                    <span className="text-teal-400">
                                        sergio
                                    </span>
                                    <span className="ml-px font-mono text-[10px] font-normal text-white/20">
                                        .dev
                                    </span>
                                </span>
                            </Link>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {footerNotes.map((note) => (
                                    <span
                                        key={note}
                                        className="rounded-md border border-white/[0.08] px-2.5 py-1 text-[11px] tracking-[0.14em] text-white/34 uppercase"
                                    >
                                        {note}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-white/26 uppercase">
                                Explorer
                            </p>
                            <ul className="space-y-2.5">
                                {footerLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={closeMenu}
                                            className="text-[14px] text-white/42 transition-colors duration-200 hover:text-white"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-white/26 uppercase">
                                Suivre
                            </p>
                            <div className="flex flex-col gap-3">
                                {socials.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target={
                                            social.href.startsWith('mailto')
                                                ? undefined
                                                : '_blank'
                                        }
                                        rel="noreferrer"
                                        className="group inline-flex items-center gap-3 text-[14px] text-white/42 transition-colors duration-200 hover:text-white"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-white/40 transition-colors duration-200 group-hover:border-white/[0.14] group-hover:text-teal-400">
                                            {social.icon}
                                        </span>
                                        <span>{social.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-6 text-[11px] text-white/20 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {new Date().getFullYear()} Sergio Junior Chebeu —
                            Tous droits reserves.
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                            <span>
                                Base au Cameroun • Disponible a distance
                            </span>
                            <a
                                href="https://www.kennhosting.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center font-medium text-white transition-colors duration-200 hover:text-teal-100"
                            >
                                <RevealText
                                    text="Heberge chez KennHosting"
                                    duration={0.65}
                                    className="inline-block"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
