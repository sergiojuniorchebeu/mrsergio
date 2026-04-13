"use client";

import { Head, Link } from "@inertiajs/react";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import NumberFlow from "@number-flow/react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { HexagonPattern } from "@/components/ui/hexagon-pattern";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { AvatarGlow } from "@/components/ui/AvatarGlow";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { FormationCard } from "@/components/ui/FormationCard";

import MainLayout from "@/layouts/MainLayout";
import { easings, cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useIsMobile(bp = 768) {
    const [m, setM] = useState(false);
    const t = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        const u = () => setM(window.innerWidth < bp);
        u();

        const r = () => {
            clearTimeout(t.current);
            t.current = setTimeout(u, 150);
        };

        window.addEventListener("resize", r);
        return () => {
            clearTimeout(t.current);
            window.removeEventListener("resize", r);
        };
    }, [bp]);

    return m;
}

// ─── BlurFade ────────────────────────────────────────────────────────────────
function BlurFade({
    children,
    className,
    delay = 0,
    y = 24,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    y?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y, filter: "blur(6px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ─── AnimatedStat ─────────────────────────────────────────────────────────────
function AnimatedStat({
    value,
    suffix = "",
    label,
}: {
    value: number;
    suffix?: string;
    label: string;
}) {
    const ref  = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <div ref={ref} className="flex flex-col items-center gap-1.5">
            <span className="font-display text-4xl font-bold tracking-tight text-[#1a1916] sm:text-5xl tabular-nums">
                <NumberFlow
                    value={inView ? value : 0}
                    transformTiming={{ duration: 900, easing: "ease-out" }}
                />
                <span className="text-teal-500">{suffix}</span>
            </span>
            <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-slate-400">
                {label}
            </span>
        </div>
    );
}

// ─── Variants ────────────────────────────────────────────────────────────────
const stagger: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: easings.smooth },
    },
};

// ─── Tech stack ──────────────────────────────────────────────────────────────
const techStack: { name: string; color: string; icon: React.ReactNode }[] = [
    {
        name: "Laravel",
        color: "text-[#FF2D20]",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.007-.04-.013-.059-.024L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.038.01-.073.014-.11a.337.337 0 01.033-.067c.01-.016.018-.034.03-.05.015-.014.032-.025.048-.038L5.044.05a.375.375 0 01.376 0L9.93 2.788c.018.01.03.026.044.038.016.013.033.024.048.039a.377.377 0 01.063.116c.006.016.006.033.01.051.003.036.012.072.012.109v9.653l3.76-2.164V5.528c0-.037.007-.072.012-.109a.377.377 0 01.042-.117c.01-.016.018-.033.03-.05.015-.014.032-.025.048-.038l4.51-2.738a.375.375 0 01.376 0l4.51 2.738c.017.011.03.026.044.038.016.013.032.024.048.039a.377.377 0 01.063.116c.005.016.006.033.009.051z" />
            </svg>
        ),
    },
    {
        name: "React",
        color: "text-[#61DAFB]",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278z" />
            </svg>
        ),
    },
    {
        name: "Flutter",
        color: "text-[#54C5F8]",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zm.159 11.871l-5.684 5.684 5.684 5.685 7.527-5.685z" />
            </svg>
        ),
    },
    {
        name: "Python",
        color: "text-[#3776AB]",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.912S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.03v-2.868s-.109-3.403 3.345-3.403h5.77s3.234.052 3.234-3.127V3.107S18.28 0 11.914 0zM8.708 1.798a1.068 1.068 0 110 2.137 1.068 1.068 0 010-2.137z" />
                <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752H12v-.826h8.109S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.03v2.868s.109 3.403-3.345 3.403h-5.77S6.218 12.287 6.218 15.466v5.427S5.72 24 12.086 24zm3.206-1.798a1.068 1.068 0 110-2.137 1.068 1.068 0 010 2.137z" />
            </svg>
        ),
    },
    {
        name: "Java",
        color: "text-[#007396]",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0 0-8.216 2.051-4.292 6.573" />
            </svg>
        ),
    },
    {
        name: "TailwindCSS",
        color: "text-[#06B6D4]",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
            </svg>
        ),
    },
    {
        name: "Firebase",
        color: "text-[#FFCA28]",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z" />
            </svg>
        ),
    },
    {
        name: "Inertia.js",
        color: "text-[#9553E9]",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.527 12L0 8.701V15.3L6.527 12zm10.946 0L24 8.701V15.3L17.473 12zm-5.473 3.112L5.473 12 12 8.888 18.527 12l-6.527 3.112z" />
            </svg>
        ),
    },
];

