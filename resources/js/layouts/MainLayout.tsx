import { Link, usePage } from '@inertiajs/react';
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useScroll,
} from 'framer-motion';
import {
    FolderKanban,
    GraduationCap,
    House,
    Menu,
    PenLine,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { CookieNotice } from '@/components/portofolio/cookie-notice';
import { FooterWordmark } from '@/components/portofolio/footer-wordmark';
import { LiveEventDot } from '@/components/portofolio/live-event';
import { ThemeSelect, ThemeToggle } from '@/components/portofolio/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { LanguageSelect, LanguageToggle, useTranslation } from '@/lib/i18n';
import { cn, easings } from '@/lib/utils';

interface Props {
    children: ReactNode;
}

const navLinks = [
    { href: '/', label: 'nav.home' },
    { href: '/projects', label: 'nav.projects' },
    { href: '/blog', label: 'nav.blog' },
    { href: '/formations', label: 'nav.trainings' },
] as const;

const bottomNavLinks = [
    { href: '/', label: 'nav.home', icon: House },
    { href: '/projects', label: 'nav.projects', icon: FolderKanban },
    { href: '/blog', label: 'nav.blog', icon: PenLine },
    { href: '/formations', label: 'nav.trainings', icon: GraduationCap },
] as const;

const footerLinks = [
    { href: '/projects', label: 'nav.projects' },
    { href: '/blog', label: 'nav.blog' },
    { href: '/formations', label: 'nav.trainings' },
] as const;

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

/**
 * Libellé de la barre du bas : masqué une fois la page défilée (icônes seules).
 */
function BottomBarLabel({
    isVisible,
    children,
}: {
    isVisible: boolean;
    children: ReactNode;
}) {
    return (
        <AnimatePresence initial={false}>
            {isVisible && (
                <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: easings.smooth }}
                    className="relative overflow-hidden leading-none"
                >
                    {children}
                </motion.span>
            )}
        </AnimatePresence>
    );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
function isActiveLink(url: string, href: string): boolean {
    return href === '/' ? url === '/' : url.startsWith(href);
}

