// resources/js/layouts/AdminLayout.tsx
import { Link, usePage, router }   from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect }     from 'react';
import { cn }                      from '@/lib/utils';

interface Props {
    children: React.ReactNode;
    title?:   string;
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV ITEMS
// ─────────────────────────────────────────────────────────────────────────────
const navItems = [
    {
        label: 'Vue d\'ensemble',
        href:  '/admin',
        exact: true,
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: 'Projets',
        href:  '/admin/projects',
        exact: false,
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
    },
    {
        label: 'Blog',
        href:  '/admin/blog',
        exact: false,
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        ),
    },
    {
        label: 'Formations',
        href:  '/admin/formations',
        exact: false,
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
    },
    {
        label: 'Messages',
        href:  '/admin/messages',
        exact: false,
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function isActive(href: string, currentUrl: string, exact: boolean): boolean {
    if (exact) return currentUrl === href;
    return currentUrl.startsWith(href);
}

function logout() {
    router.post('/logout');
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminLayout({ children, title }: Props) {
    const { url, props } = usePage<{ auth: { user: { name: string; email: string } }; flash: { success?: string; error?: string } }>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const flash = props.flash ?? {};

    // Ferme sidebar mobile au changement de page (déférer le setState pour éviter des rendus en cascade)
    useEffect(() => {
        const id = setTimeout(() => setSidebarOpen(false), 0);
        return () => clearTimeout(id);
    }, [url]);

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* ── OVERLAY MOBILE ──────────────────────────────────────────── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
            <aside className={cn(
                'fixed top-0 left-0 z-30 h-full w-60 bg-white border-r border-slate-200/80 flex flex-col',
                'transition-transform duration-300 ease-out',
                'lg:translate-x-0 lg:static lg:z-auto',
                sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
            )}>
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100 flex-shrink-0">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm shadow-teal-500/30">
                        <span className="text-white font-bold text-sm font-display">S</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800 font-display leading-none">mrsergio</p>
                        <p className="text-xs text-slate-400 mt-0.5">Dashboard</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.15em] px-3 mb-3">
                        Gestion
                    </p>
                    {navItems.map(item => {
                        const active = isActive(item.href, url, item.exact);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                                    active
                                        ? 'bg-teal-50 text-teal-700 border border-teal-100'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                                )}
                            >
                                <span className={cn(active ? 'text-teal-600' : 'text-slate-400')}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {active && (
                                    <span className="ml-auto w-1.5 h-1.5 bg-teal-500 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className="p-3 border-t border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
                        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">
                                {props.auth?.user?.name?.charAt(0) ?? 'A'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{props.auth?.user?.name}</p>
                            <p className="text-xs text-slate-400 truncate">{props.auth?.user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            title="Déconnexion"
                            className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>

                    {/* Lien vers le site public */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-xs text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Voir le site public
                    </Link>
                </div>
            </aside>

            {/* ── CONTENU PRINCIPAL ───────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-0">

                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        {/* Burger mobile */}
                        <button
                            onClick={() => setSidebarOpen(v => !v)}
                            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Titre de page */}
                        {title && (
                            <h1 className="text-base font-semibold text-slate-800 font-display">
                                {title}
                            </h1>
                        )}
                    </div>

                    {/* Badge admin */}
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                            Admin
                        </span>
                    </div>
                </header>

                {/* Flash messages */}
                <AnimatePresence>
                    {flash.success && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="mx-4 sm:mx-6 mt-4 flex items-center gap-3 px-4 py-3 bg-teal-50 border border-teal-200 rounded-xl text-sm font-medium text-teal-800"
                        >
                            <svg className="w-4 h-4 text-teal-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {flash.success}
                        </motion.div>
                    )}
                    {flash.error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="mx-4 sm:mx-6 mt-4 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-800"
                        >
                            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {flash.error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}