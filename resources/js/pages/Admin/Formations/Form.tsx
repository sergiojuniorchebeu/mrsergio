// resources/js/Pages/Admin/Formations/Form.tsx
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

interface Formation {
    id: number;
    title: string;
    excerpt: string;
    content: string | null;
    category: string;
    tags: string[];
    level: string;
    language: string;
    duration_hours: number;
    lessons_count: number;
    is_free: boolean;
    price: number | null;
    featured: boolean;
    published: boolean;
    sort_order: number;
    cover_image: string | null;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const categories = [
    'Laravel',
    'Flutter',
    'Python',
    'Java',
    'React',
    'Vue',
    'Node.js',
    'Autre',
];
const levels = ['débutant', 'intermédiaire', 'avancé'];

export default function FormationForm({
    formation,
}: {
    formation: Formation | null;
}) {
    const isEdit = !!formation;

    const [values, setValues] = useState({
        title: formation?.title ?? '',
        excerpt: formation?.excerpt ?? '',
        content: formation?.content ?? '',
        category: formation?.category ?? 'Laravel',
        tags: formation?.tags ?? ([] as string[]),
        level: formation?.level ?? 'débutant',
        language: formation?.language ?? 'Français',
        duration_hours: formation?.duration_hours ?? 10,
        lessons_count: formation?.lessons_count ?? 20,
        is_free: formation?.is_free ?? false,
        price: formation?.price?.toString() ?? '',
        featured: formation?.featured ?? false,
        published: formation?.published ?? false,
        sort_order: formation?.sort_order ?? 0,
    });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    function set<K extends keyof typeof values>(
        key: K,
        value: (typeof values)[K],
    ) {
        setValues((v) => ({ ...v, [key]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        if (isEdit) formData.append('_method', 'PUT');

        formData.append('title', values.title);
        formData.append('excerpt', values.excerpt);
        formData.append('content', values.content);
        formData.append('category', values.category);
        formData.append('level', values.level);
        formData.append('language', values.language);
        formData.append('duration_hours', String(values.duration_hours));
        formData.append('lessons_count', String(values.lessons_count));
        formData.append('is_free', values.is_free ? '1' : '0');
        formData.append('featured', values.featured ? '1' : '0');
        formData.append('published', values.published ? '1' : '0');
        formData.append('sort_order', String(values.sort_order));
        if (!values.is_free && values.price)
            formData.append('price', values.price);
        values.tags.forEach((tag) => formData.append('tags[]', tag));
        if (coverImage) formData.append('cover_image', coverImage);

        const url = isEdit
            ? `/admin/formations/${formation.id}`
            : '/admin/formations';

        router.post(url, formData as any, {
            onError: (e) => {
                setErrors(e);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <AdminLayout
            title={isEdit ? 'Modifier la formation' : 'Nouvelle formation'}
        >
            <Head
                title={`${isEdit ? 'Modifier' : 'Créer'} une formation — Admin`}
            />

            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/admin/formations"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </Link>
                <div>
                    <h2 className="font-display text-xl font-bold text-slate-800">
                        {isEdit
                            ? 'Modifier la formation'
                            : 'Nouvelle formation'}
                    </h2>
                    {isEdit && (
                        <p className="mt-0.5 text-xs text-slate-400">
                            ID #{formation.id}
                        </p>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <Field label="Titre" required error={errors.title}>
                                <input
                                    type="text"
                                    value={values.title}
                                    onChange={(e) =>
                                        set('title', e.target.value)
                                    }
                                    placeholder="Titre de la formation"
                                    className={cn(
                                        inputCls,
                                        errors.title && errorInputCls,
                                    )}
                                />
                            </Field>
                            <Field
                                label="Description courte"
                                required
                                error={errors.excerpt}
                            >
                                <textarea
                                    value={values.excerpt}
                                    onChange={(e) =>
                                        set('excerpt', e.target.value)
                                    }
                                    placeholder="Résumé de la formation..."
                                    rows={3}
                                    className={cn(
                                        inputCls,
                                        'resize-none',
                                        errors.excerpt && errorInputCls,
                                    )}
                                />
                            </Field>
                            <Field
                                label="Programme (Markdown)"
                                error={errors.content}
                            >
                                <MarkdownEditor
                                    value={values.content}
                                    onChange={(v) => set('content', v)}
                                    error={errors.content}
                                />
                            </Field>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <h3 className="text-sm font-semibold text-slate-700">
                                Détails pédagogiques
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Catégorie"
                                    required
                                    error={errors.category}
                                >
                                    <select
                                        value={values.category}
                                        onChange={(e) =>
                                            set('category', e.target.value)
                                        }
                                        className={cn(
                                            inputCls,
                                            errors.category && errorInputCls,
                                        )}
                                    >
                                        {categories.map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field
                                    label="Niveau"
                                    required
                                    error={errors.level}
                                >
                                    <select
                                        value={values.level}
                                        onChange={(e) =>
                                            set('level', e.target.value)
                                        }
                                        className={cn(
                                            inputCls,
                                            errors.level && errorInputCls,
                                        )}
                                    >
                                        {levels.map((l) => (
                                            <option key={l}>{l}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Langue" error={errors.language}>
                                    <input
                                        type="text"
                                        value={values.language}
                                        onChange={(e) =>
                                            set('language', e.target.value)
                                        }
                                        placeholder="Français"
                                        className={inputCls}
                                    />
                                </Field>
                                <Field
                                    label="Durée (heures)"
                                    required
                                    error={errors.duration_hours}
                                >
                                    <input
                                        type="number"
                                        value={values.duration_hours}
                                        onChange={(e) =>
                                            set(
                                                'duration_hours',
                                                parseInt(e.target.value) || 1,
                                            )
                                        }
                                        min={1}
                                        className={cn(
                                            inputCls,
                                            errors.duration_hours &&
                                                errorInputCls,
                                        )}
                                    />
                                </Field>
                                <Field
                                    label="Nombre de leçons"
                                    required
                                    error={errors.lessons_count}
                                >
                                    <input
                                        type="number"
                                        value={values.lessons_count}
                                        onChange={(e) =>
                                            set(
                                                'lessons_count',
                                                parseInt(e.target.value) || 1,
                                            )
                                        }
                                        min={1}
                                        className={cn(
                                            inputCls,
                                            errors.lessons_count &&
                                                errorInputCls,
                                        )}
                                    />
                                </Field>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <h3 className="mb-3 text-sm font-semibold text-slate-700">
                                Tags
                            </h3>
                            <TagInput
                                tags={values.tags}
                                onChange={(v) => set('tags', v)}
                            />
                        </motion.div>
                    </div>

                    <div className="space-y-5">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.04 }}
                            className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <h3 className="text-sm font-semibold text-slate-700">
                                Prix
                            </h3>
                            <label className="flex cursor-pointer items-center justify-between">
                                <span className="text-sm text-slate-700">
                                    Formation gratuite
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        set('is_free', !values.is_free)
                                    }
                                    className={cn(
                                        'relative h-5 w-10 rounded-full transition-colors duration-200',
                                        values.is_free
                                            ? 'bg-teal-500'
                                            : 'bg-slate-300',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                                            values.is_free
                                                ? 'translate-x-5'
                                                : 'translate-x-0.5',
                                        )}
                                    />
                                </button>
                            </label>
                            {!values.is_free && (
                                <Field label="Prix (€)" error={errors.price}>
                                    <input
                                        type="number"
                                        value={values.price}
                                        onChange={(e) =>
                                            set('price', e.target.value)
                                        }
                                        placeholder="29.99"
                                        min={0}
                                        step={0.01}
                                        className={cn(
                                            inputCls,
                                            errors.price && errorInputCls,
                                        )}
                                    />
                                </Field>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.06 }}
                            className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <h3 className="text-sm font-semibold text-slate-700">
                                Publication
                            </h3>
                            <label className="flex cursor-pointer items-center justify-between">
                                <span className="text-sm text-slate-700">
                                    Publiée
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        set('published', !values.published)
                                    }
                                    className={cn(
                                        'relative h-5 w-10 rounded-full transition-colors duration-200',
                                        values.published
                                            ? 'bg-teal-500'
                                            : 'bg-slate-300',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                                            values.published
                                                ? 'translate-x-5'
                                                : 'translate-x-0.5',
                                        )}
                                    />
                                </button>
                            </label>
                            <label className="flex cursor-pointer items-center justify-between">
                                <span className="text-sm text-slate-700">
                                    Mise en avant
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        set('featured', !values.featured)
                                    }
                                    className={cn(
                                        'relative h-5 w-10 rounded-full transition-colors duration-200',
                                        values.featured
                                            ? 'bg-amber-500'
                                            : 'bg-slate-300',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                                            values.featured
                                                ? 'translate-x-5'
                                                : 'translate-x-0.5',
                                        )}
                                    />
                                </button>
                            </label>
                            <Field label="Ordre d'affichage">
                                <input
                                    type="number"
                                    value={values.sort_order}
                                    onChange={(e) =>
                                        set(
                                            'sort_order',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className={cn(inputCls, 'w-24')}
                                    min={0}
                                />
                            </Field>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <ImageUpload
                                label="Image de couverture"
                                value={coverImage}
                                onChange={setCoverImage}
                                currentUrl={
                                    formation?.cover_image
                                        ? `/storage/${formation.cover_image}`
                                        : null
                                }
                            />
                            {errors.cover_image && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.cover_image}
                                </p>
                            )}
                        </motion.div>

                        <div className="flex flex-col gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={cn(
                                    'flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-500/20 transition-all duration-200',
                                    processing
                                        ? 'cursor-not-allowed opacity-70'
                                        : 'hover:bg-teal-700',
                                )}
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>{' '}
                                        Enregistrement...
                                    </>
                                ) : isEdit ? (
                                    'Mettre à jour'
                                ) : (
                                    'Créer la formation'
                                )}
                            </button>
                            <Link
                                href="/admin/formations"
                                className="flex w-full items-center justify-center rounded-md border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                            >
                                Annuler
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
