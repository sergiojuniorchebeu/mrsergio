// resources/js/layouts/AdminLayout.tsx
import { Link, usePage, router }        from '@inertiajs/react';
import { motion, AnimatePresence }      from 'framer-motion';
import { useState, useEffect }          from 'react';
import { cn }                           from '@/lib/utils';

interface Props {
    children:    React.ReactNode;
    title?:      string;
    breadcrumb?: { label: string; href?: string }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ICÔNES SVG — clean, 16×16, stroke moderne
// ─────────────────────────────────────────────────────────────────────────────
const Icons = {
    // Vue d'ensemble — grille 2×2
    Dashboard: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden>
            <rect x="1.5" y="1.5" width="5" height="5" rx="1.5"/>
            <rect x="9.5" y="1.5" width="5" height="5" rx="1.5"/>
            <rect x="1.5" y="9.5" width="5" height="5" rx="1.5"/>
            <rect x="9.5" y="9.5" width="5" height="5" rx="1.5"/>
        </svg>
    ),
    // Projets — bracket code
    Projects: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden>
            <path d="M5.5 3.5L2 8l3.5 4.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 3.5L14 8l-3.5 4.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 2l-3 12" strokeLinecap="round"/>
        </svg>
    ),
    // Blog — document lignes
    Blog: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden>
            <rect x="2" y="1.5" width="12" height="13" rx="2"/>
            <path d="M5 5.5h6M5 8h6M5 10.5h4" strokeLinecap="round"/>
        </svg>
    ),
    // Formations — chapeau académique
    Formations: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden>
            <path d="M8 2.5L1.5 6 8 9.5 14.5 6 8 2.5z" strokeLinejoin="round"/>
            <path d="M4.5 7.5V11c0 1.5 1.5 2.5 3.5 2.5S11.5 12.5 11.5 11V7.5" strokeLinecap="round"/>
            <path d="M14.5 6v4" strokeLinecap="round"/>
        </svg>
    ),
    // Messages — enveloppe
    Messages: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden>
            <rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/>
            <path d="M1.5 3.5l6.5 5 6.5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    // Chevron droite
    ChevronRight: () => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden>
            <path d="M4.5 2.5L7.5 6l-3 3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    // Chevron gauche (collapse)
    ChevronLeft: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden>
            <path d="M9 3L5 7l4 4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    // Déconnexion
    Logout: () => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden>
            <path d="M10 5V3.5A1.5 1.5 0 008.5 2h-5A1.5 1.5 0 002 3.5v8A1.5 1.5 0 003.5 13h5A1.5 1.5 0 0010 11.5V10" strokeLinecap="round"/>
            <path d="M13 7.5H6m3.5-2.5L13 7.5l-3.5 2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    // Lien externe
    ExternalLink: () => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" strokeWidth="1.3" stroke="currentColor" aria-hidden>
            <path d="M2 10L10 2M10 2H5.5M10 2v4.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    // Burger
    Menu: () => (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" strokeWidth="1.5" stroke="currentColor" aria-hidden>
            <path d="M3 5h12M3 9h12M3 13h8" strokeLinecap="round"/>
        </svg>
    ),
    // Fermer (toast)
    Close: () => (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden>
            <path d="M2.5 2.5l8 8M10.5 2.5l-8 8" strokeLinecap="round"/>
        </svg>
    ),
    // Check (toast success)
    Check: () => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" strokeWidth="1.5" stroke="currentColor" aria-hidden>
            <circle cx="7.5" cy="7.5" r="6"/>
            <path d="M4.5 7.5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    // Erreur (toast error)
    AlertCircle: () => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" strokeWidth="1.5" stroke="currentColor" aria-hidden>
            <circle cx="7.5" cy="7.5" r="6"/>
            <path d="M7.5 4.5v3.5M7.5 10.5v.5" strokeLinecap="round"/>
        </svg>
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const navItems = [
    { label: "Vue d'ensemble", href: '/admin',            exact: true,  Icon: Icons.Dashboard   },
    { label: 'Projets',        href: '/admin/projects',   exact: false, Icon: Icons.Projects    },
    { label: 'Blog',           href: '/admin/blog',       exact: false, Icon: Icons.Blog        },
    { label: 'Formations',     href: '/admin/formations', exact: false, Icon: Icons.Formations  },
    { label: 'Messages',       href: '/admin/messages',   exact: false, Icon: Icons.Messages    },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const isActive = (href: string, url: string, exact: boolean) =>
    exact ? url === href : url.startsWith(href)

const logout = () => router.post('/logout')

// ─────────────────────────────────────────────────────────────────────────────
// LOGO MARK SVG
// ─────────────────────────────────────────────────────────────────────────────
function LogoMark({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="mrsergio">
            <polygon points="32,3 58,17 58,47 32,61 6,47 6,17" fill="#1D9E75" fillOpacity="0.12"/>
            <polygon points="32,3 58,17 58,47 32,61 6,47 6,17" fill="none" stroke="#1D9E75" strokeWidth="1.5"/>
            <path d="M20 24Q20 18 26 18L38 18Q44 18 44 24Q44 30 32 34Q20 38 20 44Q20 50 26 50L38 50Q44 50 44 44"
                stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <circle cx="54" cy="17" r="5" fill="#1D9E75"/>
        </svg>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON LOADER exporté
// ─────────────────────────────────────────────────────────────────────────────
export function AdminSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="animate-pulse space-y-3 p-1">
            <div className="h-7 w-40 bg-slate-200 rounded-lg"/>
            <div className="h-px bg-slate-100 my-4"/>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-200 rounded-xl flex-shrink-0"/>
                    <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-slate-200 rounded w-2/3"/>
                        <div className="h-3 bg-slate-100 rounded w-1/3"/>
                    </div>
                    <div className="h-7 w-14 bg-slate-200 rounded-lg flex-shrink-0"/>
                </div>
            ))}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// FLASH TOAST