const socials = [
    {
        label: "GitHub",
        href: "https://github.com/sergiojuniorchebeu",
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/sergiojuniorchebeu",
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: "Email",
        href: "mailto:contact@mrsergio.dev",
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

const ArrowIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);


// ─── Blog Card ───────────────────────────────────────────────────────────────
function BlogCard({ p, i, isMobile }: { p: any; i: number; isMobile: boolean }) {
    const tags: string[] = p.tags ?? (p.tag ? [p.tag] : []);
    const firstTag = tags[0];

    return (
        <BlurFade delay={isMobile ? 0 : i * 0.1} className="h-full">
            <SpotlightCard className="h-full">
                {/* Nav link */}
                <Link href={`/blog/${p.slug}`} aria-label={p.title} className="absolute inset-0 z-10 rounded-[19px]" />

                {/* Image */}
                <div className="relative overflow-hidden bg-slate-50 flex-shrink-0" style={{ aspectRatio: '16/9' }}>
                    {(p.cover_image_url ?? p.image) ? (
                        <img
                            src={p.cover_image_url ?? p.image}
                            alt={p.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-slate-50">
                            <svg className="w-10 h-10 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    )}

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Tag + reading time overlays */}
                    {firstTag && (
                        <div className="absolute top-3 left-3 z-10 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                            {firstTag}
                        </div>
                    )}
                    {p.reading_time && (
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {p.reading_time}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-2.5">
                    {/* Category label */}
                    {tags.length > 0 && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">
                            {tags.slice(0, 2).join(' · ')}
                        </p>
                    )}

                    {/* Title */}
                    <h3 className="font-display font-semibold text-[16px] leading-snug text-slate-900 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300">
                        {p.title}
                    </h3>

                    {/* Excerpt */}
                    {(p.excerpt ?? p.desc) && (
                        <p className="text-[13px] leading-relaxed text-slate-500 line-clamp-2 flex-1">
                            {p.excerpt ?? p.desc}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[12px] font-medium text-slate-400">
                            {p.published_at ?? p.date ?? "—"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 transition-[gap] duration-200 group-hover:gap-2.5">
                            Lire l'article
                            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>
                </div>
            </SpotlightCard>
        </BlurFade>
    );
}


// ─── Section Title ───────────────────────────────────────────────────────────
function SectionTitle({ label, title, href }: { label: string; title: string; href: string }) {
    return (
        <BlurFade>
            <div className="mb-12 flex items-end justify-between">
                <div>
                    <div className="mb-3 flex items-center gap-3">
                        <div className="h-px w-8 bg-teal-500" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-600">{label}</span>
                    </div>
                    <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        {title}
                    </h2>
                </div>

                <Link
                    href={href}
                    className="group hidden items-center gap-2 text-[13px] font-semibold text-slate-500 transition-colors hover:text-teal-600 sm:inline-flex"
                >
                    Tout voir
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </BlurFade>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <p className="text-sm font-medium text-slate-400">{message}</p>
        </div>
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
    const isMobile = useIsMobile();

    return (
        <MainLayout>
            <Head title="Accueil — Sergio Junior Chebeu" />

            {/* ══ HERO ═══════════════════════════════════════════════ */}
            <section className="relative flex min-h-screen items-center overflow-hidden bg-white">

                {/* GridPattern — teal subtil, fondu bas */}
                <AnimatedGridPattern
                    numSquares={isMobile ? 10 : 28}
                    maxOpacity={0.08}
                    duration={4}
                    repeatDelay={1}
                    width={32}
                    height={32}
                    className={cn(
                        "absolute inset-0 h-full w-full",
                        "fill-transparent stroke-teal-500/[0.12] text-teal-500",
                        "[mask-image:linear-gradient(to_bottom,white_0%,white_55%,transparent_95%)]",
                    )}
                />

                {/* Watermark — "MR SERGIO" très subtil */}
                <div
                    aria-hidden
                    className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
                >
                    <span
                        className="font-display font-extrabold uppercase leading-none tracking-[-0.04em] text-slate-900/[0.030] whitespace-nowrap"
                        style={{ fontSize: "clamp(72px, 14vw, 180px)" }}
                    >
                        Mr Sergio
                    </span>
                </div>

                {/* pt-[88px] = nav pill (58px) + padding top (12px) + marge */}
                <div className="container-main relative z-10 w-full pt-[88px] pb-16 sm:pb-20 lg:pb-24">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 xl:gap-20"
                    >
                        {/* ── Texte ───────────────────────────────── */}
                        <div className="order-2 lg:order-1 flex flex-col gap-7">

                            {/* Label */}
                            <motion.div variants={fadeUp}>
                                <span className="inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-teal-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700 shadow-[0_1px_3px_rgba(26,163,137,0.08)]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                                    Fullstack Developer
                                </span>
                            </motion.div>

                            {/* Nom — Poppins 700 */}
                            <motion.div variants={fadeUp} className="-mt-1">
                                <h1 className="font-display font-bold leading-[1.1] tracking-[-0.02em] text-[#1a1916]">
                                    <span className="block text-4xl sm:text-5xl lg:text-[52px] xl:text-[58px]">
                                        Sergio Junior
                                    </span>
                                    <span className="block text-4xl sm:text-5xl lg:text-[52px] xl:text-[58px] text-teal-600">
                                        Chebeu.
                                    </span>
                                </h1>
                            </motion.div>

                            {/* Description */}
                            <motion.p variants={fadeUp} className="max-w-[420px] text-[17px] leading-[1.75] text-slate-700">
                                Je construis des produits web qui allient{" "}
                                <span className="font-semibold text-slate-800">performance technique</span>{" "}
                                et expérience utilisateur soignée. Laravel, React, Flutterdu backend à l'app mobile.
                            </motion.p>

                            {/* Status */}
                            <motion.div variants={fadeUp} className="-mt-1">
                                <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                                    <span className="relative flex h-2 w-2 shrink-0">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
                                    </span>
                                    <span className="text-[14px] font-medium text-slate-700">
                                        Disponible pour de nouveaux projets
                                    </span>
                                </div>
                            </motion.div>

                            {/* CTAs */}
                            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                                <Link
                                    href="/projects"
                                    className="inline-flex items-center rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-teal-700"
                                >
                                    Voir mes projets
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50"
                                >
                                    Me contacter
                                </Link>
                            </motion.div>

                            {/* Socials */}
                            <motion.div variants={fadeUp} className="-mt-1 flex items-center gap-2">
                                {socials.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target={s.href.startsWith("mailto") ? undefined : "_blank"}
                                        rel="noreferrer"
                                        aria-label={s.label}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all duration-200 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </motion.div>
                        </div>

                        {/* ── Photo ────────────────────────────────── */}
                        <motion.div
                            variants={fadeUp}
                            className="order-1 lg:order-2 flex justify-center lg:justify-end"
                        >
                            <AvatarGlow src="/images/profile_avatar.jpg" alt="Sergio Junior Chebeu" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ══ STATS + STACK ════════════════════════════════════════ */}
            <section className="relative overflow-hidden border-y border-slate-100 bg-white py-16 sm:py-20">
                {/* Subtle top glow */}
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-200/60 to-transparent" />

                <div className="container-main">
                    {/* ── Stats ─────────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">
                        {[
                            { value: 3, suffix: "+", label: "Années d'exp." },
                            {
                                value: projectsCount > 10 ? 10 : projectsCount,
                                suffix: "+",
                                label: "Projets livrés",
                            },
                            { value: 10, suffix: "+", label: "Clients satisfaits" },
                            { value: techStack.length, suffix: "", label: "Technologies" },
                        ].map((stat, i) => (
                            <BlurFade key={i} delay={i * 0.08}>
                                <div className="px-4 py-6 sm:py-0">
                                    <AnimatedStat
                                        value={stat.value}
                                        suffix={stat.suffix}
                                        label={stat.label}
                                    />
                                </div>
                            </BlurFade>
                        ))}
                    </div>

                    {/* ── Separator ─────────────────────────────────────────── */}
                    <div className="my-12 flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-100" />
                        <div className="flex items-center gap-2">
                            <div className="h-px w-6 bg-teal-400/60" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                                Stack technique
                            </span>
                            <div className="h-px w-6 bg-teal-400/60" />
                        </div>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    {/* ── Tech pills ────────────────────────────────────────── */}
                    <BlurFade delay={0.1}>
                        <div className="flex flex-wrap justify-center gap-2">
                            {techStack.map((tech) => (
                                <div
                                    key={tech.name}
                                    className="group inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50/70 px-3.5 py-1.5 text-[12px] font-medium text-slate-500 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                                >
                                    <span className={cn("transition-colors duration-200 group-hover:opacity-100 opacity-70", tech.color)}>
                                        {tech.icon}
                                    </span>
                                    {tech.name}
                                </div>
                            ))}
                        </div>
                    </BlurFade>
                </div>

                {/* Subtle bottom glow */}
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-200/60 to-transparent" />
            </section>

            {/* ══ PROJETS ════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-white py-20 sm:py-28">

                <HexagonPattern
                    radius={26}
                    gap={3}
                    className={cn(
                        "absolute inset-0 h-full w-full fill-transparent stroke-teal-500/[0.10]",
                        "[mask-image:linear-gradient(to_bottom,transparent_0%,white_8%,white_92%,transparent_100%)]",
                    )}
                />

                <div aria-hidden className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
                    <span
                        className="font-display font-extrabold uppercase leading-none tracking-[-0.04em] whitespace-nowrap text-slate-900/[0.04]"
                        style={{ fontSize: "clamp(64px, 13vw, 168px)" }}
                    >
                        Projets
                    </span>
                </div>

                <div className="container-main relative z-10">
                    <SectionTitle label="Portfolio" title="Projets récents" href="/projects" />

                    {projects.length === 0 ? (
                        <EmptyState message="Aucun projet publié pour l'instant." />
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project, i) => (
                                <ProjectCard
                                    key={project.id ?? project.slug ?? i}
                                    project={project}
                                    index={i}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-center sm:hidden">
                        <Link href="/projects" className="flex items-center gap-1.5 text-sm font-semibold text-teal-600">
                            Voir tous les projets <ArrowIcon />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ BLOG ═══════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-white py-20 sm:py-28">

                <HexagonPattern
                    radius={26}
                    gap={3}
                    className={cn(
                        "absolute inset-0 h-full w-full fill-transparent stroke-teal-500/[0.10]",
                        "[mask-image:linear-gradient(to_bottom,transparent_0%,white_8%,white_92%,transparent_100%)]",
                    )}
                />

                <div aria-hidden className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
                    <span
                        className="font-display font-extrabold uppercase leading-none tracking-[-0.04em] whitespace-nowrap text-slate-900/[0.04]"
                        style={{ fontSize: "clamp(64px, 13vw, 168px)" }}
                    >
                        Articles
                    </span>
                </div>

                <div className="container-main relative z-10">
                    <SectionTitle label="Blog" title="Articles récents" href="/blog" />

                    {posts.length === 0 ? (
                        <EmptyState message="Aucun article publié pour l'instant." />
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.map((p, i) => (
                                <BlogCard key={p.slug ?? i} p={p} i={i} isMobile={isMobile} />
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-center sm:hidden">
                        <Link href="/blog" className="flex items-center gap-1.5 text-sm font-semibold text-teal-600">
                            Voir tous les articles <ArrowIcon />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ FORMATIONS ═════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-white py-20 sm:py-28">

                <HexagonPattern
                    radius={26}
                    gap={3}
                    className={cn(
                        "absolute inset-0 h-full w-full fill-transparent stroke-teal-500/[0.10]",
                        "[mask-image:linear-gradient(to_bottom,transparent_0%,white_8%,white_92%,transparent_100%)]",
                    )}
                />

                <div aria-hidden className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
                    <span
                        className="font-display font-extrabold uppercase leading-none tracking-[-0.04em] whitespace-nowrap text-slate-900/[0.04]"
                        style={{ fontSize: "clamp(64px, 13vw, 168px)" }}
                    >
                        Formations
                    </span>
                </div>

                <div className="container-main relative z-10">
                    <SectionTitle label="Formations" title="Apprendre avec moi" href="/formations" />

                    {formations.length === 0 ? (
                        <EmptyState message="Aucune formation publiée pour l'instant." />
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {formations.map((f, i) => (
                                <FormationCard key={f.slug ?? i} formation={f} index={i} />
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-center sm:hidden">
                        <Link href="/formations" className="flex items-center gap-1.5 text-sm font-semibold text-teal-600">
                            Toutes les formations <ArrowIcon />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ CTA ════════════════════════════════════════════════ */}
            <section className="bg-[#1a1916] py-20 sm:py-28">
                <div className="container-main">
                    <BlurFade>
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/25">
                                Collaborons ensemble
                            </p>

                            <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-white/85 sm:text-4xl lg:text-5xl">
                                Un projet en tête ?
                            </h2>

                            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/30">
                                Discutons de votre idée et construisons quelque chose de solide ensemble.
                            </p>

                            <div className="mt-10 flex flex-wrap justify-center gap-3">
                                <Link
                                    href="/contact"
                                    className="group inline-flex items-center gap-2 rounded-xl bg-teal-500 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-teal-400"
                                >
                                    Démarrer un projet
                                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>

                                <a
                                    href="mailto:contact@mrsergio.dev"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-7 py-3.5 font-mono text-sm text-white/35 transition-colors duration-200 hover:border-white/20 hover:text-white/55"
                                >
                                    contact@mrsergio.dev
                                </a>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </section>
        </MainLayout>
    );
}
