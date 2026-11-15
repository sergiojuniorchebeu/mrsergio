import { Head, Link } from '@inertiajs/react';
import NumberFlow from '@number-flow/react';
import {
    motion,
    useInView,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';
import { useRef, useSyncExternalStore } from 'react';
import { ArticleList } from '@/components/portofolio/article-list';
import { AvailabilityBadge } from '@/components/portofolio/availability-badge';
import { FormationDeck } from '@/components/portofolio/formation-deck';
import { StackedProjects } from '@/components/portofolio/stacked-projects';
import { TechWheel } from '@/components/portofolio/tech-wheel';
import { buttonVariants } from '@/components/ui/button';
import { HeroBackdrop } from '@/components/ui/hero-backdrop';
import {
    DrawLine,
    MaskedLine,
    Reveal,
    SplitChars,
} from '@/components/ui/reveal';
import { ScrollTextReveal } from '@/components/ui/scroll-text-reveal';
import { SectionBackdrop } from '@/components/ui/section-backdrop';
import { useIsMobile } from '@/hooks/use-mobile';
import MainLayout from '@/layouts/MainLayout';
import { easings } from '@/lib/utils';

const CONTACT_EMAIL = 'contact@mrsergio.dev';

const techStack = [
    'Flutter',
    'Laravel',
    'React',
    'Java',
    'Python',
    'Firebase',
    'Déploiement',
];

const socials = [
    { label: 'GitHub', href: 'https://github.com/sergiojuniorchebeu' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/sergiojuniorchebeu' },
];

function ArrowUpRight({ className = 'h-3 w-3' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
                d="M5 11L11 5M6 5h5v5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ─── Heure locale (Cameroun) ─────────────────────────────────────────────────
function formatLocalTime(): string {
    return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Douala',
    }).format(new Date());
}

function subscribeToMinuteTick(onTick: () => void): () => void {
    const interval = setInterval(onTick, 30_000);

    return () => clearInterval(interval);
}

function useLocalTime(): string | null {
    return useSyncExternalStore(
        subscribeToMinuteTick,
        formatLocalTime,
        () => null,
    );
}

// ─── Stat ────────────────────────────────────────────────────────────────────
function Stat({
    value,
    suffix = '',
    label,
}: {
    value: number;
    suffix?: string;
    label: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <div
            ref={ref}
            className="flex flex-col gap-1 border-t border-slate-200 pt-5"
        >
            <span className="font-display text-5xl font-bold tracking-tight text-[#1a1916] tabular-nums sm:text-6xl">
                <NumberFlow
                    value={inView ? value : 0}
                    transformTiming={{
                        duration: 1400,
                        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                />
                {suffix && <span className="text-teal-600">{suffix}</span>}
            </span>
            <span className="text-[15px] text-slate-500">{label}</span>
        </div>
    );
}

// ─── Section header ──────────────────────────────────────────────────────────
function SectionHeader({
    index,
    title,
    intro,
    href,
    linkLabel,
}: {
    index: string;
    title: string;
    intro: string;
    href: string;
    linkLabel: string;
}) {
    return (
        <div className="mb-10 sm:mb-14">
            <div className="mb-6 flex items-center gap-4 font-mono text-[11px] text-slate-400">
                <Reveal y={8}>{index}</Reveal>
                <DrawLine className="flex-1" />
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-xl">
                    <h2 className="font-display text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">
                        <MaskedLine onScroll>{title}</MaskedLine>
                    </h2>
                    <Reveal delay={0.12}>
                        <p className="mt-4 text-[17px] leading-relaxed text-slate-600">
                            {intro}
                        </p>
                    </Reveal>
                </div>
                <Reveal delay={0.2} className="shrink-0">
                    <Link
                        href={href}
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        {linkLabel}
                    </Link>
                </Reveal>
            </div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <p className="rounded-2xl border border-dashed border-slate-200 px-6 py-14 text-center text-[15px] text-slate-400">
            {message}
        </p>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function Home({
    projects = [],
    posts = [],
    formations = [],
    projectsCount = 0,
}: {
    projects?: any[];
    posts?: any[];
    formations?: any[];
    projectsCount?: number;
}) {
    const prefersReducedMotion = useReducedMotion();
    const localTime = useLocalTime();
    const isMobile = useIsMobile();
    const parallaxScale = prefersReducedMotion ? 0 : isMobile ? 0.4 : 1;

    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const photoY = useTransform(heroProgress, [0, 1], [0, 140 * parallaxScale]);
    const photoRotate = useTransform(
        heroProgress,
        [0, 1],
        [0, isMobile ? 0 : 4 * parallaxScale],
    );
    const heroTextY = useTransform(
        heroProgress,
        [0, 1],
        [0, -60 * parallaxScale],
    );
    const heroTextOpacity = useTransform(
        heroProgress,
        [0, 0.75],
        prefersReducedMotion ? [1, 1] : [1, 0],
    );

    const fadeIn = (delay: number) => ({
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease: easings.smooth },
    });

    return (
        <MainLayout>
            <Head title="Accueil — Sergio Junior Chebeu" />

            {/* ══ HERO ═══════════════════════════════════════════════ */}
            <section ref={heroRef}>
                <HeroBackdrop>
                    <div className="container-main flex items-center pt-[110px] pb-6 sm:pt-[130px] lg:min-h-[86svh] lg:pb-8">
                        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
                            <motion.div
                                style={{
                                    y: heroTextY,
                                    opacity: heroTextOpacity,
                                }}
                                className="order-2 flex flex-col lg:order-1"
                            >
                                <motion.div {...fadeIn(0.05)} className="mb-8">
                                    <AvailabilityBadge localTime={localTime} />
                                </motion.div>

                                <h1 className="font-display text-[48px] leading-[0.98] font-bold tracking-[-0.045em] text-[#1a1916] sm:text-7xl lg:text-[88px]">
                                    <SplitChars
                                        text="Sergio Junior"
                                        delay={0.15}
                                    />
                                    <SplitChars
                                        text="Chebeu"
                                        delay={0.55}
                                        className="text-teal-600"
                                    />
                                </h1>

                                <motion.p
                                    {...fadeIn(0.85)}
                                    className="mt-8 max-w-[34rem] text-[20px] leading-[1.6] text-slate-700"
                                >
                                    Développeur full stack. Je conçois des
                                    applications web et Android pour des
                                    entreprises et des porteurs de projet, de
                                    l&apos;idée jusqu&apos;à la mise en ligne.
                                </motion.p>

                                <motion.div
                                    {...fadeIn(0.95)}
                                    className="mt-10 flex flex-wrap items-center gap-3"
                                >
                                    <Link
                                        href="/projects"
                                        className={buttonVariants({
                                            size: 'lg',
                                        })}
                                    >
                                        Voir mes projets
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className={buttonVariants({
                                            variant: 'outline',
                                            size: 'lg',
                                        })}
                                    >
                                        Me contacter
                                    </Link>
                                </motion.div>

                                <motion.ul
                                    {...fadeIn(1.05)}
                                    className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-500"
                                >
                                    {socials.map((s) => (
                                        <li key={s.label}>
                                            <a
                                                href={s.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 transition-colors hover:text-slate-900"
                                            >
                                                {s.label}
                                                <ArrowUpRight />
                                            </a>
                                        </li>
                                    ))}
                                    <li>
                                        <a
                                            href={`mailto:${CONTACT_EMAIL}`}
                                            className="font-mono transition-colors hover:text-slate-900"
                                        >
                                            {CONTACT_EMAIL}
                                        </a>
                                    </li>
                                </motion.ul>
                            </motion.div>

                            <motion.div
                                className="order-1 lg:order-2"
                                initial={
                                    prefersReducedMotion
                                        ? { opacity: 0 }
                                        : {
                                              clipPath:
                                                  'inset(100% 0% 0% 0% round 24px)',
                                          }
                                }
                                animate={
                                    prefersReducedMotion
                                        ? { opacity: 1 }
                                        : {
                                              clipPath:
                                                  'inset(0% 0% 0% 0% round 24px)',
                                          }
                                }
                                transition={{
                                    duration: 1.3,
                                    delay: 0.2,
                                    ease: easings.expo,
                                }}
                            >
                                <motion.div
                                    style={{ y: photoY, rotate: photoRotate }}
                                    className="relative mx-auto aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-3xl bg-slate-100 shadow-[0_30px_60px_-30px_rgba(26,25,22,0.45)] sm:max-w-[320px] lg:mx-0 lg:ml-auto lg:max-w-none"
                                >
                                    <motion.img
                                        src="/images/profile_avatar-960.webp"
                                        srcSet="/images/profile_avatar-600.webp 600w, /images/profile_avatar-960.webp 960w"
                                        sizes="(min-width: 1024px) 420px, 320px"
                                        width={960}
                                        height={960}
                                        fetchPriority="high"
                                        alt="Sergio Junior Chebeu"
                                        className="h-full w-full object-cover object-top"
                                        initial={{
                                            scale: prefersReducedMotion
                                                ? 1
                                                : 1.25,
                                        }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            duration: 1.8,
                                            delay: 0.2,
                                            ease: easings.expo,
                                        }}
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </HeroBackdrop>
            </section>

            {/* ══ TECHNOS (roue épinglée) ═════════════════════════ */}
            <TechWheel items={techStack} />

            {/* ══ MANIFESTE + CHIFFRES ═══════════════════════════════ */}
            <section className="relative isolate overflow-clip bg-white py-24 sm:py-36">
                <SectionBackdrop pattern="grid" />
                <div className="container-main">
                    <Reveal y={8}>
                        <p className="mb-8 font-mono text-[11px] text-slate-400">
                            Ma façon de travailler
                        </p>
                    </Reveal>
                    <ScrollTextReveal
                        text="Je construis des applications claires, fiables et agréables à utiliser. Je pars de votre besoin réel, je livre par étapes, et je reste là après la mise en ligne."
                        highlight={['claires', 'fiables', 'agréables']}
                        className="max-w-5xl font-display text-[30px] leading-[1.25] font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl lg:text-[56px]"
                    />

                    <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
                        {[
                            {
                                value: 3,
                                suffix: '+',
                                label: "ans d'expérience",
                            },
                            {
                                value: projectsCount,
                                label: 'projets publiés ici',
                            },
                            {
                                value: techStack.length,
                                label: 'technologies au quotidien',
                            },
                        ].map((stat, i) => (
                            <Reveal key={stat.label} delay={i * 0.1}>
                                <Stat {...stat} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ PROJETS ════════════════════════════════════════════ */}
            <section className="relative isolate overflow-clip bg-white pt-20 pb-10 sm:pt-28">
                <SectionBackdrop pattern="grid" />
                <div className="container-main">
                    <SectionHeader
                        index="01 — Projets"
                        title="Travaux récents"
                        intro="Une sélection d'applications livrées, du site vitrine à l'outil métier."
                        href="/projects"
                        linkLabel="Tous les projets"
                    />

                    {projects.length === 0 ? (
                        <EmptyState message="Aucun projet publié pour l'instant." />
                    ) : (
                        <StackedProjects projects={projects} />
                    )}
                </div>
            </section>

            {/* ══ BLOG ═══════════════════════════════════════════════ */}
            <section className="relative isolate overflow-clip bg-white py-20 sm:py-28">
                <SectionBackdrop pattern="lines" withMargin />
                <div className="container-main">
                    <SectionHeader
                        index="02 — Blog"
                        title="Ce que j'écris"
                        intro="Notes de terrain sur le développement, les outils et les projets en cours."
                        href="/blog"
                        linkLabel="Tous les articles"
                    />

                    {posts.length === 0 ? (
                        <EmptyState message="Aucun article publié pour l'instant." />
                    ) : (
                        <ArticleList articles={posts} />
                    )}
                </div>
            </section>

            {/* ══ FORMATIONS ═════════════════════════════════════════ */}
            <section className="relative isolate overflow-clip bg-white pt-8 pb-24 sm:pb-32">
                <SectionBackdrop pattern="grid" />
                <div className="container-main">
                    <SectionHeader
                        index="03 — Formations"
                        title="Apprendre avec moi"
                        intro="Des formations pratiques, construites à partir de vrais projets."
                        href="/formations"
                        linkLabel="Toutes les formations"
                    />

                    {formations.length === 0 ? (
                        <EmptyState message="Aucune formation publiée pour l'instant." />
                    ) : (
                        <FormationDeck formations={formations} />
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
