// resources/js/Pages/Admin/Blog/Form.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Field,
    inputCls,
    errorInputCls,
    ImageUpload,
    TagInput,
    MarkdownEditor,
} from '@/components/admin/shared';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Post {
    id: number;
    title: string;
    excerpt: string;
    content: string | null;
    tags: string[];
    featured: boolean;
    published: boolean;
    published_at: string | null;
    cover_image: string | null;
}

interface FormErrors {
    title?: string;
    excerpt?: string;
    content?: string;
    tags?: string;
    featured?: string;
    published?: string;
    published_at?: string;
    cover_image?: string;
}

// ─── Icônes ───────────────────────────────────────────────────────────────────
const Ico = {
    Back: () => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
        >
            <path
                d="M9 2L4 7l5 5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    Save: () => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
        >
            <path
                d="M2 2h8l2 2v8a1 1 0 01-1 1H3a1 1 0 01-1-1V2z"
                strokeLinejoin="round"
            />
            <path d="M4 2v4h6V2M4 10v2M10 10v2" strokeLinecap="round" />
        </svg>
    ),
    Spinner: () => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="animate-spin"
            aria-hidden
        >
            <circle
                cx="7"
                cy="7"
                r="5.5"
                stroke="currentColor"
                strokeOpacity="0.2"
                strokeWidth="1.5"
            />
            <path
                d="M7 1.5A5.5 5.5 0 0112.5 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    ),
};

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({
    checked,
    onChange,
    label,
    accent = 'teal',
}: {
    checked: boolean;
    onChange: () => void;
    label: string;
    accent?: 'teal' | 'amber';
}) {
    return (
        <label className="group flex cursor-pointer items-center justify-between py-1">
            <span className="text-[13px] font-medium text-slate-700 transition-colors group-hover:text-slate-900">
                {label}
            </span>
            <button
                type="button"
                onClick={onChange}
                aria-label={label}
                className={cn(
                    'relative h-5 w-10 flex-shrink-0 rounded-full transition-colors duration-200',
                    checked
                        ? accent === 'teal'
                            ? 'bg-teal-500'
                            : 'bg-amber-500'
                        : 'bg-slate-200',
                )}
            >
                <span
                    className={cn(
                        'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                        checked ? 'translate-x-5' : 'translate-x-0.5',
                    )}
                />
            </button>
        </label>
    );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.35,
                ease: [0, 0, 0.2, 1] as [number, number, number, number],
                delay,
            }}
            className={cn(
                'rounded-2xl border border-slate-200/70 bg-white',
                className,
            )}
        >
            {children}
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogForm({ post }: { post: Post | null }) {
    const isEdit = !!post;

    const [values, setValues] = useState({
        title: post?.title ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? '',
        tags: post?.tags ?? ([] as string[]),
        featured: post?.featured ?? false,
        published: post?.published ?? false,
        published_at: post?.published_at ? post.published_at.slice(0, 10) : '',
    });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    function set<K extends keyof typeof values>(
        key: K,
        val: (typeof values)[K],
    ) {
        setValues((v) => ({ ...v, [key]: val }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const fd = new FormData();
        if (isEdit) fd.append('_method', 'PUT');

        fd.append('title', values.title);
        fd.append('excerpt', values.excerpt);
        fd.append('content', values.content);
        fd.append('featured', values.featured ? '1' : '0');
        fd.append('published', values.published ? '1' : '0');
        if (values.published_at) fd.append('published_at', values.published_at);
        values.tags.forEach((t) => fd.append('tags[]', t));
        if (coverImage) fd.append('cover_image', coverImage);

        router.post(
            isEdit ? `/admin/blog/${post.id}` : '/admin/blog',
            fd as any,
            {
                onError: (e) => {
                    setErrors(e);
                    setProcessing(false);
                },
                onFinish: () => setProcessing(false),
            },
        );
    }

    const pageTitle = isEdit ? "Modifier l'article" : 'Nouvel article';

    return (
        <AdminLayout
            title={pageTitle}
            breadcrumb={[
                { label: 'Blog', href: '/admin/blog' },
                { label: isEdit ? 'Modifier' : 'Nouvel article' },
            ]}
        >
            <Head
                title={`${isEdit ? 'Modifier' : 'Créer'} un article — Admin`}
            />

            {/* ── Page Header ───────────────────────────────────────── */}
            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/admin/blog"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-all duration-150 hover:bg-slate-100 hover:text-slate-700"
                    title="Retour"
                >
                    <Ico.Back />
                </Link>
                <div>
                    <h2 className="text-[20px] font-bold tracking-tight text-slate-900">
                        {pageTitle}
                    </h2>
                    {isEdit && (
                        <p className="mt-0.5 text-[11px] text-slate-400">
                            ID #{post.id}
                        </p>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {/* ─── Colonne principale (2/3) ──────────────── */}
                    <div className="space-y-4 lg:col-span-2">
                        {/* Titre + Extrait */}
                        <SectionCard delay={0.02} className="space-y-5 p-5">
                            <Field label="Titre" required error={errors.title}>
                                <input
                                    type="text"
                                    value={values.title}
                                    onChange={(e) =>
                                        set('title', e.target.value)
                                    }
                                    placeholder="Titre de l'article"
                                    autoFocus
                                    className={cn(
                                        inputCls,
                                        errors.title && errorInputCls,
                                    )}
                                />
                            </Field>
                            <Field
                                label="Extrait"
                                required
                                error={errors.excerpt}
                            >
                                <textarea
                                    value={values.excerpt}
                                    onChange={(e) =>
                                        set('excerpt', e.target.value)
                                    }
                                    placeholder="Résumé court affiché dans la liste des articles…"
                                    rows={3}
                                    className={cn(
                                        inputCls,
                                        'resize-none',
                                        errors.excerpt && errorInputCls,
                                    )}
                                />
                                <p className="mt-1 text-[11px] text-slate-400">
                                    {values.excerpt.length} / 200 caractères
                                    recommandés
                                </p>
                            </Field>
                        </SectionCard>

                        {/* Contenu Markdown */}
                        <SectionCard delay={0.05} className="p-5">
                            <Field label="Contenu" error={errors.content}>
                                <MarkdownEditor
                                    value={values.content}
                                    onChange={(v) => set('content', v)}
                                    error={errors.content}
                                />
                            </Field>
                        </SectionCard>

                        {/* Tags */}
                        <SectionCard delay={0.08} className="p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-[13px] font-semibold text-slate-800">
                                    Tags
                                </p>
                                <span className="text-[11px] text-slate-400">
                                    {values.tags.length} tag
                                    {values.tags.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <TagInput
                                tags={values.tags}
                                onChange={(v) => set('tags', v)}
                            />
                            {errors.tags && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {errors.tags}
                                </p>
                            )}
                        </SectionCard>
                    </div>

                    {/* ─── Colonne latérale (1/3) ────────────────── */}
                    <div className="space-y-4">
                        {/* Publication */}
                        <SectionCard delay={0.03} className="p-5">
                            <p className="mb-4 text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                                Publication
                            </p>
                            <div className="space-y-2">
                                <Toggle
                                    checked={values.published}
                                    onChange={() =>
                                        set('published', !values.published)
                                    }
                                    label="Publier"
                                    accent="teal"
                                />
                                <Toggle
                                    checked={values.featured}
                                    onChange={() =>
                                        set('featured', !values.featured)
                                    }
                                    label="Mettre en avant"
                                    accent="amber"
                                />
                            </div>

                            {values.published && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-4 border-t border-slate-100 pt-4"
                                >
                                    <Field
                                        label="Date de publication"
                                        error={errors.published_at}
                                    >
                                        <input
                                            type="date"
                                            value={values.published_at}
                                            onChange={(e) =>
                                                set(
                                                    'published_at',
                                                    e.target.value,
                                                )
                                            }
                                            className={cn(
                                                inputCls,
                                                errors.published_at &&
                                                    errorInputCls,
                                            )}
                                        />
                                    </Field>
                                </motion.div>
                            )}
                        </SectionCard>

                        {/* Image de couverture */}
                        <SectionCard delay={0.06} className="p-5">
                            <p className="mb-4 text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                                Couverture
                            </p>
                            <ImageUpload
                                label="Image de couverture"
                                value={coverImage}
                                onChange={setCoverImage}
                                currentUrl={
                                    post?.cover_image
                                        ? `/storage/${post.cover_image}`
                                        : null
                                }
                            />
                            {errors.cover_image && (
                                <p className="mt-2 text-[11px] text-red-500">
                                    {errors.cover_image}
                                </p>
                            )}
                        </SectionCard>

                        {/* Boutons */}
                        <SectionCard
                            delay={0.08}
                            className="flex flex-col gap-2 p-4"
                        >
                            <button
                                type="submit"
                                disabled={processing}
                                className={cn(
                                    'flex w-full items-center justify-center gap-2',
                                    'rounded-md py-2.5 text-[13px] font-semibold text-white',
                                    'bg-teal-600',
                                    'shadow-[0_1px_3px_rgba(29,158,117,0.3)]',
                                    'transition-all duration-200',
                                    processing
                                        ? 'cursor-not-allowed opacity-60'
                                        : 'hover:bg-teal-700 hover:shadow-[0_4px_12px_rgba(29,158,117,0.35)]',
                                )}
                            >
                                {processing ? (
                                    <>
                                        <Ico.Spinner /> Enregistrement…
                                    </>
                                ) : (
                                    <>
                                        <Ico.Save />{' '}
                                        {isEdit
                                            ? 'Mettre à jour'
                                            : "Publier l'article"}
                                    </>
                                )}
                            </button>

                            <Link
                                href="/admin/blog"
                                className={cn(
                                    'flex w-full items-center justify-center',
                                    'rounded-md py-2.5 text-[13px] font-medium text-slate-600',
                                    'border border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                                    'transition-all duration-150',
                                )}
                            >
                                Annuler
                            </Link>
                        </SectionCard>

                        {/* Statut rapide */}
                        {isEdit && (
                            <SectionCard delay={0.1} className="p-4">
                                <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                                    Statut actuel
                                </p>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'h-2 w-2 flex-shrink-0 rounded-full',
                                            post.published
                                                ? 'bg-teal-500'
                                                : 'bg-slate-300',
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            'text-[12px] font-medium',
                                            post.published
                                                ? 'text-teal-700'
                                                : 'text-slate-500',
                                        )}
                                    >
                                        {post.published
                                            ? 'Publié'
                                            : 'Brouillon'}
                                    </span>
                                    {post.published && post.published_at && (
                                        <span className="ml-auto text-[11px] text-slate-400">
                                            {new Date(
                                                post.published_at,
                                            ).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    )}
                                </div>
                            </SectionCard>
                        )}
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
