// resources/js/pages/Cookies.tsx
// Politique de cookies : liste des cookies réellement déposés + choix du thème.

import { Head } from '@inertiajs/react';
import { ThemeSelect } from '@/components/portofolio/theme-toggle';
import { HeroBackdrop } from '@/components/ui/hero-backdrop';
import { Reveal, SplitChars } from '@/components/ui/reveal';
import MainLayout from '@/layouts/MainLayout';
import { useTranslation } from '@/lib/i18n';

interface SiteCookie {
    name: string;
    purpose: string;
    duration: string;
    category: string;
}

export default function Cookies({ cookies }: { cookies: SiteCookie[] }) {
    const { l } = useTranslation();

    return (
        <MainLayout>
            <Head title="Cookies — Sergio Junior Chebeu" />

            <HeroBackdrop>
                <div className="container-main pt-[110px] pb-12 sm:pt-[130px] sm:pb-16">
                    <p className="mb-8 font-mono text-[12px] text-slate-500">
                        Cookies
                    </p>
                    <h1 className="max-w-3xl font-display text-[44px] leading-[1] font-bold tracking-[-0.045em] text-ink-primary sm:text-7xl">
                        <SplitChars
                            key={l('fr-1', 'en-1')}
                            text={l('Pas de pub,', 'No ads,')}
                            delay={0.1}
                        />
                        <SplitChars
                            key={l('fr-2', 'en-2')}
                            text={l('pas de suivi.', 'no tracking.')}
                            delay={0.3}
                            className="text-teal-600"
                        />
                    </h1>
                    <Reveal delay={0.5}>
                        <p className="mt-7 max-w-xl text-[19px] leading-[1.6] text-slate-600">
                            {l(
                                "Ce site dépose uniquement les cookies nécessaires à son fonctionnement, et deux cookies qui retiennent votre thème et votre langue. Aucun outil publicitaire ni de mesure d'audience : aucun consentement n'est donc demandé.",
                                'This site only sets the cookies it needs to work, plus two cookies that remember your theme and language. No advertising or analytics tools, so no consent is required.',
                            )}
                        </p>
                    </Reveal>
                </div>
            </HeroBackdrop>

            <section className="bg-white pb-20 sm:pb-28">
                <div className="container-main">
                    <Reveal>
                        <ul className="divide-y divide-slate-200 border-y border-slate-200">
                            {cookies.map((cookie) => (
                                <li
                                    key={cookie.name}
                                    className="grid gap-2 py-6 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
                                >
                                    <code className="font-mono text-[14px] break-all text-slate-900">
                                        {cookie.name}
                                    </code>
                                    <p className="text-[17px] leading-relaxed text-slate-600">
                                        {cookie.purpose}
                                    </p>
                                    <p className="flex gap-3 font-mono text-[12px] text-slate-500 sm:flex-col sm:gap-1 sm:text-right">
                                        <span className="text-teal-600">
                                            {cookie.category}
                                        </span>
                                        <span>{cookie.duration}</span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </Reveal>

                    <Reveal>
                        <div className="theme-lock mt-14 flex flex-col gap-5 rounded-2xl bg-[#171511] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                            <div>
                                <p className="font-display text-xl font-bold tracking-tight text-white">
                                    {l("Thème d'affichage", 'Display theme')}
                                </p>
                                <p className="mt-1 text-[15px] text-white/55">
                                    {l(
                                        '« Auto » suit le réglage clair ou sombre de votre appareil.',
                                        '“Auto” follows your device’s light or dark setting.',
                                    )}
                                </p>
                            </div>
                            <ThemeSelect />
                        </div>
                    </Reveal>

                    <p className="mt-10 max-w-xl text-[15px] leading-relaxed text-slate-500">
                        {l(
                            'Vous pouvez supprimer ces cookies à tout moment depuis les réglages de votre navigateur. Le site restera utilisable, mais vos formulaires en cours, votre thème et votre langue seront réinitialisés.',
                            'You can delete these cookies at any time from your browser settings. The site will keep working, but forms in progress, your theme and your language will be reset.',
                        )}
                    </p>
                </div>
            </section>
        </MainLayout>
    );
}
