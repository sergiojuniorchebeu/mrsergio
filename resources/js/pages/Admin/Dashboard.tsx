// resources/js/Pages/Admin/Dashboard.tsx
import { Head, Link }  from '@inertiajs/react';
import { motion }      from 'framer-motion';
import AdminLayout     from '@/layouts/AdminLayout';
import { cn }          from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Stats {
    projects:        number;
    projects_pub:    number;
    blog_posts:      number;
    blog_posts_pub:  number;
    formations:      number;
    formations_pub:  number;
    messages:        number;
    messages_unread: number;
}

interface Message {
    id:         number;
    name:       string;
    email:      string;
    subject:    string;
    read:       boolean;
    created_at: string;
}

interface Props {
    stats:            Stats;
    recent_messages:  Message[];
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({
    label, total, published, href, color, icon, delay,
}: {
    label:     string;
    total:     number;
    published: number;
    href:      string;
    color:     'teal' | 'blue' | 'violet' | 'amber';
    icon:      React.ReactNode;
    delay:     number;
}) {
    const colors = {
        teal:   { bg: 'bg-teal-50',   icon: 'text-teal-600',   border: 'border-teal-100',   pill: 'bg-teal-100 text-teal-700' },
        blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100',   pill: 'bg-blue-100 text-blue-700' },
        violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100', pill: 'bg-violet-100 text-violet-700' },
        amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  border: 'border-amber-100',  pill: 'bg-amber-100 text-amber-700' },
    };
    const c = colors[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay }}
        >
            <Link href={href} className="group block">
                <div className={cn(
                    'p-5 rounded-2xl bg-white border border-slate-200/80',
                    'shadow-sm hover:shadow-md hover:-translate-y-0.5',
                    'transition-all duration-200',
                )}>
                    <div className="flex items-start justify-between mb-4">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0', c.bg, c.border)}>
                            <span className={c.icon}>{icon}</span>
                        </div>
                        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', c.pill)}>
                            {published} pub.
                        </span>
                    </div>
                    <p className="text-3xl font-display font-bold text-slate-800 mb-1">{total}</p>
                    <p className="text-sm text-slate-500 font-medium">{label}</p>
                    <p className="text-xs text-slate-400 mt-1">{total - published} brouillons</p>
                </div>
            </Link>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard({ stats, recent_messages }: Props) {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

    return (
        <AdminLayout title="Vue d'ensemble">
            <Head title="Dashboard — Admin" />

            {/* Greeting */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h2 className="text-xl font-display font-bold text-slate-800">
                    {greeting}, Sergio 👋
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                    Voici un résumé de votre portfolio.
                </p>
            </motion.div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Projets"
                    total={stats.projects}
                    published={stats.projects_pub}
                    href="/admin/projects"
                    color="teal"
                    delay={0.05}
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    }
                />
                <StatCard
                    label="Articles de blog"
                    total={stats.blog_posts}
                    published={stats.blog_posts_pub}
                    href="/admin/blog"
                    color="blue"
                    delay={0.1}
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Formations"
                    total={stats.formations}
                    published={stats.formations_pub}
                    href="/admin/formations"
                    color="violet"
                    delay={0.15}
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    }
                />
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2 }}
                >
                    <Link href="/admin/messages" className="group block">
                        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                {stats.messages_unread > 0 && (
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 animate-pulse">
                                        {stats.messages_unread} non lus
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-display font-bold text-slate-800 mb-1">{stats.messages}</p>
                            <p className="text-sm text-slate-500 font-medium">Messages reçus</p>
                            <p className="text-xs text-slate-400 mt-1">{stats.messages - stats.messages_unread} lus</p>
                        </div>
                    </Link>
                </motion.div>
            </div>

            {/* Actions rapides + Messages récents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Actions rapides */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.25 }}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5"
                >
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Actions rapides</h3>
                    <div className="space-y-2">
                        {[
                            { href: '/admin/projects/create',   label: 'Nouveau projet',    color: 'teal'   },
                            { href: '/admin/blog/create',       label: 'Nouvel article',    color: 'blue'   },
                            { href: '/admin/formations/create', label: 'Nouvelle formation', color: 'violet' },
                        ].map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-150 group"
                            >
                                <div className={cn(
                                    'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                                    item.color === 'teal'   && 'bg-teal-50   text-teal-600',
                                    item.color === 'blue'   && 'bg-blue-50   text-blue-600',
                                    item.color === 'violet' && 'bg-violet-50 text-violet-600',
                                )}>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                                    {item.label}
                                </span>
                                <svg className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Messages récents */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-800">Messages récents</h3>
                        <Link href="/admin/messages" className="text-xs font-medium text-teal-600 hover:underline">
                            Voir tout
                        </Link>
                    </div>

                    {recent_messages.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-slate-400">Aucun message pour l'instant.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recent_messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        'flex items-start gap-3 p-3 rounded-xl border transition-colors',
                                        msg.read ? 'border-slate-100 bg-slate-50/50' : 'border-amber-100 bg-amber-50/50',
                                    )}
                                >
                                    <div className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold',
                                        msg.read ? 'bg-slate-200 text-slate-600' : 'bg-amber-200 text-amber-800',
                                    )}>
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{msg.name}</p>
                                            {!msg.read && (
                                                <span className="text-xs font-medium bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                                    Nouveau
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate mt-0.5">{msg.subject}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{msg.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

        </AdminLayout>
    );
}