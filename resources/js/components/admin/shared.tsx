// resources/js/components/admin/shared.tsx
// Briques partagées de l'admin : en-têtes, panneaux, badges, interrupteur de publication,
// modale de suppression, champs, upload d'images (glisser-déposer), tags, éditeur Markdown.

import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { markdownComponents } from '@/components/portofolio/markdown';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// EN-TÊTE DE PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function AdminPageHeader({
    title,
    description,
    actions,
}: {
    title: string;
    description?: ReactNode;
    actions?: ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h2 className="font-display text-[26px] leading-tight font-bold tracking-[-0.02em] text-slate-900">
                    {title}
                </h2>
                {description && (
                    <div className="mt-1 text-[14px] text-slate-500">
                        {description}
                    </div>
                )}
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANNEAU
// ─────────────────────────────────────────────────────────────────────────────
export function AdminPanel({
    title,
    actions,
    children,
    className,
}: {
    title?: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            className={cn(
                'overflow-hidden rounded-2xl border border-slate-200/80 bg-white',
                className,
            )}
        >
            {(title || actions) && (
                <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-3.5">
                    {title && (
                        <h3 className="font-display text-[14px] font-semibold text-slate-900">
                            {title}
                        </h3>
                    )}
                    {actions}
                </header>
            )}
            {children}
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ÉTAT VIDE
// ─────────────────────────────────────────────────────────────────────────────
export function AdminEmptyState({
    message,
    action,
}: {
    message: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <p className="text-[15px] text-slate-500">{message}</p>
            {action}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// BADGE PUBLIÉ
// ─────────────────────────────────────────────────────────────────────────────
export function PublishedBadge({ published }: { published: boolean }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold',
                published
                    ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-100'
                    : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
            )}
        >
            <span
                className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    published ? 'bg-teal-500' : 'bg-slate-400',
                )}
            />
            {published ? 'Publié' : 'Brouillon'}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERRUPTEUR DE PUBLICATION
// ─────────────────────────────────────────────────────────────────────────────
export function TogglePublished({
    published,
    route,
}: {
    published: boolean;
    route: string;
}) {
    const [loading, setLoading] = useState(false);

    function toggle() {
        setLoading(true);
        router.patch(
            route,
            { published: !published },
            { preserveScroll: true, onFinish: () => setLoading(false) },
        );
    }

    return (
        <button
            type="button"
            role="switch"
            aria-checked={published}
            onClick={toggle}
            disabled={loading}
            title={published ? 'Dépublier' : 'Publier'}
            className={cn(
                'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:outline-none',
                published ? 'bg-teal-600' : 'bg-slate-300',
                loading && 'cursor-wait opacity-60',
            )}
        >
            <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm',
                    published ? 'right-0.5' : 'left-0.5',
                )}
            />
        </button>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODALE DE SUPPRESSION
// ─────────────────────────────────────────────────────────────────────────────
export function DeleteModal({
    open,
    onClose,
    onConfirm,
    label,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    label: string;
}) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKey);

        return () => window.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="delete-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                        initial={{ opacity: 0, scale: 0.96, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        onClick={(event) => event.stopPropagation()}
                        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
                    >
                        <h3
                            id="delete-modal-title"
                            className="font-display text-[17px] font-bold text-slate-900"
                        >
                            Supprimer définitivement ?
                        </h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                            <span className="font-semibold text-slate-800">
                                «&nbsp;{label}&nbsp;»
                            </span>{' '}
                            sera supprimé. Cette action est irréversible.
                        </p>
                        <div className="mt-6 flex gap-2">
                            <button
                                type="button"
                                autoFocus
                                onClick={onClose}
                                className={buttonVariants({
                                    variant: 'outline',
                                    className: 'flex-1',
                                })}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                className={buttonVariants({
                                    variant: 'destructive',
                                    className: 'flex-1',
                                })}
                            >
                                Supprimer
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLISSER-DÉPOSER
// ─────────────────────────────────────────────────────────────────────────────
function useFileDrop(onFiles: (files: File[]) => void) {
    const [isDragging, setIsDragging] = useState(false);

    return {
        isDragging,
        dropProps: {
            onDragOver: (event: React.DragEvent) => {
                event.preventDefault();
                setIsDragging(true);
            },
            onDragLeave: () => setIsDragging(false),
            onDrop: (event: React.DragEvent) => {
                event.preventDefault();
                setIsDragging(false);
                onFiles(
                    Array.from(event.dataTransfer.files).filter((file) =>
                        file.type.startsWith('image/'),
                    ),
                );
            },
        },
    };
}

/**
 * URL d'aperçu d'un fichier local, libérée automatiquement.
 */
function useObjectUrl(file: File | null): string | null {
    const url = useMemo(
        () => (file ? URL.createObjectURL(file) : null),
        [file],
    );

    useEffect(() => {
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [url]);

    return url;
}

function RemoveButton({
    onClick,
    label,
}: {
    onClick: () => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/70 text-white transition-colors hover:bg-rose-600"
        >
            <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE UNIQUE
// ─────────────────────────────────────────────────────────────────────────────
export function ImageUpload({
    value,
    onChange,
    currentUrl,
    label = 'Image de couverture',
}: {
    value: File | null;
    onChange: (file: File | null) => void;
    currentUrl?: string | null;
    label?: string;
}) {
    const objectUrl = useObjectUrl(value);
    const preview = objectUrl ?? currentUrl ?? null;
    const { isDragging, dropProps } = useFileDrop(
        (files) => files[0] && onChange(files[0]),
    );

    return (
        <div className="space-y-2">
            <span className="block font-display text-[13px] font-semibold text-slate-700">
                {label}
            </span>
            <div
                {...dropProps}
                className={cn(
                    'relative overflow-hidden rounded-xl border-2 border-dashed transition-colors duration-200',
                    isDragging
                        ? 'border-teal-500 bg-teal-50/60'
                        : preview
                          ? 'border-slate-200'
                          : 'border-slate-300 hover:border-teal-400',
                )}
            >
                {preview ? (
                    <div className="relative aspect-[16/9]">
                        <img
                            src={preview}
                            alt="Aperçu"
                            className="h-full w-full object-cover"
                        />
                        <RemoveButton
                            onClick={() => onChange(null)}
                            label="Retirer l'image"
                        />
                        <label className="absolute inset-0 flex cursor-pointer items-end justify-start bg-slate-950/0 p-3 opacity-0 transition hover:bg-slate-950/30 hover:opacity-100">
                            <span className="rounded-md bg-white px-2.5 py-1 text-[12px] font-semibold text-slate-800">
                                Remplacer
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) =>
                                    onChange(event.target.files?.[0] ?? null)
                                }
                            />
                        </label>
                    </div>
                ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 p-8 text-center">
                        <p className="text-[14px] text-slate-600">
                            <span className="font-semibold text-teal-700">
                                Choisir une image
                            </span>{' '}
                            ou la glisser ici
                        </p>
                        <p className="text-[12px] text-slate-400">
                            PNG, JPG, WebP · 2 Mo max
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) =>
                                onChange(event.target.files?.[0] ?? null)
                            }
                        />
                    </label>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGES MULTIPLES
// ─────────────────────────────────────────────────────────────────────────────
const MAX_SCREENSHOTS = 8;

function NewImagePreview({
    file,
    index,
    onRemove,
}: {
    file: File;
    index: number;
    onRemove: () => void;
}) {
    const url = useObjectUrl(file);

    return (
        <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {url && (
                <img
                    src={url}
                    alt={`Nouvelle capture ${index + 1}`}
                    className="h-full w-full object-cover"
                />
            )}
            <span className="absolute bottom-1.5 left-1.5 rounded bg-teal-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                Nouveau
            </span>
            <RemoveButton onClick={onRemove} label="Retirer cette capture" />
        </div>
    );
}

export function MultiImageUpload({
    values,
    onChange,
    currentUrls = [],
    onRemoveCurrent,
    label = "Captures d'écran (max 8)",
}: {
    values: File[];
    onChange: (files: File[]) => void;
    currentUrls?: string[];
    onRemoveCurrent?: (index: number) => void;
    label?: string;
}) {
    const remaining = MAX_SCREENSHOTS - (values.length + currentUrls.length);

    function addFiles(files: File[]) {
        onChange([...values, ...files.slice(0, Math.max(0, remaining))]);
    }

    const { isDragging, dropProps } = useFileDrop(addFiles);

    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between">
                <span className="block font-display text-[13px] font-semibold text-slate-700">
                    {label}
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                    {values.length + currentUrls.length}/{MAX_SCREENSHOTS}
                </span>
            </div>
            <div
                {...dropProps}
                className={cn(
                    'grid grid-cols-3 gap-3 rounded-xl p-1 transition-colors sm:grid-cols-4',
                    isDragging && 'bg-teal-50 outline-2 outline-teal-500 outline-dashed',
                )}
            >
                {currentUrls.map((url, index) => (
                    <div
                        key={url}
                        className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                    >
                        <img
                            src={url}
                            alt={`Capture ${index + 1}`}
                            className="h-full w-full object-cover"
                        />
                        {onRemoveCurrent && (
                            <RemoveButton
                                onClick={() => onRemoveCurrent(index)}
                                label="Supprimer cette capture"
                            />
                        )}
                    </div>
                ))}
                {values.map((file, index) => (
                    <NewImagePreview
                        key={`${file.name}-${file.lastModified}-${index}`}
                        file={file}
                        index={index}
                        onRemove={() =>
                            onChange(
                                values.filter(
                                    (_, position) => position !== index,
                                ),
                            )
                        }
                    />
                ))}
                {remaining > 0 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-center text-slate-500 transition-colors hover:border-teal-400 hover:text-teal-700">
                        <span className="text-[22px] leading-none">+</span>
                        <span className="text-[12px] font-semibold">
                            Ajouter
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(event) =>
                                addFiles(Array.from(event.target.files ?? []))
                            }
                        />
                    </label>
                )}
            </div>
            <p className="text-[12px] text-slate-400">
                Glissez vos images ici · PNG, JPG, WebP · 2 Mo max chacune
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAMP (libellé + erreur)
// ─────────────────────────────────────────────────────────────────────────────
export function Field({
    label,
    required = false,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block font-display text-[13px] font-semibold text-slate-700">
                {label} {required && <span className="text-teal-600">*</span>}
            </label>
            {children}
            <AnimatePresence initial={false}>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[12px] text-rose-600"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

export const inputCls = cn(
    'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-slate-900 outline-none placeholder:text-slate-400',
    'transition-[border-color,box-shadow] duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10',
);

export const errorInputCls =
    'border-rose-300 focus:border-rose-400 focus:ring-rose-400/15';

// ─────────────────────────────────────────────────────────────────────────────
// TAGS
// ─────────────────────────────────────────────────────────────────────────────
export function TagInput({
    tags,
    onChange,
}: {
    tags: string[];
    onChange: (tags: string[]) => void;
}) {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    function add() {
        const value = input.trim().replace(/,$/, '');

        if (value && !tags.includes(value)) {
            onChange([...tags, value]);
        }

        setInput('');
    }

    return (
        <div
            onClick={() => inputRef.current?.focus()}
            className={cn(
                inputCls,
                'flex min-h-[46px] cursor-text flex-wrap items-center gap-1.5 py-2',
            )}
        >
            <AnimatePresence initial={false}>
                {tags.map((tag) => (
                    <motion.span
                        key={tag}
                        layout
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 py-1 pr-1 pl-2 text-[12px] font-medium text-slate-700"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() =>
                                onChange(
                                    tags.filter((current) => current !== tag),
                                )
                            }
                            aria-label={`Retirer ${tag}`}
                            className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                        >
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                aria-hidden
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </motion.span>
                ))}
            </AnimatePresence>
            <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ',') {
                        event.preventDefault();
                        add();
                    } else if (
                        event.key === 'Backspace' &&
                        input === '' &&
                        tags.length > 0
                    ) {
                        onChange(tags.slice(0, -1));
                    }
                }}
                onBlur={add}
                placeholder={
                    tags.length === 0 ? 'Tapez un tag puis Entrée' : ''
                }
                className="min-w-[120px] flex-1 border-0 bg-transparent p-0 text-[14px] outline-none placeholder:text-slate-400"
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ÉDITEUR MARKDOWN (aperçu identique au site)
// ─────────────────────────────────────────────────────────────────────────────
type EditorMode = 'edit' | 'split' | 'preview';

const EDITOR_MODES: { value: EditorMode; label: string }[] = [
    { value: 'edit', label: 'Éditeur' },
    { value: 'split', label: 'Côte à côte' },
    { value: 'preview', label: 'Aperçu' },
];

export function MarkdownEditor({
    value,
    onChange,
    error,
}: {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}) {
    const [mode, setMode] = useState<EditorMode>('edit');
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

    const editor = (
        <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={18}
            placeholder="Rédigez le contenu en Markdown… (## pour un titre, - pour une liste, **gras**)"
            className={cn(
                inputCls,
                'min-h-[24rem] resize-y font-mono text-[13px] leading-relaxed',
                error && errorInputCls,
            )}
        />
    );

    const preview = (
        <div className="min-h-[24rem] overflow-auto rounded-lg border border-slate-200 bg-white p-6">
            {value.trim() ? (
                <ReactMarkdown components={markdownComponents}>
                    {value}
                </ReactMarkdown>
            ) : (
                <p className="text-[14px] text-slate-400">
                    Rien à afficher pour l&apos;instant.
                </p>
            )}
        </div>
    );

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <div className="flex w-fit gap-1 rounded-lg bg-slate-100 p-1">
                    {EDITOR_MODES.map((editorMode) => (
                        <button
                            key={editorMode.value}
                            type="button"
                            onClick={() => setMode(editorMode.value)}
                            className={cn(
                                'rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors',
                                editorMode.value === 'split' &&
                                    'hidden lg:block',
                                mode === editorMode.value
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800',
                            )}
                        >
                            {editorMode.label}
                        </button>
                    ))}
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                    {wordCount} mots
                </span>
            </div>

            {mode === 'edit' && editor}
            {mode === 'preview' && preview}
            {mode === 'split' && (
                <div className="grid gap-3 lg:grid-cols-2">
                    {editor}
                    {preview}
                </div>
            )}

            {error && <p className="text-[12px] text-rose-600">{error}</p>}
        </div>
    );
}
