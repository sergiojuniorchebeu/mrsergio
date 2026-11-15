// resources/js/pages/Admin/Messages/Index.tsx
// Boîte de réception : filtre lus / non lus, recherche, lecture dépliable.

import { Head, router } from '@inertiajs/react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { AdminEmptyState, AdminPageHeader, AdminPanel, DeleteModal, inputCls } from '@/components/admin/shared';
import { buttonVariants } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    created_at: string;
}

type InboxFilter = 'all' | 'unread';

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function MessagesIndex({ messages }: { messages: Message[] }) {
    const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [filter, setFilter] = useState<InboxFilter>('all');
    const [search, setSearch] = useState('');

    const unreadCount = messages.filter((message) => !message.read).length;

    const visibleMessages = useMemo(() => {
        const query = search.trim().toLowerCase();

        return messages.filter((message) => {
            const matchesFilter = filter === 'all' || !message.read;
            const matchesSearch =
                !query || [message.name, message.email, message.subject, message.message].some((field) => field.toLowerCase().includes(query));

            return matchesFilter && matchesSearch;
        });
    }, [messages, filter, search]);

    function toggle(message: Message) {
        setExpandedId(expandedId === message.id ? null : message.id);

        if (!message.read) {
            router.patch(`/admin/messages/${message.id}/read`, {}, { preserveScroll: true, preserveState: true });
        }
    }

    function confirmDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/admin/messages/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AdminLayout title="Messages">
            <Head title="Messages — Admin" />

            <AdminPageHeader
                title="Messages"
                description={`${messages.length} message${messages.length > 1 ? 's' : ''} · ${unreadCount} non lu${unreadCount > 1 ? 's' : ''}`}
            />

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <LayoutGroup id="inbox-filter">
                    <div className="flex w-fit gap-1 rounded-lg bg-slate-100 p-1">
                        {(
                            [
                                { value: 'all', label: 'Tous', count: messages.length },
                                { value: 'unread', label: 'Non lus', count: unreadCount },
                            ] as const
                        ).map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setFilter(option.value)}
                                className={cn(
                                    'relative rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors',
                                    filter === option.value ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800',
                                )}
                            >
                                {filter === option.value && (
                                    <motion.span layoutId="inbox-filter-active" className="absolute inset-0 rounded-md bg-white shadow-sm" />
                                )}
                                <span className="relative">
                                    {option.label} <span className="font-mono text-[11px] text-slate-400">{option.count}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </LayoutGroup>
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un nom, un email, un sujet…"
                    className={cn(inputCls, 'sm:max-w-xs')}
                />
            </div>

            <AdminPanel>
                {visibleMessages.length === 0 ? (
                    <AdminEmptyState message={messages.length === 0 ? "Aucun message pour l'instant." : 'Aucun message ne correspond.'} />
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {visibleMessages.map((message) => {
                            const isExpanded = expandedId === message.id;

                            return (
                                <li key={message.id}>
                                    <button
                                        type="button"
                                        onClick={() => toggle(message)}
                                        aria-expanded={isExpanded}
                                        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                                    >
                                        <span
                                            className={cn(
                                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-bold uppercase',
                                                message.read ? 'bg-slate-100 text-slate-500' : 'bg-slate-900 text-white',
                                            )}
                                        >
                                            {message.name.charAt(0)}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-center gap-2">
                                                <span className={cn('truncate text-[14px]', message.read ? 'text-slate-700' : 'font-semibold text-slate-900')}>
                                                    {message.name}
                                                </span>
                                                {!message.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />}
                                                <span className="hidden truncate text-[12px] text-slate-400 sm:inline">{message.email}</span>
                                            </span>
                                            <span className={cn('block truncate text-[13px]', message.read ? 'text-slate-500' : 'text-slate-700')}>
                                                {message.subject}
                                            </span>
                                        </span>
                                        <span className="shrink-0 font-mono text-[11px] text-slate-400">
                                            {DATE_FORMAT.format(new Date(message.created_at))}
                                        </span>
                                        <motion.svg
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            className="h-4 w-4 shrink-0 text-slate-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            aria-hidden
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </motion.svg>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 sm:pl-[76px]">
                                                    <p className="rounded-xl bg-slate-50 p-4 text-[14px] leading-relaxed whitespace-pre-wrap text-slate-700">
                                                        {message.message}
                                                    </p>
                                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                                        <a
                                                            href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                                                            className={buttonVariants({ size: 'sm' })}
                                                        >
                                                            Répondre par email
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeleteTarget(message)}
                                                            className={buttonVariants({
                                                                variant: 'ghost',
                                                                size: 'sm',
                                                                className: 'text-rose-600 hover:bg-rose-50 hover:text-rose-700',
                                                            })}
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </AdminPanel>

            <DeleteModal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                label={`Message de ${deleteTarget?.name ?? ''}`}
            />
        </AdminLayout>
    );
}
