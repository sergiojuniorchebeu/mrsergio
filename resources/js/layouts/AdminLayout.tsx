// resources/js/layouts/AdminLayout.tsx
// Coquille de l'admin : barre latérale groupée (pastilles « à traiter »), barre du haut
// qui affiche le module courant et la page, tiroir sur mobile, notifications flash.

import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
    ChevronRight,
    Code2,
    ExternalLink,
    FileText,
    GraduationCap,
    LayoutGrid,
    LogOut,
    Mail,
    Menu,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/portofolio/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
    children: React.ReactNode;
    title?: string;
    breadcrumb?: { label: string; href?: string }[];
}

interface AdminCounts {
    messages: number;
    enrollments: number;
}

interface NavLink {
    label: string;
    href: string;
    exact?: boolean;
    /** Autres préfixes d'URL qui appartiennent au même module. */
    matches?: string[];
    countKey?: keyof AdminCounts;
}

interface NavItem extends NavLink {
    icon: LucideIcon;
    children?: NavLink[];
}

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
    {
        label: 'Général',
        items: [
            {
                label: "Vue d'ensemble",
                href: '/admin',
                exact: true,
                icon: LayoutGrid,
            },
        ],
    },
    {
        label: 'Contenu',
        items: [
            { label: 'Projets', href: '/admin/projects', icon: Code2 },
            { label: 'Blog', href: '/admin/blog', icon: FileText },
            {
                label: 'Formations',
                href: '/admin/formations',
                matches: ['/admin/formation-enrollments'],
                icon: GraduationCap,
                countKey: 'enrollments',
                children: [
                    {
                        label: 'Catalogue & sessions',
                        href: '/admin/formations',
                    },
                    {
                        label: 'Inscriptions',
                        href: '/admin/formation-enrollments',
                        countKey: 'enrollments',
                    },
                ],
            },
        ],
    },
    {
        label: 'Boîte de réception',
        items: [
            {
                label: 'Messages',
                href: '/admin/messages',
                icon: Mail,
                countKey: 'messages',
            },
        ],
    },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

function pathOf(url: string): string {
    return url.split(/[?#]/)[0];
}

function matchesLink(link: NavLink, url: string): boolean {
    const path = pathOf(url);

    if (link.exact) {
        return path === link.href;
    }

    return [link.href, ...(link.matches ?? [])].some(
        (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    );
}

function LogoMark({ size = 22 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden
        >
            <polygon
                points="32,3 58,17 58,47 32,61 6,47 6,17"
                fill="#1D9E75"
                fillOpacity="0.12"
            />
            <polygon
                points="32,3 58,17 58,47 32,61 6,47 6,17"
                fill="none"
                stroke="#1D9E75"
                strokeWidth="1.5"
            />
            <path
                d="M20 24Q20 18 26 18L38 18Q44 18 44 24Q44 30 32 34Q20 38 20 44Q20 50 26 50L38 50Q44 50 44 44"
                stroke="#1D9E75"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
            />
            <circle cx="54" cy="17" r="5" fill="#1D9E75" />
        </svg>
    );
}

function CountBadge({
    count,
    isActive,
}: {
    count?: number;
    isActive?: boolean;
}) {
    if (!count) {
        return null;
    }

    return (
        <span
            className={cn(
                'ml-auto min-w-5 rounded-full px-1.5 py-0.5 text-center font-mono text-[10px] leading-none font-semibold tabular-nums',
                isActive
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-200/80 text-slate-600',
            )}
        >
            {count > 99 ? '99+' : count}
        </span>
    );
}

// ─── Notification flash ──────────────────────────────────────────────────────
function FlashToast({
    type,
    message,
}: {
    type: 'success' | 'error';
    message: string;
}) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShow(false), 4500);

        return () => clearTimeout(timer);
    }, [message]);

    if (!show) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            role="status"
            className={cn(
                'fixed top-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 overflow-hidden',
                'rounded-xl border bg-white px-4 py-3 text-[13px] font-medium text-slate-800',
                'shadow-[0_18px_40px_-16px_rgba(26,25,22,0.35)]',
                type === 'success' ? 'border-teal-200' : 'border-rose-200',
            )}
        >
            <motion.span
                aria-hidden
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4.5, ease: 'linear' }}
                className={cn(
                    'absolute inset-x-0 bottom-0 h-0.5 origin-left',
                    type === 'success' ? 'bg-teal-500' : 'bg-rose-500',
                )}
            />
            <span
                aria-hidden
                className={cn(
                    'mt-1 h-2 w-2 shrink-0 rounded-full',
                    type === 'success' ? 'bg-teal-500' : 'bg-rose-500',
                )}
            />
            <span className="flex-1 leading-relaxed">{message}</span>
            <button
                type="button"
                onClick={() => setShow(false)}
                aria-label="Fermer"
                className="text-slate-300 transition-colors hover:text-slate-500"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </motion.div>
    );
}

