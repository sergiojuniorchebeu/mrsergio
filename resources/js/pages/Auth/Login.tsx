// resources/js/Pages/Auth/Login.tsx
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
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

            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
                {/* Fond décoratif */}
                <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-teal-500/5 blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-md"
                >
                    {/* Card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
                        {/* Header */}
                        <div className="border-b border-slate-100 px-8 pt-8 pb-6 text-center">
                            <Link
                                href="/"
                                className="mb-6 inline-flex items-center gap-2"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 shadow-sm shadow-teal-500/30">
                                    <span className="font-display font-bold text-white">
                                        S
                                    </span>
                                </div>
                                <span className="font-display font-semibold text-slate-800">
                                    mrsergio
                                </span>
                            </Link>
                            <h1 className="font-display text-xl font-bold text-slate-800">
                                Connexion admin
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Accès réservé aux administrateurs
                            </p>
                        </div>

                        {/* Formulaire */}
                        <div className="px-8 py-6">
                            {status && (
                                <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-700">
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
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="admin@mrsergio.dev"
                                        autoComplete="email"
                                        autoFocus
                                        className={cn(
                                            'w-full rounded-md border bg-slate-50 px-4 py-3 text-sm transition-all duration-200 outline-none',
                                            'text-slate-800 placeholder:text-slate-400',
                                            'focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/15',
                                            errors.email
                                                ? 'border-red-300'
                                                : 'border-slate-200',
                                        )}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Mot de passe */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className={cn(
                                            'w-full rounded-md border bg-slate-50 px-4 py-3 text-sm transition-all duration-200 outline-none',
                                            'text-slate-800 placeholder:text-slate-400',
                                            'focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/15',
                                            errors.password
                                                ? 'border-red-300'
                                                : 'border-slate-200',
                                        )}
                                    />
                                    {errors.password && (
                                        <p className="text-xs text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Se souvenir */}
                                <label className="flex cursor-pointer items-center gap-2.5">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                'remember',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    <span className="text-sm text-slate-600">
                                        Se souvenir de moi
                                    </span>
                                </label>

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={processing}
                                    whileHover={
                                        !processing ? { scale: 1.01 } : {}
                                    }
                                    whileTap={
                                        !processing ? { scale: 0.98 } : {}
                                    }
                                    className={cn(
                                        'flex w-full items-center justify-center gap-2 rounded-md px-4 py-3',
                                        'bg-teal-600 text-sm font-semibold text-white',
                                        'shadow-sm shadow-teal-500/20 transition-all duration-200',
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
                                            </svg>
                                            Connexion...
                                        </>
                                    ) : (
                                        <>
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
                                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            Se connecter
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="px-8 pb-6 text-center">
                            <Link
                                href="/"
                                className="text-xs text-slate-400 transition-colors hover:text-teal-600"
                            >
                                ← Retour au site public
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
