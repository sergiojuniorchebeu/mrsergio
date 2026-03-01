// resources/js/Pages/Admin/Blog/Form.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion }             from 'framer-motion';
import { useState }           from 'react';
import { Field, inputCls, errorInputCls, ImageUpload, TagInput, MarkdownEditor } from '@/components/admin/shared';
import AdminLayout            from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface Post {
    id:           number;
    title:        string;
    excerpt:      string;
    content:      string | null;
    tags:         string[];
    featured:     boolean;
    published:    boolean;
    published_at: string | null;
    cover_image:  string | null;
}

interface FormErrors {
    title?: string; excerpt?: string; content?: string;
    tags?: string; featured?: string; published?: string;
    published_at?: string; cover_image?: string;
}

export default function BlogForm({ post }: { post: Post | null }) {
    const isEdit = !!post;

    const [values, setValues] = useState({
        title:        post?.title        ?? '',
        excerpt:      post?.excerpt      ?? '',
        content:      post?.content      ?? '',
        tags:         post?.tags         ?? [] as string[],
        featured:     post?.featured     ?? false,
        published:    post?.published    ?? false,
        published_at: post?.published_at ? post.published_at.slice(0, 10) : '',
    });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [errors, setErrors]         = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    function set<K extends keyof typeof values>(key: K, value: typeof values[K]) {
        setValues(v => ({ ...v, [key]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        // Method spoofing pour PUT avec multipart/form-data
        if (isEdit) formData.append('_method', 'PUT');

        formData.append('title',     values.title);
        formData.append('excerpt',   values.excerpt);
        formData.append('content',   values.content);
        formData.append('featured',  values.featured  ? '1' : '0');
        formData.append('published', values.published ? '1' : '0');
        if (values.published_at) formData.append('published_at', values.published_at);

        values.tags.forEach(tag => formData.append('tags[]', tag));

        if (coverImage) formData.append('cover_image', coverImage);

        const url = isEdit ? `/admin/blog/${post.id}` : '/admin/blog';

        router.post(url, formData as any, {
            onError:  (e) => { setErrors(e); setProcessing(false); },
            onFinish: ()  => setProcessing(false),
        });
    }

    return (
        <AdminLayout title={isEdit ? "Modifier l'article" : 'Nouvel article'}>
            <Head title={`${isEdit ? 'Modifier' : 'Créer'} un article — Admin`} />

            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/blog" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </Link>
                <div>
                    <h2 className="text-xl font-display font-bold text-slate-800">{isEdit ? "Modifier l'article" : 'Nouvel article'}</h2>
                    {isEdit && <p className="text-xs text-slate-400 mt-0.5">ID #{post.id}</p>}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-5">
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-5">
                            <Field label="Titre" required error={errors.title}>
                                <input type="text" value={values.title} onChange={e => set('title', e.target.value)}
                                    placeholder="Titre de l'article"
                                    className={cn(inputCls, errors.title && errorInputCls)} />
                            </Field>
                            <Field label="Extrait" required error={errors.excerpt}>
                                <textarea value={values.excerpt} onChange={e => set('excerpt', e.target.value)}
                                    placeholder="Résumé affiché dans la liste..." rows={3}
                                    className={cn(inputCls, 'resize-none', errors.excerpt && errorInputCls)} />
                            </Field>
                            <Field label="Contenu (Markdown)" error={errors.content}>
                                <MarkdownEditor value={values.content} onChange={v => set('content', v)} error={errors.content} />
                            </Field>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-3">Tags</h3>
                            <TagInput tags={values.tags} onChange={v => set('tags', v)} />
                        </motion.div>
                    </div>

                    {/* Colonne latérale */}
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

                            <Field label="Date de publication" error={errors.published_at}>
                                <input type="date" value={values.published_at}
                                    onChange={e => set('published_at', e.target.value)}
                                    className={cn(inputCls, errors.published_at && errorInputCls)} />
                            </Field>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                            <ImageUpload label="Image de couverture" value={coverImage} onChange={setCoverImage}
                                currentUrl={post?.cover_image ? `/storage/${post.cover_image}` : null} />
                            {errors.cover_image && <p className="text-xs text-red-500 mt-1">{errors.cover_image}</p>}
                        </motion.div>

                        <div className="flex flex-col gap-2">
                            <button type="submit" disabled={processing}
                                className={cn('w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 text-white text-sm font-semibold shadow-sm shadow-teal-500/20 transition-all duration-200', processing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-700')}>
                                {processing
                                    ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Enregistrement...</>
                                    : isEdit ? 'Mettre à jour' : "Publier l'article"
                                }
                            </button>
                            <Link href="/admin/blog" className="w-full flex items-center justify-center py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                Annuler
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}