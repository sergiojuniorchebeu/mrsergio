// resources/js/pages/Admin/Dashboard.tsx
// Vue d'ensemble : ce qui est à traiter, état du contenu, derniers messages.

import { Head, Link, usePage } from '@inertiajs/react';
import NumberFlow from '@number-flow/react';
import { motion } from 'framer-motion';
import { AdminPageHeader, AdminPanel } from '@/components/admin/shared';
import { buttonVariants } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface Stats {
    projects: number;
    projects_pub: number;
    blog_posts: number;
    blog_posts_pub: number;
    formations: number;
    formations_pub: number;
    messages: number;
    messages_unread: number;
    enrollments_new: number;
    comments_week: number;
}

interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    read: boolean;
    created_at: string;
}

const EASE = [0.23, 1, 0.32, 1] as const;

function timeAgo(dateString: string): string {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);

    if (minutes < 2) {
        return "à l'instant";
    }

    if (minutes < 60) {
        return `il y a ${minutes} min`;
    }

    if (minutes < 1440) {
        return `il y a ${Math.floor(minutes / 60)} h`;
    }

    return `il y a ${Math.floor(minutes / 1440)} j`;
}

// ─── À traiter ───────────────────────────────────────────────────────────────
function TodoCard({
    label,
    value,
    hint,
    href,
    delay,
}: {
    label: string;
    value: number;
    hint: string;
    href: string;
    delay: number;
}) {
    const hasWork = value > 0;

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: EASE }}>
            <Link
                href={href}
                className={cn(
                    'group flex h-full flex-col justify-between gap-6 rounded-2xl border p-5 transition-[border-color,box-shadow,background-color] duration-200 active:scale-[0.99]',
                    hasWork
                        ? 'border-teal-200 bg-teal-50/60 hover:border-teal-300 hover:shadow-[0_10px_30px_-18px_rgba(19,135,112,0.5)]'
                        : 'border-slate-200/80 bg-white hover:border-slate-300',
                )}
            >
                <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-[14px] font-semibold text-slate-800">{label}</span>
                    {hasWork && <span className="h-2 w-2 rounded-full bg-teal-500" />}
                </div>
                <div>
                    <span
                        className={cn(
                            'font-display text-[40px] leading-none font-bold tracking-tight tabular-nums',
                            hasWork ? 'text-teal-700' : 'text-slate-300',
                        )}
                    >
                        <NumberFlow value={value} />
                    </span>
                    <p className="mt-2 text-[13px] text-slate-500">{hasWork ? hint : 'Rien en attente'}</p>
                </div>
            </Link>
        </motion.div>
    );
}

// ─── Contenu ─────────────────────────────────────────────────────────────────
function ContentStat({
    label,
    total,
    published,
    href,
    createHref,
    createLabel,
    delay,
}: {
    label: string;
    total: number;
    published: number;
    href: string;
    createHref: string;
    createLabel: string;
    delay: number;
}) {
    const share = total === 0 ? 0 : Math.round((published / total) * 100);
    const drafts = total - published;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: EASE }}
            className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-5"
        >
            <div className="flex items-start justify-between gap-3">
                <Link href={href} className="group">
                    <p className="font-display text-[34px] leading-none font-bold tracking-tight text-slate-900 tabular-nums">
                        <NumberFlow value={total} />
                    </p>
                    <p className="mt-1.5 text-[14px] text-slate-500 transition-colors group-hover:text-slate-900">{label}</p>
                </Link>
                <Link href={createHref} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    {createLabel}
                </Link>
            </div>
            <div className="space-y-2">
                <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${share}%` }}
                        transition={{ duration: 0.8, delay: delay + 0.2, ease: EASE }}
                        className="h-full rounded-full bg-teal-600"
                    />
                </div>
                <p className="flex justify-between font-mono text-[11px] text-slate-400">
                    <span>{published} publié{published > 1 ? 's' : ''}</span>
                    {drafts > 0 && (
                        <span>
                            {drafts} brouillon{drafts > 1 ? 's' : ''}
                        </span>
                    )}
                </p>
            </div>
        </motion.div>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function Dashboard({ stats, recent_messages }: { stats: Stats; recent_messages: Message[] }) {
    const { auth } = usePage<{ auth: { user: { name: string } | null } }>().props;
    const firstName = auth?.user?.name?.split(' ')[0] ?? '';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
    const today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

    return (
        <AdminLayout title="Vue d'ensemble">
            <Head title="Dashboard — Admin" />

            <AdminPageHeader
                title={`${greeting}${firstName ? `, ${firstName}` : ''}`}
                description={<span className="capitalize">{today}</span>}
                actions={
                    <a href="/" target="_blank" rel="noreferrer" className={buttonVariants({ variant: 'outline' })}>
                        Voir le site
                    </a>
                }
            />

            <p className="mb-3 font-mono text-[11px] text-slate-400">À traiter</p>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <TodoCard
                    label="Messages non lus"
                    value={stats.messages_unread}
                    hint="Des visiteurs attendent une réponse"
                    href="/admin/messages"
                    delay={0.04}
                />
                <TodoCard
                    label="Inscriptions à traiter"
                    value={stats.enrollments_new}
                    hint="Nouvelles demandes de formation"
                    href="/admin/formation-enrollments"
                    delay={0.08}
                />
                <TodoCard
                    label="Commentaires cette semaine"
                    value={stats.comments_week}
                    hint="À relire sur vos articles"
                    href="/admin/blog"
                    delay={0.12}
                />
            </div>

            <p className="mb-3 font-mono text-[11px] text-slate-400">Contenu</p>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <ContentStat
                    label="Projets"
                    total={stats.projects}
                    published={stats.projects_pub}
                    href="/admin/projects"
                    createHref="/admin/projects/create"
                    createLabel="Nouveau"
                    delay={0.16}
                />
                <ContentStat
                    label="Articles"
                    total={stats.blog_posts}
                    published={stats.blog_posts_pub}
                    href="/admin/blog"
                    createHref="/admin/blog/create"
                    createLabel="Nouveau"
                    delay={0.2}
                />
                <ContentStat
                    label="Formations"
                    total={stats.formations}
                    published={stats.formations_pub}
                    href="/admin/formations"
                    createHref="/admin/formations/create"
                    createLabel="Nouvelle"
                    delay={0.24}
                />
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28, ease: EASE }}>
                <AdminPanel
                    title="Derniers messages"
                    actions={
                        <Link href="/admin/messages" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                            Tout voir
                        </Link>
                    }
                >
                    {recent_messages.length === 0 ? (
                        <p className="px-5 py-12 text-center text-[14px] text-slate-500">Aucun message pour l&apos;instant.</p>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {recent_messages.map((message) => (
                                <li key={message.id}>
                                    <Link
                                        href="/admin/messages"
                                        className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
                                    >
                                        <span
                                            className={cn(
                                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-[12px] font-bold uppercase',
                                                message.read ? 'bg-slate-100 text-slate-500' : 'bg-slate-900 text-white',
                                            )}
                                        >
                                            {message.name.charAt(0)}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className={cn(
                                                        'truncate text-[14px]',
                                                        message.read ? 'text-slate-600' : 'font-semibold text-slate-900',
                                                    )}
                                                >
                                                    {message.name}
                                                </span>
                                                {!message.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />}
                                            </span>
                                            <span className="block truncate text-[13px] text-slate-500">{message.subject}</span>
                                        </span>
                                        <span className="shrink-0 font-mono text-[11px] text-slate-400">{timeAgo(message.created_at)}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </AdminPanel>
            </motion.div>
        </AdminLayout>
    );
}