// ─── Squelette exporté ───────────────────────────────────────────────────────
export function AdminSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="animate-pulse space-y-3 p-1">
            <div className="h-7 w-40 rounded-lg bg-slate-100" />
            <div className="my-4 h-px bg-slate-100" />
            {Array.from({ length: rows }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-100" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-2/3 rounded bg-slate-100" />
                        <div className="h-2.5 w-1/3 rounded bg-slate-100/60" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Barre latérale ──────────────────────────────────────────────────────────
function SidebarNav({
    url,
    counts,
    user,
    onNavigate,
}: {
    url: string;
    counts: AdminCounts | null;
    user?: { name: string; email: string };
    onNavigate?: () => void;
}) {
    const initials =
        user?.name
            ?.split(' ')
            .map((word) => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() ?? 'A';

    return (
        <div className="flex h-full flex-col">
            <Link
                href="/admin"
                onClick={onNavigate}
                className="flex items-center gap-2.5 px-5 pt-5 pb-6"
            >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white">
                    <LogoMark size={20} />
                </span>
                <span className="flex flex-col leading-none">
                    <span className="font-display text-[15px] font-bold tracking-tight text-slate-900">
                        mr<span className="text-teal-600">sergio</span>
                    </span>
                    <span className="mt-1 font-mono text-[10px] text-slate-400">
                        administration
                    </span>
                </span>
            </Link>

            <nav
                aria-label="Administration"
                className="flex-1 space-y-6 overflow-y-auto px-3"
            >
                {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                        <p className="mb-1.5 px-3 font-mono text-[10px] tracking-[0.12em] text-slate-400 uppercase">
                            {group.label}
                        </p>
                        <ul className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = matchesLink(item, url);
                                const Icon = item.icon;
                                const count = item.countKey
                                    ? counts?.[item.countKey]
                                    : undefined;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={onNavigate}
                                            aria-current={
                                                isActive ? 'page' : undefined
                                            }
                                            className={cn(
                                                'relative flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium transition-colors',
                                                isActive
                                                    ? 'text-slate-900'
                                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                                            )}
                                        >
                                            {isActive && (
                                                <motion.span
                                                    layoutId="admin-nav-active"
                                                    transition={{
                                                        type: 'spring',
                                                        stiffness: 500,
                                                        damping: 40,
                                                    }}
                                                    className="absolute inset-0 rounded-lg bg-slate-100"
                                                />
                                            )}
                                            <Icon
                                                className={cn(
                                                    'relative h-4 w-4 shrink-0',
                                                    isActive
                                                        ? 'text-teal-600'
                                                        : 'text-slate-400',
                                                )}
                                            />
                                            <span className="relative">
                                                {item.label}
                                            </span>
                                            {!(isActive && item.children) && (
                                                <span className="relative ml-auto">
                                                    <CountBadge
                                                        count={count}
                                                        isActive={isActive}
                                                    />
                                                </span>
                                            )}
                                        </Link>

                                        {isActive && item.children && (
                                            <ul className="mt-0.5 mb-1 ml-[21px] space-y-0.5 border-l border-slate-200 pl-3">
                                                {item.children.map((child) => {
                                                    const isChildActive =
                                                        matchesLink(child, url);

                                                    return (
                                                        <li key={child.href}>
                                                            <Link
                                                                href={
                                                                    child.href
                                                                }
                                                                onClick={
                                                                    onNavigate
                                                                }
                                                                className={cn(
                                                                    'flex items-center rounded-md px-2.5 py-1.5 text-[13px] transition-colors',
                                                                    isChildActive
                                                                        ? 'font-semibold text-slate-900'
                                                                        : 'text-slate-500 hover:text-slate-900',
                                                                )}
                                                            >
                                                                {child.label}
                                                                <CountBadge
                                                                    count={
                                                                        child.countKey
                                                                            ? counts?.[
                                                                                  child
                                                                                      .countKey
                                                                              ]
                                                                            : undefined
                                                                    }
                                                                    isActive={
                                                                        isChildActive
                                                                    }
                                                                />
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="space-y-1 border-t border-slate-200 p-3">
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                    Voir le site
                </a>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                        {initials}
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                        <span className="block truncate text-[13px] font-semibold text-slate-900">
                            {user?.name ?? 'Admin'}
                        </span>
                        <span className="block truncate text-[11px] text-slate-400">
                            {user?.email}
                        </span>
                    </span>
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        title="Déconnexion"
                        aria-label="Déconnexion"
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Layout ──────────────────────────────────────────────────────────────────
export default function AdminLayout({ children, title, breadcrumb }: Props) {
    const { url, props } = usePage<{
        auth: { user: { name: string; email: string } };
        flash: { success?: string; error?: string };
        adminCounts: AdminCounts | null;
    }>();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const flash = props.flash ?? {};
    const counts = props.adminCounts ?? null;
    const module = ALL_ITEMS.find((item) => matchesLink(item, url));
    const ModuleIcon = module?.icon ?? LayoutGrid;

    const trail = (breadcrumb ?? (title ? [{ label: title }] : [])).filter(
        (crumb) => crumb.label !== module?.label,
    );

    return (
        <div className="min-h-screen bg-white">
            <AnimatePresence mode="wait">
                {flash.success && (
                    <FlashToast
                        key={`s-${flash.success}`}
                        type="success"
                        message={flash.success}
                    />
                )}
                {flash.error && (
                    <FlashToast
                        key={`e-${flash.error}`}
                        type="error"
                        message={flash.error}
                    />
                )}
            </AnimatePresence>

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
                <SidebarNav url={url} counts={counts} user={props.auth?.user} />
            </aside>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        key="admin-menu"
                        className="fixed inset-0 z-50 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{
                                duration: 0.3,
                                ease: [0.23, 1, 0.32, 1],
                            }}
                            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl"
                        >
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Fermer le menu"
                                className="absolute top-5 right-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <SidebarNav
                                url={url}
                                counts={counts}
                                user={props.auth?.user}
                                onNavigate={() => setIsMenuOpen(false)}
                            />
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Ouvrir le menu"
                        className="-ml-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <nav
                        aria-label="Fil d'Ariane"
                        className="flex min-w-0 flex-1 items-center gap-2"
                    >
                        <Link
                            href={module?.href ?? '/admin'}
                            className="flex shrink-0 items-center gap-2.5"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                                <ModuleIcon className="h-4 w-4" />
                            </span>
                            <span
                                className={cn(
                                    'font-display text-[15px] font-semibold',
                                    trail.length > 0
                                        ? 'hidden text-slate-500 hover:text-slate-900 sm:inline'
                                        : 'text-slate-900',
                                )}
                            >
                                {module?.label ?? 'Administration'}
                            </span>
                        </Link>
                        {trail.map((crumb, index) => {
                            const isLast = index === trail.length - 1;

                            return (
                                <span
                                    key={`${crumb.label}-${index}`}
                                    className={cn(
                                        'flex min-w-0 items-center gap-2',
                                        !isLast && 'hidden md:flex',
                                    )}
                                >
                                    <ChevronRight
                                        className={cn(
                                            'h-3.5 w-3.5 shrink-0 text-slate-300',
                                            index === 0 && 'hidden sm:block',
                                        )}
                                    />
                                    {crumb.href && !isLast ? (
                                        <Link
                                            href={crumb.href}
                                            className="truncate text-[14px] text-slate-500 hover:text-slate-900"
                                        >
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span
                                            aria-current={
                                                isLast ? 'page' : undefined
                                            }
                                            className="truncate font-display text-[15px] font-semibold text-slate-900"
                                        >
                                            {crumb.label}
                                        </span>
                                    )}
                                </span>
                            );
                        })}
                    </nav>

                    <div className="flex shrink-0 items-center gap-2">
                        <ThemeToggle />
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className={buttonVariants({
                                variant: 'outline',
                                size: 'sm',
                                className: 'hidden sm:inline-flex',
                            })}
                        >
                            Voir le site
                        </a>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    <div className="mx-auto w-full max-w-6xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
