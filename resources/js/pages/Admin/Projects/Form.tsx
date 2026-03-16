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
    MultiImageUpload,
} from '@/components/admin/shared';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

type ProjectType = 'web' | 'mobile' | 'desktop' | 'api';

interface StoreLinks {
    play_store: string;
    app_store: string;
    windows: string;
    macos: string;
    linux: string;
    docs: string;
    postman: string;
    base_url: string;
}

interface Project {
    id: number;
    title: string;
    project_type: ProjectType;
    description: string;
    content: string | null;
    demo_url: string | null;
    github_url: string | null;
    tags: string[];
    featured: boolean;
    published: boolean;
    sort_order: number;
    image: string | null;
    private_repo?: boolean;
    platforms?: string[];
    screenshots?: string[];
    store_links?: Partial<StoreLinks>;
}

interface FormErrors {
    title?: string;
    project_type?: string;
    description?: string;
    content?: string;
    demo_url?: string;
    github_url?: string;
    tags?: string;
    featured?: string;
    published?: string;
    sort_order?: string;
    image?: string;
    platforms?: string;
    screenshots?: string;
    private_repo?: string;
    store_links?: string;
    'store_links.play_store'?: string;
    'store_links.app_store'?: string;
    'store_links.windows'?: string;
    'store_links.macos'?: string;
    'store_links.linux'?: string;
    'store_links.docs'?: string;
    'store_links.postman'?: string;
    'store_links.base_url'?: string;
}

interface Values {
    title: string;
    project_type: ProjectType;
    description: string;
    content: string;
    demo_url: string;
    github_url: string;
    private_repo: boolean;
    platforms: string[];
    tags: string[];
    featured: boolean;
    published: boolean;
    sort_order: number;
    store_links: StoreLinks;
}

const platformSuggestions: Record<ProjectType, string[]> = {
    web: ['Web'],
    mobile: ['Android', 'iOS'],
    desktop: ['Windows', 'macOS', 'Linux'],
    api: ['API'],
};

