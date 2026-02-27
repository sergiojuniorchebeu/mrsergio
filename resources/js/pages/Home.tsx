// resources/js/Pages/Home.tsx
import MainLayout              from '@/layouts/MainLayout';
import { Head, Link }          from '@inertiajs/react';
import { motion }              from 'framer-motion';
import type { Variants }       from 'framer-motion';
import { easings, cn }         from '@/lib/utils';

import { ShinyButton }         from '@/components/ui/shiny-button';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { TypingAnimation }     from '@/components/ui/typing-animation';

import { AvatarGlow }          from '@/components/ui/AvatarGlow';
import { RevealText }          from '@/components/ui/AnimatedText';

const containerVariants: Variants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
    hidden:  { opacity: 0, y: 28 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.7, ease: easings.smooth },
    },
};

const socials = [
    {
        label: 'GitHub',
        href:  'https://github.com/sergiojuniorchebeu',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href:  'https://linkedin.com/in/sergiojuniorchebeu',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: 'Email',
        href:  'mailto:contact@mrsergio.dev',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

export default function Home() {
    return (
        <MainLayout>
            <Head title="Accueil — Sergio Junior Chebeu" />

            <section className="relative min-h-screen flex items-center overflow-hidden">

                <AnimatedGridPattern
                    numSquares={40}
                    maxOpacity={0.04}
                    duration={4}
                    repeatDelay={0.8}
                    className={cn(
                        'absolute inset-0 w-full h-full text-teal-600',
                        '[mask-image:radial-gradient(900px_circle_at_65%_45%,white,transparent)]',
                    )}
                />

                <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-400/4 rounded-full blur-2xl pointer-events-none" />

                <div className="container-main relative z-10 py-12 sm:py-16 lg:py-24 w-full">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-center"
                    >

                        {/* ── Colonne gauche : Texte — order-1 sur TOUS les écrans ── */}
                        <div className="order-1 lg:order-1 space-y-6 sm:space-y-8">

                            <motion.div variants={itemVariants}>
                                <p className="text-ink-muted text-xs font-sans font-medium tracking-[0.2em] uppercase">
                                    Développeur Full Stack
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <h1 className="leading-[1.08] tracking-tight">
                                    <RevealText
                                        text="Sergio Junior"
                                        className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-ink-primary"
                                        delay={0.15}
                                    />
                                    <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mt-1">
                                        <TypingAnimation
                                            duration={80}
                                            delay={600}
                                            className="gradient-text font-display font-bold"
                                        >
                                            Chebeu
                                        </TypingAnimation>
                                    </span>
                                </h1>
                            </motion.div>

                            <motion.p
                                variants={itemVariants}
                                className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-md"
                            >
                                Je construis des produits web qui combinent{' '}
                                <span className="text-teal-600 font-medium">performance technique</span>{' '}
                                et expérience utilisateur soignée.
                                Laravel, React, Flutter — du backend à l'app mobile.
                            </motion.p>

                            <motion.div variants={itemVariants} className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Link href="/projects" className="flex-shrink-0">
                                        <ShinyButton className="bg-teal-600 text-white px-5 sm:px-7 py-2.5 sm:py-3 text-sm font-semibold rounded-xl">
                                            <span className="flex items-center gap-2">
                                                Voir mes projets
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </ShinyButton>
                                    </Link>

                                    <Link
                                        href="/contact"
                                        className="flex-shrink-0 group inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-sm font-semibold text-ink-secondary bg-surface-card hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-all duration-200"
                                    >
                                        Me contacter
                                        <svg
                                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </Link>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    {socials.map((social) => (
                                        <motion.a
                                            key={social.label}
                                            href={social.href}
                                            target={social.href.startsWith('mailto') ? undefined : '_blank'}
                                            rel="noreferrer"
                                            aria-label={social.label}
                                            whileHover={{ scale: 1.08, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: easings.bounce }}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-card border border-slate-200 text-ink-muted hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-colors duration-200 shadow-sm"
                                        >
                                            {social.icon}
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* ── Colonne droite : Photo — order-2 sur TOUS les écrans ── */}
                        <motion.div
                            variants={itemVariants}
                            className="order-2 lg:order-2 flex justify-center lg:justify-end"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <AvatarGlow
                                    src="/images/profile_avatar.jpg"
                                    alt="Sergio Junior Chebeu"
                                />
                            </motion.div>
                        </motion.div>

                    </motion.div>
                </div>
            </section>

        </MainLayout>
    );
}