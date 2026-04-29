// resources/js/components/admin/shared.tsx
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// BADGE PUBLISHED
// ─────────────────────────────────────────────────────────────────────────────
export function PublishedBadge({ published }: { published: boolean }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                published
                    ? 'border border-teal-100 bg-teal-50 text-teal-700'
                    : 'border border-slate-200 bg-slate-100 text-slate-500',
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
// TOGGLE PUBLISHED (switch inline dans la table)
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
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            },
        );
    }

    return (
        <button
            onClick={toggle}
            disabled={loading}
            title={published ? 'Dépublier' : 'Publier'}
            className={cn(
                'relative h-5 w-10 rounded-full transition-colors duration-200 focus:outline-none',
                published ? 'bg-teal-500' : 'bg-slate-300',
                loading && 'cursor-not-allowed opacity-60',
            )}
        >
            <span
                className={cn(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                    published ? 'translate-x-5' : 'translate-x-0.5',
                )}
            />
        </button>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE MODAL
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
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-100 bg-red-50">
                                <svg
                                    className="h-6 w-6 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-1 text-center text-base font-semibold text-slate-800">
                                Confirmer la suppression
                            </h3>
                            <p className="mb-6 text-center text-sm text-slate-500">
                                Supprimer{' '}
                                <span className="font-semibold text-slate-700">
                                    «&nbsp;{label}&nbsp;»
                                </span>{' '}
                                ? Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 rounded-md border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 rounded-md bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE UPLOAD avec preview
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
    const preview = value ? URL.createObjectURL(value) : (currentUrl ?? null);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            <div
                className={cn(
                    'relative rounded-xl border-2 border-dashed transition-colors duration-200',
                    preview
                        ? 'border-slate-200'
                        : 'border-slate-300 hover:border-teal-400',
                )}
            >
                {preview ? (
                    <div className="relative h-40 overflow-hidden rounded-xl">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                        >
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <label className="absolute inset-0 cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    onChange(e.target.files?.[0] ?? null)
                                }
                            />
                        </label>
                    </div>
                ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 p-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-500">
                            <span className="font-semibold text-teal-600">
                                Choisir
                            </span>{' '}
                            ou glisser une image
                        </p>
                        <p className="text-xs text-slate-400">
                            PNG, JPG, WebP · max 2 Mo
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                                onChange(e.target.files?.[0] ?? null)
                            }
                        />
                    </label>
                )}
            </div>
        </div>
    );
}

// Multi image upload (max N previews, can remove before submit)
export function MultiImageUpload({
    values,
    onChange,
    currentUrls = [],
    label = "Captures d'écran (max 8)",
}: {
    values: File[];
    onChange: (files: File[]) => void;
    currentUrls?: string[];
    label?: string;
}) {
    function addFiles(files: FileList | null) {
        if (!files) return;
        const arr = Array.from(files).slice(
            0,
            8 - (values.length + currentUrls.length),
        );
        onChange([...values, ...arr]);
    }

    function removeAt(index: number) {
        const copy = [...values];
        copy.splice(index, 1);
        onChange(copy);
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            <div className="grid grid-cols-4 gap-3">
                {currentUrls.map((u, i) => (
                    <div
                        key={`cur-${i}`}
                        className="relative h-24 w-full overflow-hidden rounded-lg border"
                    >
                        <img
                            src={u}
                            alt={`screenshot-${i}`}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ))}
                {values.map((f, i) => (
                    <div
                        key={`new-${i}`}
                        className="relative h-24 w-full overflow-hidden rounded-lg border"
                    >
                        <img
                            src={URL.createObjectURL(f)}
                            alt={`preview-${i}`}
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeAt(i)}
                            className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                        >
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
                {values.length + currentUrls.length < 8 && (
                    <label className="flex h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed p-2 text-slate-400">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => addFiles(e.target.files)}
                        />
                        <div className="text-center">
                            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-slate-100">
                                <svg
                                    className="h-4 w-4 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.8}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <p className="text-xs">Ajouter</p>
                        </div>
                    </label>
                )}
            </div>
            <p className="text-xs text-slate-400">
                Jusqu\'à 8 images, PNG/JPG/WebP · max 2 Mo chacune
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD (label + erreur)
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
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
                {label} {required && <span className="text-teal-600">*</span>}
            </label>
            {children}
            {error && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                    <svg
                        className="h-3 w-3 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}

export const inputCls = cn(
    'w-full rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400',
    'border border-slate-200 bg-white outline-none',
    'transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/15',
);

export const errorInputCls =
    'border-red-300 focus:border-red-400 focus:ring-red-400/15';

// ─────────────────────────────────────────────────────────────────────────────
// TAG INPUT
// ─────────────────────────────────────────────────────────────────────────────
export function TagInput({
    tags,
    onChange,
}: {
    tags: string[];
    onChange: (tags: string[]) => void;
}) {
    const [input, setInput] = useState('');

    function add() {
        const val = input.trim();
        if (val && !tags.includes(val)) onChange([...tags, val]);
        setInput('');
    }

    function remove(tag: string) {
        onChange(tags.filter((t) => t !== tag));
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            add();
                        }
                    }}
                    placeholder="Ajouter un tag et Entrée"
                    className={inputCls}
                />
                <button
                    type="button"
                    onClick={add}
                    className="flex-shrink-0 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
                >
                    Ajouter
                </button>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => remove(tag)}
                                className="ml-0.5 text-slate-400 hover:text-slate-700"
                            >
                                <svg
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKDOWN EDITOR avec preview
// ─────────────────────────────────────────────────────────────────────────────
export function MarkdownEditor({
    value,
    onChange,
    error,
}: {
    value: string;
    onChange: (v: string) => void;
    error?: string;
}) {
    const [tab, setTab] = useState<'edit' | 'preview'>('edit');

    return (
        <div className="space-y-1.5">
            {/* Tabs */}
            <div className="flex w-fit gap-1 rounded-xl bg-slate-100 p-1">
                {(['edit', 'preview'] as const).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTab(t)}
                        className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150',
                            tab === t
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700',
                        )}
                    >
                        {t === 'edit' ? 'Éditeur' : 'Aperçu'}
                    </button>
                ))}
            </div>

            {tab === 'edit' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={14}
                    placeholder="Rédigez le contenu en Markdown..."
                    className={cn(
                        inputCls,
                        'resize-y font-mono text-xs leading-relaxed',
                        error && errorInputCls,
                    )}
                />
            ) : (
                <div
                    className="prose prose-sm min-h-[14rem] max-w-none overflow-auto rounded-xl border border-slate-200 bg-white p-4 prose-slate"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
                />
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

// Mini Markdown → HTML (sans dépendance externe)
function markdownToHtml(md: string): string {
    return md
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hul])/gm, '<p>')
        .replace(/(?<![>])$/gm, '</p>');
}