// ─────────────────────────────────────────────────────────────────────────────
function FlashToast({ type, message }: { type: 'success' | 'error'; message: string }) {
    const [show, setShow] = useState(true)

    useEffect(() => {
        const t = setTimeout(() => setShow(false), 4500)
        return () => clearTimeout(t)
    }, [message])

    if (!show) return null

    const isSuccess = type === 'success'

    return (
        <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
            className={cn(
                'fixed top-4 right-4 z-[100] flex items-start gap-3',
                'px-4 py-3 rounded-xl shadow-lg max-w-sm w-full',
                'border backdrop-blur-sm text-[13px] font-medium',
                isSuccess
                    ? 'bg-white border-teal-200/80 text-slate-800 shadow-teal-100'
                    : 'bg-white border-red-200/80 text-slate-800 shadow-red-100',
            )}
        >
            <span className={isSuccess ? 'text-teal-600 mt-[1px] flex-shrink-0' : 'text-red-500 mt-[1px] flex-shrink-0'}>
                {isSuccess ? <Icons.Check /> : <Icons.AlertCircle />}
            </span>
            <span className="flex-1 leading-relaxed">{message}</span>
            <button
                onClick={() => setShow(false)}
                aria-label="Fermer"
                className="flex-shrink-0 text-slate-300 hover:text-slate-500 transition-colors mt-[1px]"
            >
                <Icons.Close />
            </button>
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminLayout({ children, title, breadcrumb }: Props) {
    const { url, props } = usePage<{
        auth:  { user: { name: string; email: string } }
        flash: { success?: string; error?: string }
    }>()

    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed,  setCollapsed]  = useState(false)
    const flash = props.flash ?? {}
    const user  = props.auth?.user

    // Initiales sur 2 lettres
    const initials = user?.name
        ?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? 'A'

    // Ferme le menu mobile au changement de route
    useEffect(() => {
        const id = setTimeout(() => setMobileOpen(false), 0)
        return () => clearTimeout(id)
    }, [url])

    // Bloque le scroll quand mobile ouvert
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    // Largeur sidebar
    const sidebarW = collapsed ? 60 : 220

    return (
        <div className="min-h-screen bg-[#f5f6fa] flex">

            {/* ── FLASH ────────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {flash.success && <FlashToast key={`s-${flash.success}`} type="success" message={flash.success}/>}
                {flash.error   && <FlashToast key={`e-${flash.error}`}   type="error"   message={flash.error}/>}
            </AnimatePresence>

            {/* ── OVERLAY MOBILE ───────────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 z-20 bg-black/30 backdrop-blur-[2px] lg:hidden"
                        aria-hidden
                    />
                )}
            </AnimatePresence>

            {/* ════════════════════════════════════════════════════════════
                SIDEBAR LIGHT — pleine hauteur, border-r fine
                ════════════════════════════════════════════════════════════ */}
            <aside
                style={{ width: sidebarW }}
                className={cn(
                    // Positionnement : fixe en mobile, static sticky en desktop
                    'fixed top-0 left-0 z-30 h-full',
                    'lg:sticky lg:top-0 lg:h-screen lg:z-auto',
                    // Fond blanc + border droite
                    'bg-white border-r border-slate-200/80',
                    'flex flex-col',
                    // Transition smooth largeur + slide mobile
                    'transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                    'lg:translate-x-0',
                    mobileOpen ? 'translate-x-0 shadow-[2px_0_24px_rgba(0,0,0,0.08)]' : '-translate-x-full',
                    // Toujours 220px sur mobile (pas de collapse)
                    'w-[220px] lg:w-auto',
                )}
            >
                {/* ─── HEADER SIDEBAR ───────────────────────────────── */}
                <div className={cn(
                    'h-[60px] flex items-center flex-shrink-0',
                    'border-b border-slate-100',
                    collapsed ? 'justify-center px-3' : 'justify-between px-4',
                )}>
                    {!collapsed ? (
                        <Link href="/" className="flex items-center gap-2.5 group min-w-0">
                            <LogoMark size={22}/>
                            <div className="flex flex-col leading-none min-w-0">
                                <span className="text-[13px] font-bold text-slate-900 tracking-tight">
                                    mr<span className="text-teal-600">sergio</span>
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 tracking-[0.18em] mt-[2px]">
                                    .dev / admin
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <Link href="/" title="mrsergio.dev">
                            <LogoMark size={20}/>
                        </Link>
                    )}

                    {/* Collapse — desktop seulement */}
                    <button
                        onClick={() => setCollapsed(v => !v)}
                        className={cn(
                            'hidden lg:flex w-6 h-6 items-center justify-center rounded-lg',
                            'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
                            'transition-all duration-150',
                            collapsed && 'mt-8',
                        )}
                        aria-label={collapsed ? 'Étendre' : 'Réduire'}
                    >
                        <motion.span
                            animate={{ rotate: collapsed ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex"
                        >
                            <Icons.ChevronLeft/>
                        </motion.span>
                    </button>
                </div>

                {/* ─── NAV ──────────────────────────────────────────── */}
                <nav className={cn(
                    'flex-1 overflow-y-auto overflow-x-hidden',
                    'py-3 space-y-0.5',
                    collapsed ? 'px-2' : 'px-3',
                )}>
                    {!collapsed && (
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.16em] px-2 mb-2 pt-1 select-none">
                            Gestion
                        </p>
                    )}

                    {navItems.map(({ label, href, exact, Icon }) => {
                        const active = isActive(href, url, exact)
                        return (
                            <Link
                                key={href}
                                href={href}
                                title={collapsed ? label : undefined}
                                className={cn(
                                    'relative flex items-center rounded-xl',
                                    'text-[13px] font-medium transition-all duration-150',
                                    'group',
                                    collapsed
                                        ? 'h-9 w-9 mx-auto justify-center'
                                        : 'gap-3 px-3 py-2.5',
                                    active
                                        ? 'bg-teal-50 text-teal-700'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50',
                                )}
                            >
                                {/* Barre gauche active */}
                                {active && !collapsed && (
                                    <motion.span
                                        layoutId="sidebar-active"
                                        className="absolute left-0 top-[6px] bottom-[6px] w-[3px] bg-teal-500 rounded-full"
                                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                                    />
                                )}

                                <span className={cn(
                                    'flex-shrink-0 transition-colors duration-150',
                                    active
                                        ? 'text-teal-600'
                                        : 'text-slate-400 group-hover:text-slate-600',
                                )}>
                                    <Icon/>
                                </span>

                                {!collapsed && (
                                    <span className="truncate leading-none">{label}</span>
                                )}

                                {/* Dot actif collapsed */}
                                {active && collapsed && (
                                    <span className="absolute right-1 top-1 w-1.5 h-1.5 bg-teal-500 rounded-full"/>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* ─── DIVIDER ──────────────────────────────────────── */}
                <div className="h-px bg-slate-100 mx-3"/>

                {/* ─── FOOTER SIDEBAR : user + lien public ──────────── */}
                <div className={cn('py-3 flex-shrink-0', collapsed ? 'px-2' : 'px-3')}>

                    {/* User block */}
                    {!collapsed ? (
                        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <span className="text-[11px] font-bold text-white leading-none">{initials}</span>
                            </div>
                            {/* Infos */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold text-slate-800 truncate leading-none mb-[2px]">
                                    {user?.name ?? 'Admin'}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">{user?.email ?? ''}</p>
                            </div>
                            {/* Déconnexion */}
                            <button
                                onClick={logout}
                                title="Déconnexion"
                                aria-label="Déconnexion"
                                className="flex-shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                            >
                                <Icons.Logout/>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-sm cursor-default"
                                title={user?.name}
                            >
                                <span className="text-[11px] font-bold text-white leading-none">{initials}</span>
                            </div>
                            <button
                                onClick={logout}
                                title="Déconnexion"
                                aria-label="Déconnexion"
                                className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                            >
                                <Icons.Logout/>
                            </button>
                        </div>
                    )}

                    {/* Voir le site public */}
                    {!collapsed && (
                        <Link
                            href="/"
                            className="mt-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-teal-600 hover:bg-teal-50/60 transition-all duration-150"
                        >
                            <Icons.ExternalLink/>
                            Voir le site public
                        </Link>
                    )}
                </div>
            </aside>

            {/* ════════════════════════════════════════════════════════════
                ZONE PRINCIPALE
                ════════════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">

                {/* ─── TOPBAR ───────────────────────────────────────── */}
                <header className={cn(
                    'h-[60px] bg-white border-b border-slate-200/70',
                    'flex items-center justify-between',
                    'px-4 sm:px-6 flex-shrink-0 sticky top-0 z-10',
                    'shadow-[0_1px_0_rgba(0,0,0,0.03)]',
                )}>
                    {/* Gauche : burger + breadcrumb/titre */}
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Burger mobile */}
                        <button
                            onClick={() => setMobileOpen(v => !v)}
                            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors flex-shrink-0"
                            aria-label="Ouvrir le menu"
                        >
                            <Icons.Menu/>
                        </button>

                        {/* Breadcrumb ou titre */}
                        {breadcrumb ? (
                            <nav className="flex items-center gap-1.5 min-w-0 flex-wrap" aria-label="Breadcrumb">
                                {breadcrumb.map((crumb, i) => (
                                    <div key={i} className="flex items-center gap-1.5 min-w-0">
                                        {i > 0 && <span className="text-slate-300 flex-shrink-0"><Icons.ChevronRight/></span>}
                                        {crumb.href ? (
                                            <Link href={crumb.href} className="text-[13px] text-slate-400 hover:text-slate-700 transition-colors truncate font-medium">
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="text-[13px] font-semibold text-slate-800 truncate" aria-current="page">
                                                {crumb.label}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        ) : title ? (
                            <h1 className="text-[14px] font-semibold text-slate-800 truncate">{title}</h1>
                        ) : null}
                    </div>

                    {/* Droite : badge + avatar */}
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-100/80 px-2.5 py-[5px] rounded-full">
                            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" aria-hidden/>
                            Admin
                        </span>
                        <div
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-sm cursor-default"
                            title={user?.name}
                            aria-label={`Connecté en tant que ${user?.name ?? 'Admin'}`}
                        >
                            <span className="text-[11px] font-bold text-white leading-none">{initials}</span>
                        </div>
                    </div>
                </header>

                {/* ─── CONTENU ──────────────────────────────────────── */}
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}