// resources/js/Pages/Admin/Projects/Form.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion }             from 'framer-motion';
import { useState }           from 'react';
import { Field, inputCls, errorInputCls, ImageUpload, TagInput, MarkdownEditor } from '@/components/admin/shared';
import AdminLayout            from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface Project {
    id:          number;
    title:       string;
    description: string;
    content:     string | null;
    demo_url:    string | null;
    github_url:  string | null;
    tags:        string[];
    featured:    boolean;
    published:   boolean;
    sort_order:  number;
    image:       string | null;
}

interface FormErrors {
    title?: string; description?: string; content?: string;
    demo_url?: string; github_url?: string; tags?: string;
    featured?: string; published?: string; sort_order?: string; image?: string;
}

export default function ProjectForm({ project }: { project: Project | null }) {
    const isEdit = !!project;

    const [values, setValues] = useState({
        title:       project?.title       ?? '',
        description: project?.description ?? '',
        content:     project?.content     ?? '',
        demo_url:    project?.demo_url    ?? '',
        github_url:  project?.github_url  ?? '',
        tags:        project?.tags        ?? [] as string[],
        featured:    project?.featured    ?? false,
        published:   project?.published   ?? false,
        sort_order:  project?.sort_order  ?? 0,
    });
    const [image, setImage]       = useState<File | null>(null);
    const [errors, setErrors]     = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    function set<K extends keyof typeof values>(key: K, value: typeof values[K]) {
        setValues(v => ({ ...v, [key]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        if (isEdit) formData.append('_method', 'PUT');

        formData.append('title',       values.title);
        formData.append('description', values.description);
        formData.append('content',     values.content);
        formData.append('demo_url',    values.demo_url);
        formData.append('github_url',  values.github_url);
        formData.append('featured',    values.featured  ? '1' : '0');
        formData.append('published',   values.published ? '1' : '0');
        formData.append('sort_order',  String(values.sort_order));
        values.tags.forEach(tag => formData.append('tags[]', tag));
        if (image) formData.append('image', image);

        const url = isEdit ? `/admin/projects/${project.id}` : '/admin/projects';

        router.post(url, formData as any, {
            onError:  (e) => { setErrors(e); setProcessing(false); },
            onFinish: ()  => setProcessing(false),
        });
    }

    return (
        <AdminLayout title={isEdit ? 'Modifier le projet' : 'Nouveau projet'}>
            <Head title={`${isEdit ? 'Modifier' : 'Créer'} un projet — Admin`} />

            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/projects" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </Link>
                <div>
                    <h2 className="text-xl font-display font-bold text-slate-800">{isEdit ? 'Modifier le projet' : 'Nouveau projet'}</h2>
                    {isEdit && <p className="text-xs text-slate-400 mt-0.5">ID #{project.id}</p>}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-5">
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-5">
                            <Field label="Titre" required error={errors.title}>
                                <input type="text" value={values.title} onChange={e => set('title', e.target.value)}
                                    placeholder="Nom du projet"
                                    className={cn(inputCls, errors.title && errorInputCls)} />
                            </Field>
                            <Field label="Description courte" required error={errors.description}>
                                <textarea value={values.description} onChange={e => set('description', e.target.value)}
                                    placeholder="Résumé du projet en 1-2 phrases..." rows={3}
                                    className={cn(inputCls, 'resize-none', errors.description && errorInputCls)} />
                            </Field>
                            <Field label="Contenu (Markdown)" error={errors.content}>
                                <MarkdownEditor value={values.content} onChange={v => set('content', v)} error={errors.content} />
                            </Field>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-slate-700">Liens</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field label="URL démo" error={errors.demo_url}>
                                    <input type="url" value={values.demo_url} onChange={e => set('demo_url', e.target.value)}
                                        placeholder="https://demo.exemple.com"
                                        className={cn(inputCls, errors.demo_url && errorInputCls)} />
                                </Field>
                                <Field label="URL GitHub" error={errors.github_url}>
                                    <input type="url" value={values.github_url} onChange={e => set('github_url', e.target.value)}
                                        placeholder="https://github.com/..."
                                        className={cn(inputCls, errors.github_url && errorInputCls)} />
                                </Field>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-3">Tags</h3>
                            <TagInput tags={values.tags} onChange={v => set('tags', v)} />
                        </motion.div>
                    </div>

                    <div className="space-y-5">
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.06 }}
                            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-slate-700">Publication</h3>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-slate-700">Publié</span>
                                <button type="button" onClick={() => set('published', !values.published)}
                                    className={cn('relative w-10 h-5 rounded-full transition-colors duration-200', values.published ? 'bg-teal-500' : 'bg-slate-300')}>
                                    <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200', values.published ? 'translate-x-5' : 'translate-x-0.5')} />
                                </button>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-slate-700">Mis en avant</span>
                                <button type="button" onClick={() => set('featured', !values.featured)}
                                    className={cn('relative w-10 h-5 rounded-full transition-colors duration-200', values.featured ? 'bg-amber-500' : 'bg-slate-300')}>
                                    <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200', values.featured ? 'translate-x-5' : 'translate-x-0.5')} />
                                </button>
                            </label>
                            <Field label="Ordre d'affichage" error={errors.sort_order}>
                                <input type="number" value={values.sort_order}
                                    onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
                                    className={cn(inputCls, 'w-24')} min={0} />
                            </Field>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                            <ImageUpload label="Image du projet" value={image} onChange={setImage}
                                currentUrl={project?.image ? `/storage/${project.image}` : null} />
                            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
                        </motion.div>

                        <div className="flex flex-col gap-2">
                            <button type="submit" disabled={processing}
                                className={cn('w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 text-white text-sm font-semibold shadow-sm shadow-teal-500/20 transition-all duration-200', processing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-700')}>
                                {processing
                                    ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Enregistrement...</>
                                    : isEdit ? 'Mettre à jour' : 'Créer le projet'
                                }
                            </button>
                            <Link href="/admin/projects" className="w-full flex items-center justify-center py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Annuler</Link>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}