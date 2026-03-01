// resources/js/Pages/Admin/Messages/Index.tsx
import { Head, router } from '@inertiajs/react';
import { motion }       from 'framer-motion';
import { useState }     from 'react';
import { DeleteModal }  from '@/components/admin/shared';
import AdminLayout      from '@/layouts/AdminLayout';
import { cn }           from '@/lib/utils';

interface Message {
    id:         number;
    name:       string;
    email:      string;
    subject:    string;
    message:    string;
    read:       boolean;
    created_at: string;
}

export default function MessagesIndex({ messages }: { messages: Message[] }) {
    const [deleteTarget, setDeleteTarget]   = useState<Message | null>(null);
    const [expanded, setExpanded]           = useState<number | null>(null);

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/admin/messages/${deleteTarget.id}`, { onSuccess: () => setDeleteTarget(null) });
    }

    function markRead(m: Message) {
        if (m.read) return;
        router.patch(`/admin/messages/${m.id}/read`, {}, { preserveScroll: true });
    }

    const unread = messages.filter(m => !m.read).length;

    return (
        <AdminLayout title="Messages">
            <Head title="Messages — Admin" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-display font-bold text-slate-800">Messages reçus</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {messages.length} message{messages.length > 1 ? 's' : ''} au total
                        {unread > 0 && <span className="ml-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">{unread} non lus</span>}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {messages.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-500">Aucun message pour l'instant</p>
                    </div>
                ) : (
                    messages.map((m, i) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className={cn(
                                'bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200',
                                m.read ? 'border-slate-200/80' : 'border-amber-200 shadow-amber-500/5',
                            )}
                        >
                            {/* Header du message */}
                            <div
                                className="flex items-start gap-4 p-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                                onClick={() => {
                                    setExpanded(expanded === m.id ? null : m.id);
                                    markRead(m);
                                }}
                            >
                                {/* Avatar */}
                                <div className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold',
                                    m.read ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800',
                                )}>
                                    {m.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                                            {!m.read && (
                                                <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-400 flex-shrink-0">
                                            {new Date(m.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">{m.email}</p>
                                    <p className="text-sm font-medium text-slate-700 truncate">{m.subject}</p>
                                </div>

                                {/* Chevron */}
                                <svg
                                    className={cn('w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 mt-1', expanded === m.id && 'rotate-180')}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Contenu développé */}
                            {expanded === m.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border-t border-slate-100"
                                >
                                    <div className="p-4 pt-3">
                                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-4 border border-slate-100">
                                            {m.message}
                                        </p>
                                        <div className="flex items-center justify-between mt-3">
                                            <a
                                                href={`mailto:${m.email}?subject=Re: ${m.subject}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                </svg>
                                                Répondre par email
                                            </a>
                                            <button
                                                onClick={() => setDeleteTarget(m)}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            <DeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} label={`message de ${deleteTarget?.name ?? ''}`} />
        </AdminLayout>
    );
}
