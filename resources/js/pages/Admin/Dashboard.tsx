// resources/js/Pages/Admin/Dashboard.tsx
import { Head, Link }  from '@inertiajs/react';
import { motion }      from 'framer-motion';
import AdminLayout     from '@/layouts/AdminLayout';
import { cn }          from '@/lib/utils';
import { JSX } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
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
    stats:           Stats;
    recent_messages: Message[];
}

// ─── Icônes inline ────────────────────────────────────────────────────────────
const Ico = {
    Code: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <path d="M5.5 3.5L2 8l3.5 4.5M10.5 3.5L14 8l-3.5 4.5M9.5 2l-3 12" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    Doc: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <rect x="2" y="1.5" width="12" height="13" rx="2"/>
            <path d="M5 5.5h6M5 8h6M5 10.5h4" strokeLinecap="round"/>
        </svg>
    ),
    Cap: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <path d="M8 2.5L1.5 6 8 9.5 14.5 6 8 2.5z" strokeLinejoin="round"/>
            <path d="M4.5 7.5V11c0 1.5 1.5 2.5 3.5 2.5S11.5 12.5 11.5 11V7.5" strokeLinecap="round"/>
        </svg>
    ),
    Mail: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/>
            <path d="M1.5 3.5l6.5 5 6.5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    ArrowUpRight: () => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    Plus: () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M7 2v10M2 7h10" strokeLinecap="round"/>
        </svg>
    ),
    ChevronRight: () => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <path d="M4.5 2.5L7.5 6l-3 3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pct(pub: number, total: number) {
    if (total === 0) return 0;
    return Math.round((pub / total) * 100);
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 2)  return 'À l\'instant';
    if (mins  < 60) return `${mins}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
type AccentColor = 'teal' | 'blue' | 'violet' | 'amber'

const ACCENTS: Record<AccentColor, {
    iconBg: string; iconText: string; barBg: string; pillBg: string; pillText: string;
}> = {
    teal:   { iconBg: 'bg-teal-50',   iconText: 'text-teal-600',   barBg: 'bg-teal-500',   pillBg: 'bg-teal-50',   pillText: 'text-teal-700'   },
    blue:   { iconBg: 'bg-blue-50',   iconText: 'text-blue-600',   barBg: 'bg-blue-500',   pillBg: 'bg-blue-50',   pillText: 'text-blue-700'   },
    violet: { iconBg: 'bg-violet-50', iconText: 'text-violet-600', barBg: 'bg-violet-500', pillBg: 'bg-violet-50', pillText: 'text-violet-700' },
    amber:  { iconBg: 'bg-amber-50',  iconText: 'text-amber-600',  barBg: 'bg-amber-400',  pillBg: 'bg-amber-50',  pillText: 'text-amber-700'  },
}

function StatCard({
    label, total, published, href, color, Icon, delay, suffix,
}: {
    label:     string;
    total:     number;
    published: number;
    href:      string;
    color:     AccentColor;
    Icon:      () => JSX.Element;
    delay:     number;
    suffix?:   string;
}) {
    const a    = ACCENTS[color];
    const p    = pct(published, total);
    const diff = total - published;

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0, 0, 0.2, 1], delay }}
        >
            <Link href={href} className="group block h-full">
                <div className={cn(
                    'h-full bg-white border border-slate-200/70 rounded-2xl p-5',
                    'flex flex-col gap-4',
                    'transition-all duration-200',
                    'hover:border-slate-300/80 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]',
                    'hover:-translate-y-0.5',
                )}>
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', a.iconBg)}>
                            <span className={a.iconText}><Icon/></span>
                        </div>
                        <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', a.pillBg, a.pillText)}>
                            {published} pub.
                        </span>
                    </div>

                    {/* Number */}
                    <div>
                        <p className="text-[32px] font-bold text-slate-900 leading-none tracking-tight">
                            {total}
                        </p>
                        <p className="text-[13px] font-medium text-slate-500 mt-1">{label}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                        <div className="h-[3px] bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${p}%` }}
                                transition={{ duration: 0.7, delay: delay + 0.2, ease: [0, 0, 0.2, 1] }}
                                className={cn('h-full rounded-full', a.barBg)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">{p}% publiés</span>
                            {diff > 0 && (
                                <span className="text-[11px] text-slate-400">{diff} brouillon{diff > 1 ? 's' : ''}</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ─── Messages Row ─────────────────────────────────────────────────────────────
function MessageRow({ msg, i }: { msg: Message; i: number }) {
    const initials = msg.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    return (
        <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.04 }}
            className={cn(
                'group transition-colors duration-150',
                msg.read ? 'hover:bg-slate-50/60' : 'bg-amber-50/40 hover:bg-amber-50/70',
            )}
        >
            {/* Sender */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0',
                        msg.read
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-200 text-amber-800',
                    )}>
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className={cn('text-[13px] font-semibold truncate leading-tight', msg.read ? 'text-slate-700' : 'text-slate-900')}>
                            {msg.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{msg.email}</p>
                    </div>
                </div>
            </td>
            {/* Subject */}
            <td className="px-4 py-3.5 hidden sm:table-cell">
                <p className="text-[13px] text-slate-600 truncate max-w-[280px]">{msg.subject}</p>
            </td>
            {/* Time + badge */}
            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                    {!msg.read && (
                        <span className="inline-flex text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                            Nouveau
                        </span>
                    )}
                    <span className="text-[11px] text-slate-400">{timeAgo(msg.created_at)}</span>
                </div>
            </td>
        </motion.tr>
    );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────
function QuickAction({ href, label, sub, color }: {
    href: string; label: string; sub: string; color: AccentColor;
}) {
    const a = ACCENTS[color];
    return (
        <Link href={href} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', a.iconBg)}>
                <span className={a.iconText}><Ico.Plus/></span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-slate-800 leading-tight">{label}</p>
                <p className="text-[11px] text-slate-400 truncate">{sub}</p>
            </div>
            <span className="text-slate-300 group-hover:text-slate-400 transition-colors">
                <Ico.ChevronRight/>
            </span>
        </Link>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Dashboard({ stats, recent_messages }: Props) {
    const hour     = new Date().getHours();
    const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

    return (
        <AdminLayout title="Vue d'ensemble">
            <Head title="Dashboard — Admin"/>

            {/* ── Greeting ──────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-7"
            >
                <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">
                    {greeting}, Sergio 👋
                </h2>
                <p className="text-[13px] text-slate-500 mt-1">
                    Voici l'état de votre portfolio aujourd'hui.
                </p>
            </motion.div>

            {/* ── Stat Cards ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
                <StatCard label="Projets"          total={stats.projects}   published={stats.projects_pub}   href="/admin/projects"   color="teal"   Icon={Ico.Code} delay={0.04}/>
                <StatCard label="Articles de blog" total={stats.blog_posts}  published={stats.blog_posts_pub}  href="/admin/blog"       color="blue"   Icon={Ico.Doc}  delay={0.08}/>
                <StatCard label="Formations"       total={stats.formations} published={stats.formations_pub} href="/admin/formations" color="violet" Icon={Ico.Cap}  delay={0.12}/>

                {/* Messages — card spéciale non-cliquable pour le total */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] as [number,number,number,number], delay: 0.16 }}
                >
                    <Link href="/admin/messages" className="group block h-full">
                        <div className={cn(
                            'h-full bg-white border border-slate-200/70 rounded-2xl p-5',
                            'flex flex-col gap-4',
                            'transition-all duration-200',
                            'hover:border-slate-300/80 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5',
                        )}>
                            <div className="flex items-start justify-between">
                                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <span className="text-amber-600"><Ico.Mail/></span>
                                </div>
                                {stats.messages_unread > 0 ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>
                                        {stats.messages_unread} non lus
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-semibold bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full">
                                        Tous lus
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-[32px] font-bold text-slate-900 leading-none tracking-tight">
                                    {stats.messages}
                                </p>
                                <p className="text-[13px] font-medium text-slate-500 mt-1">Messages reçus</p>
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-[3px] bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct(stats.messages - stats.messages_unread, stats.messages)}%` }}
                                        transition={{ duration: 0.7, delay: 0.36, ease: [0, 0, 0.2, 1] as [number,number,number,number] }}
                                        className="h-full rounded-full bg-amber-400"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-slate-400">{stats.messages - stats.messages_unread} lus</span>
                                    {stats.messages_unread > 0 && (
                                        <span className="text-[11px] text-slate-400">{stats.messages_unread} en attente</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>

            {/* ── Bottom Grid ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Actions rapides */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.22 }}
                    className="bg-white border border-slate-200/70 rounded-2xl p-5"
                >
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.16em] mb-4">
                        Actions rapides
                    </p>
                    <div className="space-y-0.5">
                        <QuickAction href="/admin/projects/create"   label="Nouveau projet"    sub="Ajouter un projet au portfolio"  color="teal"/>
                        <QuickAction href="/admin/blog/create"       label="Nouvel article"    sub="Rédiger un article de blog"      color="blue"/>
                        <QuickAction href="/admin/formations/create" label="Nouvelle formation" sub="Créer une formation"             color="violet"/>
                    </div>
                </motion.div>

                {/* Messages récents */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.26 }}
                    className="lg:col-span-2 bg-white border border-slate-200/70 rounded-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <p className="text-[13px] font-semibold text-slate-800">Messages récents</p>
                        <Link
                            href="/admin/messages"
                            className="flex items-center gap-1 text-[12px] font-medium text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            Voir tout <Ico.ArrowUpRight/>
                        </Link>
                    </div>

                    {recent_messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <Ico.Mail/>
                            </div>
                            <p className="text-[12px] text-slate-400 font-medium">Aucun message pour l'instant</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <tbody className="divide-y divide-slate-100/70">
                                    {recent_messages.map((msg, i) => (
                                        <MessageRow key={msg.id} msg={msg} i={i}/>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </AdminLayout>
    );
}