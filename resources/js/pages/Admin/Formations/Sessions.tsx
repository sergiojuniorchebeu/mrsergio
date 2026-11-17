import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    AdminEmptyState,
    AdminPageHeader,
    AdminPanel,
    DeleteModal,
    Field,
    inputCls,
    errorInputCls,
    PublishedBadge,
    SwitchField,
} from '@/components/admin/shared';
import {
    SessionAvailability,
    SessionDate,
} from '@/components/portofolio/session-list';
import { buttonVariants } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface Session {
    id: number;
    title: string | null;
    starts_at: string;
    ends_at: string | null;
    meet_url: string | null;
    google_event_id: string | null;
    capacity: number | null;
    published: boolean;
    registered_count: number;
    attended_count: number;
}

interface GoogleCalendarStatus {
    configured: boolean;
    connected: boolean;
    email: string | null;
}

interface FormationRef {
    id: number;
    title: string;
    slug: string;
}

type SessionValues = {
    title: string;
    starts_at: string;
    ends_at: string;
    meet_url: string;
    capacity: string;
    published: boolean;
};

const EMPTY_VALUES: SessionValues = {
    title: '',
    starts_at: '',
    ends_at: '',
    meet_url: '',
    capacity: '',
    published: true,
};

function localDateTime(value: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60_000)
        .toISOString()
        .slice(0, 16);
}

function sessionValues(session: Session): SessionValues {
    return {
        title: session.title ?? '',
        starts_at: localDateTime(session.starts_at),
        ends_at: localDateTime(session.ends_at),
        meet_url: session.meet_url ?? '',
        capacity: session.capacity?.toString() ?? '',
        published: session.published,
    };
}

/**
 * Compte Google relié : chaque session obtient sa visio Meet, seuls les inscrits sont invités.
 */
function GoogleCalendarCard({ status }: { status: GoogleCalendarStatus }) {
    return (
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <p className="flex items-center gap-2 font-display text-[14px] font-semibold text-slate-900">
                    <span
                        className={cn(
                            'h-2 w-2 shrink-0 rounded-full',
                            status.connected ? 'bg-teal-500' : 'bg-slate-300',
                        )}
                    />
                    Google Agenda
                    {status.connected && status.email && (
                        <span className="truncate font-mono text-[12px] font-normal text-slate-500">
                            {status.email}
                        </span>
                    )}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                    {status.connected
                        ? 'Chaque nouvelle session reçoit sa visio Meet. Seuls les inscrits avec une place sont invités : réglez l’accès Meet sur « Restreint » pour que les autres doivent demander à entrer.'
                        : status.configured
                          ? 'Reliez votre compte pour créer les visios Meet automatiquement et n’inviter que les inscrits.'
                          : 'Ajoutez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans le fichier .env pour relier Google Agenda.'}
                </p>
            </div>
            {status.configured &&
                (status.connected ? (
                    <button
                        type="button"
                        onClick={() =>
                            router.delete('/admin/google-calendar', {
                                preserveScroll: true,
                            })
                        }
                        className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                            className: 'shrink-0',
                        })}
                    >
                        Déconnecter
                    </button>
                ) : (
                    <a
                        href="/admin/google-calendar/connect"
                        className={buttonVariants({
                            size: 'sm',
                            className: 'shrink-0',
                        })}
                    >
                        Relier Google Agenda
                    </a>
                ))}
        </div>
    );
}