export default function MainLayout({ children }: Props) {
    const { url } = usePage();
    const { t, l } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [hostingLogoFailed, setHostingLogoFailed] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const [isPastTop, setIsPastTop] = useState(false);
    const [isBottomBarHidden, setIsBottomBarHidden] = useState(false);
    const [isBottomBarCompact, setIsBottomBarCompact] = useState(false);
    const scrollIdleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const isMobile = useIsMobile();
    const closeMenu = () => setMenuOpen(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (current) => {
        const previous = scrollY.getPrevious() ?? 0;
        // Un petit seuil évite que la barre clignote sur les micro-mouvements du doigt ou du pavé tactile.
        const isScrollingDown = current - previous > 2;
        const isScrollingUp = previous - current > 2;
        const isNearPageBottom =
            document.documentElement.scrollHeight -
                (current + window.innerHeight) <
            160;
        const shouldHide =
            !menuOpen &&
            current > 80 &&
            (isScrollingDown || (navHidden && !isScrollingUp));

        setScrolled(current > 12);
        setIsPastTop(current > 80);
        setNavHidden(shouldHide);
        setIsBottomBarCompact(current > 320);
        setIsBottomBarHidden(shouldHide && !isNearPageBottom);

        // La barre du bas revient dès que l'on arrête de faire défiler.
        clearTimeout(scrollIdleTimer.current);
        scrollIdleTimer.current = setTimeout(
            () => setIsBottomBarHidden(false),
            900,
        );
    });

    useEffect(() => () => clearTimeout(scrollIdleTimer.current), []);

    // Sur mobile, la barre du haut ne sert qu'en haut de page : la barre du bas contient tout.
    const isTopBarHidden = !menuOpen && (navHidden || (isMobile && isPastTop));
    const showBottomLabels = menuOpen || !isBottomBarCompact;
    const [hoveredHref, setHoveredHref] = useState<string | null>(null);
    const activeHref =
        navLinks.find((link) => isActiveLink(url, link.href))?.href ?? null;

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    return (
        <div className="min-h-screen bg-[#171511] dark:bg-[#0b0a09]">
            {/* ══ NAV ═══════════════════════════════════════════════════════ */}
            <motion.div
                className="fixed inset-x-0 top-0 z-50 px-4 pt-3"
                animate={{ y: isTopBarHidden ? '-120%' : '0%' }}
                transition={{ duration: 0.22, ease: easings.smooth }}
            >
                <motion.div
                    className="mx-auto w-full"
                    initial={false}
                    animate={{ maxWidth: scrolled && !isMobile ? 880 : 1024 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                >
                    <header
                        className={cn(
                            'grid grid-cols-[1fr_auto] items-center gap-2 rounded-full border pr-1.5 pl-4 transition-[height,background-color,box-shadow,border-color] duration-300 md:grid-cols-[1fr_auto_1fr] md:pl-5',
                            scrolled
                                ? 'h-[52px] border-slate-200 bg-white/90 shadow-[0_14px_34px_-16px_rgba(26,25,22,0.28)] backdrop-blur-xl'
                                : 'h-14 border-slate-200/70 bg-white/70 shadow-[0_1px_2px_rgba(26,25,22,0.04)] backdrop-blur-md',
                        )}
                    >
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className="flex w-fit items-center gap-2.5"
                        >
                            <motion.span
                                animate={{ rotate: scrolled ? -12 : 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 20,
                                }}
                            >
                                <LogoMark size={26} />
                            </motion.span>
                            <AnimatePresence initial={false}>
                                {(!scrolled || isMobile) && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: easings.smooth,
                                        }}
                                        className="overflow-hidden font-display text-[14px] font-bold tracking-tight whitespace-nowrap text-slate-900"
                                    >
                                        mr
                                        <span className="text-teal-600">
                                            sergio
                                        </span>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        <nav
                            className="hidden items-center md:flex"
                            onMouseLeave={() => setHoveredHref(null)}
                        >
                            {navLinks.map((link) => {
                                const isActive = isActiveLink(url, link.href);
                                const isHighlighted =
                                    (hoveredHref ?? activeHref) === link.href;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={closeMenu}
                                        onMouseEnter={() =>
                                            setHoveredHref(link.href)
                                        }
                                        onFocus={() =>
                                            setHoveredHref(link.href)
                                        }
                                        className={cn(
                                            'relative rounded-full px-4 py-2 font-display text-[13px] font-semibold transition-colors duration-200',
                                            isHighlighted
                                                ? 'text-slate-900'
                                                : 'text-slate-500',
                                        )}
                                    >
                                        {isHighlighted && (
                                            <motion.span
                                                layoutId="nav-highlight"
                                                className="absolute inset-0 rounded-full bg-slate-100"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 500,
                                                    damping: 38,
                                                }}
                                            />
                                        )}
                                        <span className="relative">
                                            {t(link.label)}
                                        </span>
                                        {link.href === '/formations' && (
                                            <LiveEventDot className="absolute top-1.5 right-2" />
                                        )}
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-active-dot"
                                                className="absolute inset-x-0 bottom-1 mx-auto h-1 w-1 rounded-full bg-teal-500"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 420,
                                                    damping: 32,
                                                }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex items-center justify-end gap-1">
                            <LanguageToggle />
                            <ThemeToggle />
                            <Link
                                href="/contact"
                                onClick={closeMenu}
                                className={buttonVariants({
                                    size: 'sm',
                                    className: 'rounded-full',
                                })}
                            >
                                <span className="md:hidden">
                                    {t('nav.contact')}
                                </span>
                                <span className="hidden md:inline">
                                    {t('nav.contact_me')}
                                </span>
                            </Link>
                        </div>
                    </header>
                </motion.div>
            </motion.div>

            {/* ══ MENU PLEIN ÉCRAN (mobile) ═══════════════════════════════ */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ clipPath: 'circle(0% at 90% 94%)' }}
                        animate={{ clipPath: 'circle(150% at 90% 94%)' }}
                        exit={{ clipPath: 'circle(0% at 90% 94%)' }}
                        transition={{ duration: 0.6, ease: easings.expo }}
                        className="theme-lock fixed inset-0 z-[60] flex flex-col justify-between bg-[#171511] px-6 pt-24 pb-32 md:hidden"
                    >
                        <nav className="flex flex-col gap-1">
                            {[
                                ...navLinks,
                                {
                                    href: '/contact',
                                    label: 'nav.contact' as const,
                                },
                            ].map((link, i) => (
                                <span
                                    key={link.href}
                                    className="block overflow-hidden"
                                >
                                    <motion.span
                                        className="block"
                                        initial={{ y: '110%' }}
                                        animate={{ y: 0 }}
                                        exit={{ y: '110%' }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.12 + i * 0.05,
                                            ease: easings.expo,
                                        }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={closeMenu}
                                            className={cn(
                                                'flex items-baseline gap-4 py-1 font-display text-[44px] leading-tight font-bold tracking-[-0.04em] transition-colors active:text-teal-300',
                                                isActiveLink(url, link.href)
                                                    ? 'text-teal-400'
                                                    : 'text-white',
                                            )}
                                        >
                                            <span className="font-mono text-[11px] font-normal tracking-normal text-white/30">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            {t(link.label)}
                                            {link.href === '/formations' && (
                                                <LiveEventDot className="self-center" />
                                            )}
                                        </Link>
                                    </motion.span>
                                </span>
                            ))}
                        </nav>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.4,
                                ease: easings.smooth,
                            }}
                            className="flex flex-col gap-5"
                        >
                            <div className="flex flex-wrap gap-2">
                                <LanguageSelect />
                                <ThemeSelect />
                            </div>
                            <a
                                href="mailto:contact@mrsergio.dev"
                                className="font-mono text-[14px] text-white/60"
                            >
                                contact@mrsergio.dev
                            </a>
                            <div className="flex gap-3">
                                {socials
                                    .filter(
                                        (social) =>
                                            !social.href.startsWith('mailto'),
                                    )
                                    .map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={buttonVariants({
                                                variant: 'dark',
                                                size: 'sm',
                                            })}
                                        >
                                            {social.icon}
                                            {social.label}
                                        </a>
                                    ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══ BARRE DU BAS (mobile, zone du pouce) ═══════════════════ */}
            <motion.nav
                aria-label={l('Navigation mobile', 'Mobile navigation')}
                initial={false}
                animate={{ y: isBottomBarHidden && !menuOpen ? '160%' : '0%' }}
                transition={{ duration: 0.22, ease: easings.smooth }}
                className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[70] flex justify-center px-3 md:hidden"
            >
                <motion.div
                    initial={false}
                    animate={{ maxWidth: showBottomLabels ? 520 : 252 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                    className={cn(
                        'flex w-full items-center gap-1 rounded-full border p-1.5 backdrop-blur-xl transition-colors duration-300',
                        menuOpen
                            ? 'border-white/10 bg-white/10'
                            : 'border-slate-200/80 bg-white/85 shadow-[0_14px_34px_-14px_rgba(26,25,22,0.4)]',
                    )}
                >
                    {bottomNavLinks.map((link) => {
                        const isActive =
                            !menuOpen && isActiveLink(url, link.href);
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className={cn(
                                    'relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-semibold transition-[height,color,transform] duration-300 active:scale-90',
                                    showBottomLabels ? 'h-12' : 'h-11',
                                    isActive
                                        ? 'text-white'
                                        : menuOpen
                                          ? 'text-white/55'
                                          : 'text-slate-500',
                                )}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="bottom-nav-active"
                                        className="absolute inset-0 rounded-full bg-slate-900"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 420,
                                            damping: 34,
                                        }}
                                    />
                                )}
                                <motion.span
                                    key={
                                        isActive
                                            ? `${link.href}-active`
                                            : link.href
                                    }
                                    className="relative"
                                    initial={isActive ? { scale: 0.7 } : false}
                                    animate={
                                        isActive
                                            ? { scale: [0.7, 1.18, 1] }
                                            : { scale: 1 }
                                    }
                                    transition={{
                                        duration: 0.45,
                                        ease: easings.smooth,
                                    }}
                                >
                                    <Icon
                                        className="h-[18px] w-[18px]"
                                        strokeWidth={1.8}
                                    />
                                    {link.href === '/formations' && (
                                        <LiveEventDot className="absolute -top-0.5 -right-1" />
                                    )}
                                </motion.span>
                                <BottomBarLabel isVisible={showBottomLabels}>
                                    {t(link.label)}
                                </BottomBarLabel>
                            </Link>
                        );
                    })}

                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label={
                            menuOpen
                                ? l('Fermer le menu', 'Close menu')
                                : l('Ouvrir le menu', 'Open menu')
                        }
                        aria-expanded={menuOpen}
                        className={cn(
                            'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-semibold transition-[height,color,background-color,transform] duration-300 active:scale-90',
                            showBottomLabels ? 'h-12' : 'h-11',
                            menuOpen
                                ? 'bg-teal-500 text-[#0b2a24]'
                                : 'text-slate-500',
                        )}
                    >
                        <motion.span
                            animate={{ rotate: menuOpen ? 90 : 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 24,
                            }}
                        >
                            {menuOpen ? (
                                <X
                                    className="h-[18px] w-[18px]"
                                    strokeWidth={1.8}
                                />
                            ) : (
                                <Menu
                                    className="h-[18px] w-[18px]"
                                    strokeWidth={1.8}
                                />
                            )}
                        </motion.span>
                        <BottomBarLabel isVisible={showBottomLabels}>
                            {menuOpen ? l('Fermer', 'Close') : 'Menu'}
                        </BottomBarLabel>
                    </button>
                </motion.div>
            </motion.nav>

            {/* ══ CONTENU ═══════════════════════════════════════════════════ */}
            <main className="relative z-10 overflow-clip rounded-b-[28px] bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] sm:rounded-b-[40px]">
                {children}
            </main>

            {/* ══ FOOTER ════════════════════════════════════════════════════ */}
            <footer className="theme-lock relative z-0 overflow-hidden bg-[#171511] pb-28 md:pb-0 dark:bg-[#0b0a09] [@media(min-width:1024px)_and_(min-height:780px)]:sticky [@media(min-width:1024px)_and_(min-height:780px)]:bottom-0">
                <div className="container-main relative pt-20 sm:pt-24">
                    <div className="grid gap-10 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:grid-cols-[minmax(0,1.2fr)_200px_240px]">
                        <div className="max-w-md">
                            <p className="font-display text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl">
                                {t('footer.idea')}
                            </p>
                            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/45">
                                {t('footer.description')}
                            </p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    href="/contact"
                                    className={buttonVariants()}
                                >
                                    {t('nav.contact_me')}
                                </Link>
                                <a
                                    href="mailto:contact@mrsergio.dev"
                                    className={buttonVariants({
                                        variant: 'dark',
                                        className: 'font-mono font-normal',
                                    })}
                                >
                                    contact@mrsergio.dev
                                </a>
                            </div>
                        </div>

                        <div>
                            <p className="mb-4 font-mono text-[11px] text-white/30">
                                {t('footer.explore')}
                            </p>
                            <ul className="space-y-2.5">
                                {footerLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[15px] text-white/55 transition-colors duration-200 hover:text-white"
                                        >
                                            {t(link.label)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="mb-4 font-mono text-[11px] text-white/30">
                                {t('footer.follow')}
                            </p>
                            <ul className="space-y-2.5">
                                {socials.map((social) => (
                                    <li key={social.label}>
                                        <a
                                            href={social.href}
                                            target={
                                                social.href.startsWith('mailto')
                                                    ? undefined
                                                    : '_blank'
                                            }
                                            rel="noreferrer"
                                            className="group inline-flex items-center gap-2.5 text-[15px] text-white/55 transition-colors duration-200 hover:text-white"
                                        >
                                            <span className="text-white/35 transition-colors group-hover:text-teal-400">
                                                {social.icon}
                                            </span>
                                            {social.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-6 text-[12px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {new Date().getFullYear()} Sergio Junior Chebeu ·
                            {t('footer.rights')} ·{' '}
                            <Link
                                href="/cookies"
                                className="transition-colors hover:text-white/70"
                            >
                                Cookies
                            </Link>
                        </p>
                        <ThemeSelect />
                        <a
                            href="https://www.kennhosting.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label={l(
                                'Site hébergé par KennHosting',
                                'Website hosted by KennHosting',
                            )}
                            className="group inline-flex w-fit items-center gap-2 transition-colors hover:text-white/70"
                        >
                            <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded text-[9px] font-black text-teal-300">
                                {hostingLogoFailed ? (
                                    'KH'
                                ) : (
                                    <img
                                        src="https://www.kennhosting.com/favicon.ico"
                                        alt=""
                                        className="h-full w-full object-contain"
                                        onError={() =>
                                            setHostingLogoFailed(true)
                                        }
                                    />
                                )}
                            </span>
                            {t('footer.hosted_by')} KennHosting
                        </a>
                    </div>
                </div>

                <div className="relative mt-6 sm:mt-10">
                    <FooterWordmark />
                </div>
            </footer>

            <CookieNotice />
        </div>
    );
}
