// resources/js/Pages/Admin/Formations/Form.tsx
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Field,
    FormSection,
    inputCls,
    errorInputCls,
    ImageUpload,
    TagInput,
    MarkdownEditor,
    SegmentedControl,
    SwitchField,
} from '@/components/admin/shared';
import { TranslationPanel } from '@/components/admin/translation-panel';
import type { TranslationState } from '@/components/admin/translation-panel';
import { buttonVariants } from '@/components/ui/button';
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
    format: string;
    target_audience: string | null;
    prerequisites: string | null;
    outcomes: string[];
    cta_label: string | null;
    cta_url: string | null;
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
const levels = [
    { value: 'débutant', label: 'Débutant' },
    { value: 'intermédiaire', label: 'Intermédiaire' },
    { value: 'avancé', label: 'Avancé' },
];

const PAID_CTA_LABEL = 'Demander cette formation';
const FREE_CTA_LABEL = 'Réserver ma place gratuitement';

export default function FormationForm({
    formation,
    translation,
}: {
    formation: Formation | null;
    translation?: TranslationState;
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
        format: formation?.format ?? 'Cours en ligne',
        target_audience: formation?.target_audience ?? '',
        prerequisites: formation?.prerequisites ?? '',
        outcomes: formation?.outcomes ?? [],
        cta_label: formation?.cta_label ?? PAID_CTA_LABEL,
        cta_url: formation?.cta_url ?? '',
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

    function setAccess(access: 'free' | 'paid') {
        const isFree = access === 'free';

        setValues((current) => ({
            ...current,
            is_free: isFree,
            cta_label:
                current.cta_label === (isFree ? PAID_CTA_LABEL : FREE_CTA_LABEL)
                    ? isFree
                        ? FREE_CTA_LABEL
                        : PAID_CTA_LABEL
                    : current.cta_label,
        }));
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
        formData.append('format', values.format);
        formData.append('target_audience', values.target_audience ?? '');
        formData.append('prerequisites', values.prerequisites ?? '');
        values.outcomes.forEach((outcome) =>
            formData.append('outcomes[]', outcome),
        );
        formData.append('cta_label', values.cta_label ?? '');
        formData.append('cta_url', values.cta_url ?? '');
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
            forceFormData: true,
            preserveScroll: true,
            onError: (e) => {
                setErrors(e);
                setProcessing(false);
            },
            onSuccess: () => setErrors({}),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <AdminLayout
            breadcrumb={[
                { label: 'Formations', href: '/admin/formations' },
                {
                    label: isEdit
                        ? formation.title || 'Modifier'
                        : 'Nouvelle formation',
                },
            ]}
        >
            <Head
                title={`${isEdit ? 'Modifier' : 'Créer'} une formation — Admin`}
            />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="font-display text-[26px] leading-tight font-bold tracking-[-0.02em] text-slate-900">
                        {isEdit
                            ? 'Modifier la formation'
                            : 'Nouvelle formation'}
                    </h2>
                    <p className="mt-1 text-[14px] text-slate-500">
                        La fiche décrit la formation. Les dates en direct se
                        gèrent ensuite dans « Sessions ».
                    </p>
                </div>
                {isEdit && (
                    <Link
                        href={`/admin/formations/${formation.id}/sessions`}
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        Gérer les sessions
                    </Link>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <FormSection
                            title="L'essentiel"
                            description="Ce que voit le visiteur en premier, sur la carte et en haut de la page."
                        >
                            <Field label="Titre" required error={errors.title}>
                                <input
                                    type="text"
                                    value={values.title}
                                    onChange={(e) =>
                                        set('title', e.target.value)
                                    }
                                    placeholder="Ex. Laravel de zéro à la mise en ligne"
                                    className={cn(
                                        inputCls,
                                        errors.title && errorInputCls,
                                    )}
                                />
                            </Field>
                            <Field
                                label="Résumé"
                                required
                                error={errors.excerpt}
                            >
                                <textarea
                                    value={values.excerpt}
                                    onChange={(e) =>
                                        set('excerpt', e.target.value)
                                    }
                                    placeholder="En deux phrases : ce qu'on apprend et pour quel résultat."
                                    rows={3}
                                    className={cn(
                                        inputCls,
                                        'resize-none',
                                        errors.excerpt && errorInputCls,
                                    )}
                                />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Pour qui, et pour quoi"
                            description="Aide le visiteur à savoir si la formation est faite pour lui."
                            delay={0.03}
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Public visé"
                                    error={errors.target_audience}
                                >
                                    <textarea
                                        value={values.target_audience ?? ''}
                                        onChange={(e) =>
                                            set(
                                                'target_audience',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Développeurs débutants, étudiants…"
                                        rows={3}
                                        className={cn(inputCls, 'resize-none')}
                                    />
                                </Field>
                                <Field
                                    label="Prérequis"
                                    error={errors.prerequisites}
                                >
                                    <textarea
                                        value={values.prerequisites ?? ''}
                                        onChange={(e) =>
                                            set('prerequisites', e.target.value)
                                        }
                                        placeholder="Ce qu'il faut savoir avant de commencer…"
                                        rows={3}
                                        className={cn(inputCls, 'resize-none')}
                                    />
                                </Field>
                            </div>
                            <Field
                                label="À la fin, vous saurez… (un objectif par ligne)"
                                error={errors.outcomes}
                            >
                                <textarea
                                    value={values.outcomes.join('\n')}
                                    onChange={(e) =>
                                        set(
                                            'outcomes',
                                            e.target.value
                                                .split('\n')
                                                .map((item) => item.trim())
                                                .filter(Boolean),
                                        )
                                    }
                                    placeholder={
                                        'Créer une API Laravel\nDéployer une application'
                                    }
                                    rows={4}
                                    className={cn(inputCls, 'resize-none')}
                                />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Programme"
                            description="Le détail des modules, en Markdown. L'aperçu est identique au site."
                            delay={0.06}
                        >
                            <MarkdownEditor
                                value={values.content}
                                onChange={(v) => set('content', v)}
                                error={errors.content}
                            />
                        </FormSection>

                        <FormSection title="Détails" delay={0.09}>
                            <Field label="Niveau" required error={errors.level}>
                                <SegmentedControl
                                    value={values.level}
                                    onChange={(level) => set('level', level)}
                                    options={levels}
                                />
                            </Field>
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
                                    label="Format"
                                    required
                                    error={errors.format}
                                >
                                    <input
                                        type="text"
                                        value={values.format}
                                        onChange={(e) =>
                                            set('format', e.target.value)
                                        }
                                        placeholder="Sessions en direct sur Google Meet"
                                        className={cn(
                                            inputCls,
                                            errors.format && errorInputCls,
                                        )}
                                    />
                                </Field>
                                <Field
                                    label="Durée totale (heures)"
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
                            </div>
                            <Field label="Tags" error={errors.tags}>
                                <TagInput
                                    tags={values.tags}
                                    onChange={(v) => set('tags', v)}
                                />
                            </Field>
                        </FormSection>
                    </div>

                    <div className="space-y-5">
                        <FormSection
                            title="Accès"
                            description={
                                values.is_free
                                    ? 'Les visiteurs réservent leur place sans payer.'
                                    : 'Le prix est affiché sur la fiche.'
                            }
                            delay={0.03}
                        >
                            <SegmentedControl
                                value={values.is_free ? 'free' : 'paid'}
                                onChange={setAccess}
                                options={[
                                    { value: 'free', label: 'Gratuite' },
                                    { value: 'paid', label: 'Payante' },
                                ]}
                            />
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
                        </FormSection>

                        <FormSection
                            title="Inscription"
                            description="Par défaut, les visiteurs s'inscrivent avec le formulaire du site."
                            delay={0.05}
                        >
                            <Field
                                label="Texte du bouton d'inscription"
                                error={errors.cta_label}
                            >
                                <input
                                    type="text"
                                    value={values.cta_label ?? ''}
                                    onChange={(e) =>
                                        set('cta_label', e.target.value)
                                    }
                                    className={inputCls}
                                />
                            </Field>
                            <Field
                                label="Lien externe (optionnel)"
                                error={errors.cta_url}
                            >
                                <input
                                    type="url"
                                    value={values.cta_url ?? ''}
                                    onChange={(e) =>
                                        set('cta_url', e.target.value)
                                    }
                                    placeholder="https://…"
                                    className={inputCls}
                                />
                                <p className="text-[12px] text-slate-400">
                                    Rempli, le bouton principal mène vers ce
                                    lien (Udemy, YouTube…) au lieu du
                                    formulaire.
                                </p>
                            </Field>
                        </FormSection>

                        <FormSection title="Publication" delay={0.07}>
                            <SwitchField
                                label="Publiée"
                                description="Visible dans le catalogue public."
                                checked={values.published}
                                onChange={(checked) =>
                                    set('published', checked)
                                }
                            />
                            <SwitchField
                                label="Mise en avant"
                                description="Badge « Populaire » et première place."
                                checked={values.featured}
                                onChange={(checked) => set('featured', checked)}
                            />
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
                        </FormSection>

                        <FormSection delay={0.09}>
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
                                <p className="text-[12px] text-rose-600">
                                    {errors.cover_image}
                                </p>
                            )}
                        </FormSection>

                        <div className="flex flex-col gap-2 lg:sticky lg:top-24">
                            <button
                                type="submit"
                                disabled={processing}
                                className={buttonVariants({
                                    size: 'lg',
                                    className: 'w-full',
                                })}
                            >
                                {processing
                                    ? 'Enregistrement…'
                                    : isEdit
                                      ? 'Enregistrer les modifications'
                                      : 'Créer la formation'}
                            </button>
                            <Link
                                href="/admin/formations"
                                className={buttonVariants({
                                    variant: 'outline',
                                    size: 'lg',
                                    className: 'w-full',
                                })}
                            >
                                Annuler
                            </Link>
                        </div>
                    </div>
                </div>
            </form>

            {formation && translation && (
                <TranslationPanel
                    type="formations"
                    id={formation.id}
                    state={translation}
                />
            )}
        </AdminLayout>
    );
}
