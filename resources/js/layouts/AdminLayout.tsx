// resources/js/layouts/AdminLayout.tsx
import { Link, usePage, router }   from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect }     from 'react';
import {
    LayoutGrid,
    Code2,
    FileText,
    GraduationCap,
    Mail,
    LogOut,
    ExternalLink,
    PanelLeftOpen,
    ChevronRight,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarSeparator,
    SidebarTrigger,
} from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
    children:    React.ReactNode;
    title?:      string;
    breadcrumb?: { label: string; href?: string }[];
}

// ─── Nav config ───────────────────────────────────────────────────────────────
const navItems = [
    { label: "Vue d'ensemble", href: '/admin',            exact: true,  icon: LayoutGrid    },
    { label: 'Projets',        href: '/admin/projects',   exact: false, icon: Code2         },
    { label: 'Blog',           href: '/admin/blog',       exact: false, icon: FileText      },
    { label: 'Formations',     href: '/admin/formations', exact: false, icon: GraduationCap },
    { label: 'Messages',       href: '/admin/messages',   exact: false, icon: Mail          },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isActive = (href: string, url: string, exact: boolean) =>
    exact ? url === href : url.startsWith(href);

const logout = () => router.post('/logout');

// ─── Logo SVG ────────────────────────────────────────────────────────────────
function LogoMark({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="mrsergio">
            <polygon points="32,3 58,17 58,47 32,61 6,47 6,17" fill="#1D9E75" fillOpacity="0.12"/>
            <polygon points="32,3 58,17 58,47 32,61 6,47 6,17" fill="none" stroke="#1D9E75" strokeWidth="1.5"/>
            <path d="M20 24Q20 18 26 18L38 18Q44 18 44 24Q44 30 32 34Q20 38 20 44Q20 50 26 50L38 50Q44 50 44 44"
                stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <circle cx="54" cy="17" r="5" fill="#1D9E75"/>
        </svg>
    );
}

// ─── Flash Toast ──────────────────────────────────────────────────────────────
function FlashToast({ type, message }: { type: 'success' | 'error'; message: string }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setShow(false), 4500);
        return () => clearTimeout(t);
    }, [message]);

    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            className={cn(
                'fixed top-4 right-4 z-[100] flex items-start gap-3',
                'px-4 py-3 rounded-xl shadow-lg max-w-sm w-full',
                'bg-white border text-[13px] font-medium backdrop-blur-sm',
                type === 'success' ? 'border-teal-200 text-slate-800' : 'border-red-200 text-slate-800',
            )}
        >
            {type === 'success' ? (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-teal-500 flex-shrink-0 mt-[1px]" aria-hidden>
                    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M4.5 7.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ) : (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-red-500 flex-shrink-0 mt-[1px]" aria-hidden>
                    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M7.5 4.5v3.5M7.5 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            )}
            <span className="flex-1 leading-relaxed">{message}</span>
            <button
                onClick={() => setShow(false)}
                aria-label="Fermer"
                className="text-slate-300 hover:text-slate-500 transition-colors"
            >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                    <path d="M2.5 2.5l8 8M10.5 2.5l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
            </button>
        </motion.div>
    );
}