export default function ProjectForm({ project }: { project: Project | null }) {
    const isEdit = !!project;

    const [values, setValues] = useState<Values>({
        title: project?.title ?? '',
        project_type: project?.project_type ?? 'web',
        description: project?.description ?? '',
        content: project?.content ?? '',
        demo_url: project?.demo_url ?? '',
        github_url: project?.github_url ?? '',
        private_repo: project?.private_repo ?? false,
        platforms: project?.platforms ?? [],
        tags: project?.tags ?? [],
        featured: project?.featured ?? false,
        published: project?.published ?? false,
        sort_order: project?.sort_order ?? 0,
        store_links: {
            play_store: project?.store_links?.play_store ?? '',
            app_store: project?.store_links?.app_store ?? '',
            windows: project?.store_links?.windows ?? '',
            macos: project?.store_links?.macos ?? '',
            linux: project?.store_links?.linux ?? '',
            docs: project?.store_links?.docs ?? '',
            postman: project?.store_links?.postman ?? '',
            base_url: project?.store_links?.base_url ?? '',
        },
    });

    const [image, setImage] = useState<File | null>(null);
    const [screenshots, setScreenshots] = useState<File[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    function set<K extends keyof Values>(key: K, value: Values[K]) {
        setValues((v) => ({ ...v, [key]: value }));
    }

    function setStoreLink<K extends keyof StoreLinks>(key: K, value: StoreLinks[K]) {
        setValues((v) => ({
            ...v,
            store_links: {
                ...v.store_links,
                [key]: value,
            },
        }));
    }

    function togglePlatform(item: string) {
        const active = values.platforms.includes(item);
        set(
            'platforms',
            active
                ? values.platforms.filter((p) => p !== item)
                : [...values.platforms, item]
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();

        if (isEdit) formData.append('_method', 'PUT');

        formData.append('title', values.title);
        formData.append('project_type', values.project_type);
        formData.append('description', values.description);
        formData.append('content', values.content);
        formData.append('demo_url', values.demo_url);
        formData.append('github_url', values.github_url);
        formData.append('private_repo', values.private_repo ? '1' : '0');
        formData.append('featured', values.featured ? '1' : '0');
        formData.append('published', values.published ? '1' : '0');
        formData.append('sort_order', String(values.sort_order));

        values.tags.forEach((tag) => formData.append('tags[]', tag));
        values.platforms.forEach((platform) => formData.append('platforms[]', platform));

        formData.append('store_links[play_store]', values.store_links.play_store);
        formData.append('store_links[app_store]', values.store_links.app_store);
        formData.append('store_links[windows]', values.store_links.windows);
        formData.append('store_links[macos]', values.store_links.macos);
        formData.append('store_links[linux]', values.store_links.linux);
        formData.append('store_links[docs]', values.store_links.docs);
        formData.append('store_links[postman]', values.store_links.postman);
        formData.append('store_links[base_url]', values.store_links.base_url);

        screenshots.forEach((file) => formData.append('screenshots[]', file));
        if (image) formData.append('image', image);

        const url = isEdit ? `/admin/projects/${project!.id}` : '/admin/projects';

        router.post(url, formData as any, {
            forceFormData: true,
            onError: (e) => {
                setErrors(e as FormErrors);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <AdminLayout title={isEdit ? 'Modifier le projet' : 'Nouveau projet'}>
            <Head title={`${isEdit ? 'Modifier' : 'Créer'} un projet — Admin`} />

            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/admin/projects"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>

                <div>
                    <h2 className="font-display text-xl font-bold text-slate-800">
                        {isEdit ? 'Modifier le projet' : 'Nouveau projet'}
                    </h2>
                    {isEdit && <p className="mt-0.5 text-xs text-slate-400">ID #{project!.id}</p>}
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
                                    onChange={(e) => set('title', e.target.value)}
                                    placeholder="Nom du projet"
                                    className={cn(inputCls, errors.title && errorInputCls)}
                                />
                            </Field>

                            <Field label="Type de projet" required error={errors.project_type}>
                                <select
                                    value={values.project_type}
                                    onChange={(e) => set('project_type', e.target.value as ProjectType)}
                                    className={cn(inputCls, errors.project_type && errorInputCls)}
                                >
                                    <option value="web">Web</option>
                                    <option value="mobile">Mobile</option>
                                    <option value="desktop">Desktop</option>
                                    <option value="api">API</option>
                                </select>
                            </Field>

                            <Field label="Description courte" required error={errors.description}>
                                <textarea
                                    value={values.description}
                                    onChange={(e) => set('description', e.target.value)}
                                    placeholder="Résumé du projet en 1-2 phrases..."
                                    rows={3}
                                    className={cn(inputCls, 'resize-none', errors.description && errorInputCls)}
                                />
                            </Field>

                            <Field label="Contenu (Markdown)" error={errors.content}>
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
                            <h3 className="text-sm font-semibold text-slate-700">Liens principaux</h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="URL démo" error={errors.demo_url}>
                                    <input
                                        type="url"
                                        value={values.demo_url}
                                        onChange={(e) => set('demo_url', e.target.value)}
                                        placeholder="https://demo.exemple.com"
                                        className={cn(inputCls, errors.demo_url && errorInputCls)}
                                    />
                                </Field>

                                <Field label="URL GitHub" error={errors.github_url}>
                                    <input
                                        type="url"
                                        value={values.github_url}
                                        onChange={(e) => set('github_url', e.target.value)}
                                        placeholder="https://github.com/..."
                                        className={cn(inputCls, errors.github_url && errorInputCls)}
                                    />
                                </Field>
                            </div>

                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Plateformes</label>

                                <div className="mb-3 flex flex-wrap gap-2">
                                    {platformSuggestions[values.project_type].map((item) => {
                                        const active = values.platforms.includes(item);

                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => togglePlatform(item)}
                                                className={cn(
                                                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                                                    active
                                                        ? 'border-teal-600 bg-teal-600 text-white'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-600'
                                                )}
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>

                                <TagInput tags={values.platforms} onChange={(v) => set('platforms', v)} />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.06 }}
                            className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <h3 className="text-sm font-semibold text-slate-700">Liens spécifiques au type</h3>

                            {values.project_type === 'web' && (
                                <p className="text-sm text-slate-500">
                                    Pour un projet web, le lien principal peut rester dans “URL démo”.
                                </p>
                            )}

                            {values.project_type === 'mobile' && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Lien Play Store" error={errors['store_links.play_store']}>
                                        <input
                                            type="url"
                                            value={values.store_links.play_store}
                                            onChange={(e) => setStoreLink('play_store', e.target.value)}
                                            placeholder="https://play.google.com/..."
                                            className={cn(inputCls, errors['store_links.play_store'] && errorInputCls)}
                                        />
                                    </Field>

                                    <Field label="Lien App Store" error={errors['store_links.app_store']}>
                                        <input
                                            type="url"
                                            value={values.store_links.app_store}
                                            onChange={(e) => setStoreLink('app_store', e.target.value)}
                                            placeholder="https://apps.apple.com/..."
                                            className={cn(inputCls, errors['store_links.app_store'] && errorInputCls)}
                                        />
                                    </Field>
                                </div>
                            )}

                            {values.project_type === 'desktop' && (
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <Field label="Téléchargement Windows" error={errors['store_links.windows']}>
                                        <input
                                            type="url"
                                            value={values.store_links.windows}
                                            onChange={(e) => setStoreLink('windows', e.target.value)}
                                            placeholder="https://..."
                                            className={cn(inputCls, errors['store_links.windows'] && errorInputCls)}
                                        />
                                    </Field>

                                    <Field label="Téléchargement macOS" error={errors['store_links.macos']}>
                                        <input
                                            type="url"
                                            value={values.store_links.macos}
                                            onChange={(e) => setStoreLink('macos', e.target.value)}
                                            placeholder="https://..."
                                            className={cn(inputCls, errors['store_links.macos'] && errorInputCls)}
                                        />
                                    </Field>

                                    <Field label="Téléchargement Linux" error={errors['store_links.linux']}>
                                        <input
                                            type="url"
                                            value={values.store_links.linux}
                                            onChange={(e) => setStoreLink('linux', e.target.value)}
                                            placeholder="https://..."
                                            className={cn(inputCls, errors['store_links.linux'] && errorInputCls)}
                                        />
                                    </Field>
                                </div>
                            )}

                            {values.project_type === 'api' && (
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <Field label="Documentation" error={errors['store_links.docs']}>
                                        <input
                                            type="url"
                                            value={values.store_links.docs}
                                            onChange={(e) => setStoreLink('docs', e.target.value)}
                                            placeholder="https://docs..."
                                            className={cn(inputCls, errors['store_links.docs'] && errorInputCls)}
                                        />
                                    </Field>

                                    <Field label="Postman" error={errors['store_links.postman']}>
                                        <input
                                            type="url"
                                            value={values.store_links.postman}
                                            onChange={(e) => setStoreLink('postman', e.target.value)}
                                            placeholder="https://postman..."
                                            className={cn(inputCls, errors['store_links.postman'] && errorInputCls)}
                                        />
                                    </Field>

                                    <Field label="Base URL API" error={errors['store_links.base_url']}>
                                        <input
                                            type="url"
                                            value={values.store_links.base_url}
                                            onChange={(e) => setStoreLink('base_url', e.target.value)}
                                            placeholder="https://api.exemple.com"
                                            className={cn(inputCls, errors['store_links.base_url'] && errorInputCls)}
                                        />
                                    </Field>
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <h3 className="mb-3 text-sm font-semibold text-slate-700">Tags</h3>
                            <TagInput tags={values.tags} onChange={(v) => set('tags', v)} />
                        </motion.div>
                    </div>

                    <div className="space-y-5">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.06 }}
                            className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                        >
                            <h3 className="text-sm font-semibold text-slate-700">Publication</h3>

                            <label className="flex cursor-pointer items-center justify-between">
                                <span className="text-sm text-slate-700">Publié</span>
                                <button
                                    type="button"
                                    onClick={() => set('published', !values.published)}
                                    className={cn(
                                        'relative h-5 w-10 rounded-full transition-colors duration-200',
                                        values.published ? 'bg-teal-500' : 'bg-slate-300'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                                            values.published ? 'translate-x-5' : 'translate-x-0.5'
                                        )}
                                    />
                                </button>
                            </label>

                            <label className="flex cursor-pointer items-center justify-between">
                                <span className="text-sm text-slate-700">Mis en avant</span>
                                <button
                                    type="button"
                                    onClick={() => set('featured', !values.featured)}
                                    className={cn(
                                        'relative h-5 w-10 rounded-full transition-colors duration-200',
                                        values.featured ? 'bg-amber-500' : 'bg-slate-300'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                                            values.featured ? 'translate-x-5' : 'translate-x-0.5'
                                        )}
                                    />
                                </button>
                            </label>

                            <Field label="Ordre d'affichage" error={errors.sort_order}>
                                <input
                                    type="number"
                                    value={values.sort_order}
                                    onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)}
                                    className={cn(inputCls, 'w-24', errors.sort_order && errorInputCls)}
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
                                label="Image principale du projet"
                                value={image}
                                onChange={setImage}
                                currentUrl={project?.image ? `/storage/${project.image}` : null}
                            />

                            <div className="mt-4">
                                <MultiImageUpload
                                    values={screenshots}
                                    onChange={setScreenshots}
                                    currentUrls={
                                        project?.screenshots
                                            ? project.screenshots.map((s: string) => `/storage/${s}`)
                                            : []
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <label className="flex cursor-pointer items-center justify-between">
                                    <span className="text-sm text-slate-700">
                                        Repo privé (masquer le bouton GitHub)
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => set('private_repo', !values.private_repo)}
                                        className={cn(
                                            'relative h-5 w-10 rounded-full transition-colors duration-200',
                                            values.private_repo ? 'bg-slate-700' : 'bg-slate-300'
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                                                values.private_repo ? 'translate-x-5' : 'translate-x-0.5'
                                            )}
                                        />
                                    </button>
                                </label>
                            </div>

                            {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                            {errors.screenshots && <p className="mt-1 text-xs text-red-500">{errors.screenshots}</p>}
                        </motion.div>

                        <div className="flex flex-col gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={cn(
                                    'flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-500/20 transition-all duration-200',
                                    processing ? 'cursor-not-allowed opacity-70' : 'hover:bg-teal-700'
                                )}
                            >
                                {processing ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Enregistrement...
                                    </>
                                ) : isEdit ? (
                                    'Mettre à jour'
                                ) : (
                                    'Créer le projet'
                                )}
                            </button>

                            <Link
                                href="/admin/projects"
                                className="flex w-full items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
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