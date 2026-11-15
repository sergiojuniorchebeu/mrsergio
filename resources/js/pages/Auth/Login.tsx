// resources/js/pages/Auth/Login.tsx
// Connexion à l'admin : panneau de marque à gauche (desktop), formulaire à droite.
// Afficher/masquer le mot de passe, alerte majuscules, secousse en cas d'erreur.

import { Head, Link, useForm } from '@inertiajs/react';
import {
    AnimatePresence,
    motion,
    useAnimate,
    useReducedMotion,
} from 'framer-motion';
import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { SplitWords } from '@/components/ui/reveal';
import { cn, easings } from '@/lib/utils';

const FIELD_CLASS =
    'w-full rounded-lg border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-[border-color,box-shadow] duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10';

const DOTS = 'radial-gradient(circle, currentColor 1px, transparent 1.4px)';

function FieldError({ message }: { message?: string }) {
    return (
        <AnimatePresence initial={false}>
            {message && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[13px] text-rose-600"
                >
                    {message}
                </motion.p>
            )}
        </AnimatePresence>
    );
}

// ─── Panneau de marque ───────────────────────────────────────────────────────
function BrandPanel() {
    return (
        <aside className="relative isolate hidden overflow-hidden bg-[#171511] lg:flex lg:flex-col lg:justify-between lg:p-12">
            <div
                aria-hidden
                className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,black_30%,transparent_80%)] text-white/[0.09]"
                style={{ backgroundImage: DOTS, backgroundSize: '22px 22px' }}
            />

            <Link
                href="/"
                className="font-display text-[15px] font-bold tracking-tight text-white"
            >
                mr<span className="text-teal-400">sergio</span>
            </Link>

            <div>
                <p
                    aria-hidden
                    className="font-display leading-[0.82] font-extrabold tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.22)]"
                    style={{ fontSize: 'clamp(72px, 9vw, 150px)' }}
                >
                    <motion.span
                        className="block"
                        initial={{ y: '40%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1.1, ease: easings.expo }}
                    >
                        MR
                    </motion.span>
                    <motion.span
                        className="block"
                        initial={{ y: '40%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 1.1,
                            delay: 0.1,
                            ease: easings.expo,
                        }}
                    >
                        SERGIO
                    </motion.span>
                </p>
                <p className="mt-8 max-w-sm text-[17px] leading-relaxed text-white/55">
                    Espace d&apos;administration : projets, articles, formations
                    et messages, au même endroit.
                </p>
            </div>

            <p className="font-mono text-[12px] text-white/30">
                © {new Date().getFullYear()} Sergio Junior Chebeu
            </p>
        </aside>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function Login({ status }: { status?: string }) {
    const prefersReducedMotion = useReducedMotion();
    const [formScope, animateForm] = useAnimate<HTMLFormElement>();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        post('/login', {
            onError: () => {
                reset('password');

                if (!prefersReducedMotion && formScope.current) {
                    animateForm(
                        formScope.current,
                        { x: [0, -10, 10, -6, 6, 0] },
                        { duration: 0.45 },
                    );
                }
            },
        });
    }

    const fadeIn = (delay: number) => ({
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, delay, ease: easings.smooth },
    });

    return (
        <>
            <Head title="Connexion — Admin" />

            <div className="grid min-h-[100svh] bg-white lg:grid-cols-[1.05fr_1fr]">
                <BrandPanel />

                <main className="flex flex-col px-5 py-8 sm:px-10">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="font-display text-[15px] font-bold tracking-tight text-slate-900 lg:invisible"
                        >
                            mr<span className="text-teal-600">sergio</span>
                        </Link>
                        <Link
                            href="/"
                            className={buttonVariants({
                                variant: 'ghost',
                                size: 'sm',
                            })}
                        >
                            Retour au site
                        </Link>
                    </div>

                    <div className="flex flex-1 items-center justify-center py-12">
                        <div className="w-full max-w-sm">
                            <motion.p
                                {...fadeIn(0)}
                                className="mb-4 font-mono text-[12px] text-slate-500"
                            >
                                Admin
                            </motion.p>
                            <h1 className="font-display text-[40px] leading-[1.02] font-bold tracking-[-0.04em] text-slate-900">
                                <SplitWords text="Bon retour" delay={0.05} />
                                <SplitWords
                                    text="parmi nous."
                                    delay={0.15}
                                    className="text-teal-600"
                                />
                            </h1>
                            <motion.p
                                {...fadeIn(0.35)}
                                className="mt-4 text-[16px] text-slate-500"
                            >
                                Accès réservé aux administrateurs.
                            </motion.p>

                            <AnimatePresence>
                                {status && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 rounded-lg bg-teal-50 px-4 py-3 text-[14px] text-teal-800 ring-1 ring-teal-100"
                                    >
                                        {status}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <motion.form
                                ref={formScope}
                                {...fadeIn(0.45)}
                                onSubmit={handleSubmit}
                                noValidate
                                className="mt-8 flex flex-col gap-5"
                            >
                                <label className="flex flex-col gap-1.5">
                                    <span className="font-display text-[13px] font-semibold text-slate-700">
                                        Adresse email
                                    </span>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(event) =>
                                            setData('email', event.target.value)
                                        }
                                        placeholder="admin@mrsergio.dev"
                                        autoComplete="email"
                                        autoFocus
                                        aria-invalid={Boolean(errors.email)}
                                        className={cn(
                                            FIELD_CLASS,
                                            errors.email
                                                ? 'border-rose-300'
                                                : 'border-slate-200',
                                        )}
                                    />
                                    <FieldError message={errors.email} />
                                </label>

                                <label className="flex flex-col gap-1.5">
                                    <span className="font-display text-[13px] font-semibold text-slate-700">
                                        Mot de passe
                                    </span>
                                    <span className="relative">
                                        <input
                                            type={
                                                isPasswordVisible
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={data.password}
                                            onChange={(event) =>
                                                setData(
                                                    'password',
                                                    event.target.value,
                                                )
                                            }
                                            onKeyUp={(event) =>
                                                setIsCapsLockOn(
                                                    event.getModifierState(
                                                        'CapsLock',
                                                    ),
                                                )
                                            }
                                            onBlur={() =>
                                                setIsCapsLockOn(false)
                                            }
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            aria-invalid={Boolean(
                                                errors.password,
                                            )}
                                            className={cn(
                                                FIELD_CLASS,
                                                'pr-24',
                                                errors.password
                                                    ? 'border-rose-300'
                                                    : 'border-slate-200',
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsPasswordVisible(
                                                    (visible) => !visible,
                                                )
                                            }
                                            aria-pressed={isPasswordVisible}
                                            className="absolute inset-y-1.5 right-1.5 rounded-md px-3 text-[12px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                        >
                                            {isPasswordVisible
                                                ? 'Masquer'
                                                : 'Afficher'}
                                        </button>
                                    </span>
                                    <AnimatePresence initial={false}>
                                        {isCapsLockOn && (
                                            <motion.span
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: 'auto',
                                                }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-[13px] text-amber-700"
                                            >
                                                Majuscules activées
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    <FieldError message={errors.password} />
                                </label>

                                <label className="flex w-fit cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(event) =>
                                            setData(
                                                'remember',
                                                event.target.checked,
                                            )
                                        }
                                        className="peer sr-only"
                                    />
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'relative h-6 w-11 rounded-full transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-500/40',
                                            data.remember
                                                ? 'bg-teal-600'
                                                : 'bg-slate-300',
                                        )}
                                    >
                                        <motion.span
                                            layout
                                            transition={{
                                                type: 'spring',
                                                stiffness: 500,
                                                damping: 32,
                                            }}
                                            className={cn(
                                                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm',
                                                data.remember
                                                    ? 'right-0.5'
                                                    : 'left-0.5',
                                            )}
                                        />
                                    </span>
                                    <span className="text-[14px] text-slate-600">
                                        Rester connecté
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={buttonVariants({
                                        size: 'lg',
                                        className: 'mt-2 w-full',
                                    })}
                                >
                                    {processing ? 'Connexion…' : 'Se connecter'}
                                </button>
                            </motion.form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