export default function Sessions({
    formation,
    sessions,
    googleCalendar,
}: {
    formation: FormationRef;
    sessions: Session[];
    googleCalendar: GoogleCalendarStatus;
}) {
    const [values, setValues] = useState<SessionValues>(EMPTY_VALUES);
    const [editing, setEditing] = useState<Session | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [deleteTarget, setDeleteTarget] = useState<Session | null>(null);
    const [renderedAt] = useState(() => Date.now());

    const isEditing = editing !== null;
    const activeValues = editing ? sessionValues(editing) : values;

    function setValue<K extends keyof SessionValues>(
        key: K,
        value: SessionValues[K],
    ) {
        if (editing) {
            setEditing({
                ...editing,
                [key]:
                    key === 'capacity' ? (value ? Number(value) : null) : value,
            } as Session);
        } else {
            setValues((current) => ({ ...current, [key]: value }));
        }
    }

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const payload = {
            ...activeValues,
            capacity: activeValues.capacity || null,
            published: activeValues.published ? 1 : 0,
        };
        const url = editing
            ? `/admin/formation-sessions/${editing.id}`
            : `/admin/formations/${formation.id}/sessions`;
        const method = editing ? 'patch' : 'post';

        router[method](url, payload, {
            preserveScroll: true,
            onError: (formErrors) =>
                setErrors(formErrors as Record<string, string>),
            onSuccess: () => {
                setErrors({});
                setEditing(null);
                setValues(EMPTY_VALUES);
            },
        });
    }

    function removeSession() {
        if (!deleteTarget) return;
        router.delete(`/admin/formation-sessions/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AdminLayout title={`Sessions · ${formation.title}`}>
            <Head title={`Sessions — ${formation.title}`} />
            <AdminPageHeader
                title="Sessions"
                description={`${formation.title} · ${sessions.length} session${sessions.length > 1 ? 's' : ''}`}
                actions={
                    <Link
                        href="/admin/formations"
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        Formations
                    </Link>
                }
            />

            <GoogleCalendarCard status={googleCalendar} />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <AdminPanel>
                    {sessions.length === 0 ? (
                        <AdminEmptyState message="Aucune session programmée pour le moment." />
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {sessions.map((session) => {
                                const isPast =
                                    new Date(session.starts_at).getTime() <
                                    renderedAt;
                                const placesRemaining =
                                    session.capacity === null
                                        ? null
                                        : Math.max(
                                              0,
                                              session.capacity -
                                                  session.registered_count,
                                          );

                                return (
                                    <li
                                        key={session.id}
                                        className={cn(
                                            'flex flex-col gap-4 px-5 py-5 transition-colors sm:flex-row sm:items-center',
                                            editing?.id === session.id &&
                                                'bg-teal-50/50',
                                        )}
                                    >
                                        <div className="flex min-w-0 flex-1 items-center gap-4">
                                            <SessionDate
                                                startsAt={session.starts_at}
                                                isMuted={isPast}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-display text-[16px] font-semibold text-slate-900">
                                                    {session.title ||
                                                        'Session en direct'}
                                                </p>
                                                <p className="mt-0.5 font-mono text-[12px] text-teal-600">
                                                    {new Date(
                                                        session.starts_at,
                                                    ).toLocaleTimeString(
                                                        'fr-FR',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                    {session.ends_at &&
                                                        ` – ${new Date(
                                                            session.ends_at,
                                                        ).toLocaleTimeString(
                                                            'fr-FR',
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}`}
                                                </p>
                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                    {isPast ? (
                                                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                                                            Passée
                                                        </span>
                                                    ) : (
                                                        <PublishedBadge
                                                            published={
                                                                session.published
                                                            }
                                                        />
                                                    )}
                                                    <span
                                                        className={cn(
                                                            'rounded-full px-2.5 py-0.5 text-[11px] font-medium',
                                                            session.meet_url
                                                                ? 'bg-teal-50 text-teal-700'
                                                                : 'bg-amber-50 text-amber-700',
                                                        )}
                                                    >
                                                        {session.google_event_id
                                                            ? 'Meet · invités synchronisés'
                                                            : session.meet_url
                                                              ? 'Lien Meet prêt'
                                                              : 'Lien Meet manquant'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <SessionAvailability
                                            className="w-full sm:w-[150px]"
                                            session={{
                                                capacity: session.capacity,
                                                registered_count:
                                                    session.registered_count,
                                                places_remaining:
                                                    placesRemaining,
                                                is_full: placesRemaining === 0,
                                            }}
                                            label={`${session.registered_count}${session.capacity ? ` / ${session.capacity}` : ''} inscrit${session.registered_count > 1 ? 's' : ''}${isPast ? ` · ${session.attended_count} présent${session.attended_count > 1 ? 's' : ''}` : ''}`}
                                        />
                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditing(session)
                                                }
                                                className={buttonVariants({
                                                    variant: 'ghost',
                                                    size: 'sm',
                                                })}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeleteTarget(session)
                                                }
                                                className={buttonVariants({
                                                    variant: 'ghost',
                                                    size: 'sm',
                                                    className:
                                                        'text-rose-600 hover:bg-rose-50 hover:text-rose-700',
                                                })}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </AdminPanel>

                <form
                    onSubmit={submit}
                    className="h-fit space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:sticky lg:top-6"
                >
                    <div>
                        <p className="font-mono text-[12px] text-slate-500">
                            {isEditing ? 'Modification' : 'Nouvelle session'}
                        </p>
                        <h2 className="mt-1 font-display text-xl font-bold text-slate-900">
                            {isEditing
                                ? editing?.title || 'Session en direct'
                                : 'Programmer un cours'}
                        </h2>
                    </div>
                    <Field label="Nom de la session" error={errors.title}>
                        <input
                            value={activeValues.title}
                            onChange={(event) =>
                                setValue('title', event.target.value)
                            }
                            placeholder="Session du samedi"
                            className={cn(
                                inputCls,
                                errors.title && errorInputCls,
                            )}
                        />
                    </Field>
                    <Field label="Début" required error={errors.starts_at}>
                        <input
                            type="datetime-local"
                            value={activeValues.starts_at}
                            onChange={(event) =>
                                setValue('starts_at', event.target.value)
                            }
                            className={cn(
                                inputCls,
                                errors.starts_at && errorInputCls,
                            )}
                        />
                    </Field>
                    <Field label="Fin" error={errors.ends_at}>
                        <input
                            type="datetime-local"
                            value={activeValues.ends_at}
                            onChange={(event) =>
                                setValue('ends_at', event.target.value)
                            }
                            className={cn(
                                inputCls,
                                errors.ends_at && errorInputCls,
                            )}
                        />
                    </Field>
                    <Field label="Lien Google Meet" error={errors.meet_url}>
                        <input
                            type="url"
                            value={activeValues.meet_url}
                            onChange={(event) =>
                                setValue('meet_url', event.target.value)
                            }
                            placeholder={
                                googleCalendar.connected
                                    ? 'Vide : créé automatiquement'
                                    : 'https://meet.google.com/...'
                            }
                            className={cn(
                                inputCls,
                                errors.meet_url && errorInputCls,
                            )}
                        />
                    </Field>
                    <Field
                        label="Limite de participants"
                        error={errors.capacity}
                    >
                        <input
                            type="number"
                            min="1"
                            value={activeValues.capacity}
                            onChange={(event) =>
                                setValue('capacity', event.target.value)
                            }
                            placeholder="Laisser vide pour illimité"
                            className={cn(
                                inputCls,
                                errors.capacity && errorInputCls,
                            )}
                        />
                    </Field>
                    <SwitchField
                        label="Visible sur le site"
                        description="Les visiteurs peuvent voir la session et s’y inscrire."
                        checked={activeValues.published}
                        onChange={(checked) => setValue('published', checked)}
                    />
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className={buttonVariants()}>
                            {isEditing ? 'Enregistrer' : 'Ajouter la session'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => setEditing(null)}
                                className={buttonVariants({
                                    variant: 'outline',
                                })}
                            >
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <DeleteModal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={removeSession}
                label={`Session ${deleteTarget?.title ?? ''}`}
            />
        </AdminLayout>
    );
}
