// resources/js/Pages/Auth/Login.tsx
import { Head, useForm, Link } from '@inertiajs/react';
import { motion }              from 'framer-motion';
import { cn }                  from '@/lib/utils';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email:    '',
        password: '',
        remember: false,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/login');
    }

    return (
        <>
            <Head title="Connexion — Admin" />

            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

                {/* Fond décoratif */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-md"
                >
                    {/* Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">

                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 border-b border-slate-100 text-center">
                            <Link href="/" className="inline-flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm shadow-teal-500/30">
                                    <span className="text-white font-bold font-display">S</span>
                                </div>
                                <span className="font-semibold text-slate-800 font-display">mrsergio</span>
                            </Link>
                            <h1 className="text-xl font-display font-bold text-slate-800">
                                Connexion admin
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Accès réservé aux administrateurs
                            </p>
                        </div>

                        {/* Formulaire */}
                        <div className="px-8 py-6">
                            {status && (
                                <div className="mb-4 p-3 rounded-lg bg-teal-50 border border-teal-200 text-sm text-teal-700">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Adresse email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="admin@mrsergio.dev"
                                        autoComplete="email"
                                        autoFocus
                                        className={cn(
                                            'w-full px-4 py-3 rounded-xl text-sm bg-slate-50 border outline-none transition-all duration-200',
                                            'placeholder:text-slate-400 text-slate-800',
                                            'focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/15',
                                            errors.email ? 'border-red-300' : 'border-slate-200',
                                        )}
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>

                                {/* Mot de passe */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className={cn(
                                            'w-full px-4 py-3 rounded-xl text-sm bg-slate-50 border outline-none transition-all duration-200',
                                            'placeholder:text-slate-400 text-slate-800',
                                            'focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/15',
                                            errors.password ? 'border-red-300' : 'border-slate-200',
                                        )}
                                    />
                                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                                </div>

                                {/* Se souvenir */}
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    <span className="text-sm text-slate-600">Se souvenir de moi</span>
                                </label>

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={processing}
                                    whileHover={!processing ? { scale: 1.01 } : {}}
                                    whileTap={!processing ? { scale: 0.98 } : {}}
                                    className={cn(
                                        'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl',
                                        'bg-teal-600 text-white text-sm font-semibold',
                                        'shadow-sm shadow-teal-500/20 transition-all duration-200',
                                        processing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-700',
                                    )}
                                >
                                    {processing ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Connexion...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Se connecter
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="px-8 pb-6 text-center">
                            <Link href="/" className="text-xs text-slate-400 hover:text-teal-600 transition-colors">
                                ← Retour au site public
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}