// ─── Skeleton exporté ────────────────────────────────────────────────────────
export function AdminSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="animate-pulse space-y-3 p-1">
            <div className="h-7 w-40 bg-sidebar-accent rounded-lg"/>
            <div className="h-px bg-sidebar-border my-4"/>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-sidebar-accent rounded-lg flex-shrink-0"/>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-sidebar-accent rounded w-2/3"/>
                        <div className="h-2.5 bg-sidebar-accent/60 rounded w-1/3"/>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function AdminLayout({ children, title, breadcrumb }: Props) {
    const { url, props } = usePage<{
        auth:  { user: { name: string; email: string } };
        flash: { success?: string; error?: string };
    }>();

    const flash = props.flash ?? {};
    const user  = props.auth?.user;

    const initials = user?.name
        ?.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() ?? 'A';

    return (
        <SidebarProvider>
            {/* ── Flash Toasts ──────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {flash.success && <FlashToast key={`s-${flash.success}`} type="success" message={flash.success}/>}
                {flash.error   && <FlashToast key={`e-${flash.error}`}   type="error"   message={flash.error}/>}
            </AnimatePresence>

            {/* ════════════════════════════════════════════════════════
                SIDEBAR — composants Untitled UI natifs
                ════════════════════════════════════════════════════════ */}
            <Sidebar collapsible="icon" variant="inset">

                {/* ── Logo ─────────────────────────────────────────── */}
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/admin" className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent flex-shrink-0">
                                        <LogoMark size={20}/>
                                    </div>
                                    <div className="flex flex-col leading-none min-w-0">
                                        <span className="text-[13px] font-bold text-sidebar-foreground tracking-tight truncate">
                                            mr<span className="text-teal-600">sergio</span>
                                        </span>
                                        <span className="text-[9px] font-mono text-sidebar-foreground/40 tracking-[0.18em]">
                                            .dev / admin
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                {/* ── Navigation principale ────────────────────────── */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Gestion</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map(({ label, href, exact, icon: Icon }) => {
                                    const active = isActive(href, url, exact);
                                    return (
                                        <SidebarMenuItem key={href}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={active}
                                                tooltip={label}
                                            >
                                                <Link href={href}>
                                                    <Icon/>
                                                    <span>{label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* ── Footer : user + site public ──────────────────── */}
                <SidebarFooter>
                    <SidebarSeparator/>

                    {/* Lien site public */}
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Voir le site public">
                                <a href="/" target="_blank" rel="noreferrer">
                                    <ExternalLink/>
                                    <span>Voir le site public</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    <SidebarSeparator/>

                    {/* User block */}
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" tooltip={user?.email ?? ''}>
                                {/* Avatar */}
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex-shrink-0 shadow-sm">
                                    <span className="text-[11px] font-bold text-white leading-none">
                                        {initials}
                                    </span>
                                </div>
                                {/* Infos */}
                                <div className="flex flex-col leading-none min-w-0 flex-1">
                                    <span className="text-[12px] font-semibold text-sidebar-foreground truncate">
                                        {user?.name ?? 'Admin'}
                                    </span>
                                    <span className="text-[10px] text-sidebar-foreground/50 truncate">
                                        {user?.email ?? ''}
                                    </span>
                                </div>
                                {/* Logout */}
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); logout(); }}
                                    title="Déconnexion"
                                    aria-label="Déconnexion"
                                    className="ml-auto p-1 rounded-md text-sidebar-foreground/30 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                                >
                                    <LogOut className="w-4 h-4"/>
                                </button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            {/* ════════════════════════════════════════════════════════
                CONTENU PRINCIPAL — SidebarInset gère l'offset auto
                ════════════════════════════════════════════════════════ */}
            <SidebarInset>

                {/* ── Topbar ───────────────────────────────────────── */}
                <header className={cn(
                    'flex h-12 shrink-0 items-center gap-2 justify-between',
                    'border-b border-sidebar-border/50 px-4',
                    'transition-[width,height] ease-linear',
                    'group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
                    'sticky top-0 z-10 bg-background',
                )}>
                    {/* Gauche : trigger + breadcrumb / titre */}
                    <div className="flex items-center gap-2 min-w-0">
                        <SidebarTrigger className="-ml-1"/>

                        {/* Séparateur vertical */}
                        <div className="h-4 w-px bg-border"/>

                        {/* Breadcrumb ou titre */}
                        {breadcrumb ? (
                            <nav className="flex items-center gap-1 min-w-0 flex-wrap" aria-label="Breadcrumb">
                                {breadcrumb.map((crumb, i) => (
                                    <div key={i} className="flex items-center gap-1 min-w-0">
                                        {i > 0 && (
                                            <ChevronRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0"/>
                                        )}
                                        {crumb.href ? (
                                            <Link
                                                href={crumb.href}
                                                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors truncate font-medium"
                                            >
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="text-[13px] font-semibold text-foreground truncate" aria-current="page">
                                                {crumb.label}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        ) : title ? (
                            <h1 className="text-[14px] font-semibold text-foreground truncate">{title}</h1>
                        ) : null}
                    </div>

                    {/* Droite : badge admin */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-[5px] rounded-full">
                            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" aria-hidden/>
                            Admin
                        </span>
                    </div>
                </header>

                {/* ── Page Content ─────────────────────────────────── */}
                <main className="flex flex-1 flex-col gap-4 p-4 overflow-auto">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}