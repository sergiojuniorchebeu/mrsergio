"use client";

import { Head, Link } from "@inertiajs/react";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { RevealText } from "@/components/ui/AnimatedText";
import { AvatarGlow } from "@/components/ui/AvatarGlow";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ShinyButton } from "@/components/ui/shiny-button";
import { TypingAnimation } from "@/components/ui/typing-animation";

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

// ─── DotPattern ──────────────────────────────────────────────────────────────
function DotPattern({ className }: { className?: string }) {
    return (
        <svg className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden>
            <defs>
                <pattern id="dot-bg" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="currentColor" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-bg)" />
        </svg>
    );
}

// ─── NumberTicker ────────────────────────────────────────────────────────────
function NumberTicker({
    value,
    suffix = "",
    className,
}: {
    value: number;
    suffix?: string;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;

        let s = 0;
        const step = (ts: number) => {
            if (!s) s = ts;
            const p = Math.min((ts - s) / 1200, 1);
            setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value));
            if (p < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }, [inView, value]);

    return (
        <span ref={ref} className={className}>
            {display}
            {suffix}
        </span>
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
const techStack = [
    {
        name: "Laravel",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.007-.04-.013-.059-.024L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.038.01-.073.014-.11a.337.337 0 01.033-.067c.01-.016.018-.034.03-.05.015-.014.032-.025.048-.038L5.044.05a.375.375 0 01.376 0L9.93 2.788c.018.01.03.026.044.038.016.013.033.024.048.039a.377.377 0 01.063.116c.006.016.006.033.01.051.003.036.012.072.012.109v9.653l3.76-2.164V5.528c0-.037.007-.072.012-.109a.377.377 0 01.042-.117c.01-.016.018-.033.03-.05.015-.014.032-.025.048-.038l4.51-2.738a.375.375 0 01.376 0l4.51 2.738c.017.011.03.026.044.038.016.013.032.024.048.039a.377.377 0 01.063.116c.005.016.006.033.009.051z" />
            </svg>
        ),
    },
    {
        name: "React",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278z" />
            </svg>
        ),
    },
    {
        name: "Flutter",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zm.159 11.871l-5.684 5.684 5.684 5.685 7.527-5.685z" />
            </svg>
        ),
    },
    {
        name: "Python",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.912S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.03v-2.868s-.109-3.403 3.345-3.403h5.77s3.234.052 3.234-3.127V3.107S18.28 0 11.914 0zM8.708 1.798a1.068 1.068 0 110 2.137 1.068 1.068 0 010-2.137z" />
                <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752H12v-.826h8.109S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.03v2.868s.109 3.403-3.345 3.403h-5.77S6.218 12.287 6.218 15.466v5.427S5.72 24 12.086 24zm3.206-1.798a1.068 1.068 0 110-2.137 1.068 1.068 0 010 2.137z" />
            </svg>
        ),
    },
    {
        name: "Java",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0 0-8.216 2.051-4.292 6.573" />
            </svg>
        ),
    },
    {
        name: "TailwindCSS",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
            </svg>
        ),
    },
    {
        name: "MySQL",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153z" />
            </svg>
        ),
    },
    {
        name: "Firebase",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z" />
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

// ─── Tech Marquee ────────────────────────────────────────────────────────────
function TechMarquee({ isMobile }: { isMobile: boolean }) {
    const doubled = useMemo(() => [...techStack, ...techStack], []);
    return (
        <div className="overflow-hidden border-y border-slate-200/60 bg-white/50 py-6 backdrop-blur-sm">
            <div
                className="marquee-track flex w-max items-center gap-8 sm:gap-10"
                style={{ animationDuration: isMobile ? "18s" : "28s" }}
            >
                {doubled.map((tech, i) => (
                    <div key={i} className="flex shrink-0 items-center gap-2.5">
                        <span className="text-slate-400">{tech.icon}</span>
                        <span className="whitespace-nowrap text-sm font-medium text-slate-500">{tech.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Stats data ──────────────────────────────────────────────────────────────
const stats = [
    { value: 3, suffix: "+", label: "Années d'expérience" },
    { value: 20, suffix: "+", label: "Projets livrés" },
    { value: 10, suffix: "+", label: "Clients satisfaits" },
    { value: 8, suffix: "", label: "Technologies maîtrisées" },
];

// ─── Blog Card ───────────────────────────────────────────────────────────────
function BlogCard({ p, i, isMobile }: { p: any; i: number; isMobile: boolean }) {
    const [hovered, setHovered] = useState(false);
    const tags: string[] = p.tags ?? (p.tag ? [p.tag] : []);

    return (
        <BlurFade delay={isMobile ? 0 : i * 0.1}>
            <Link href={`/blog/${p.slug}`} className="group block">
                <div
                    className="flex flex-col gap-5 rounded-[20px] border border-slate-100 bg-white p-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-slate-200 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.06)] sm:flex-row sm:gap-6 sm:p-5"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-36 sm:w-48 md:w-56">
                        <motion.img
                            src={p.cover_image_url ?? p.image}
                            alt={p.title}
                            className="h-full w-full object-cover"
                            animate={{ scale: hovered ? 1.04 : 1 }}
                            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                        <div className="mb-2 flex items-center gap-3">
                            {tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="text-[10px] font-bold uppercase tracking-[0.12em] text-teal-600">
                                    {tag}
                                </span>
                            ))}
                            {p.reading_time && <span className="text-[11px] font-medium text-slate-400">{p.reading_time}</span>}
                        </div>

                        <h3 className="mb-2 line-clamp-2 text-[16px] font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-teal-600">
                            {p.title}
                        </h3>

                        {(p.excerpt ?? p.desc) && (
                            <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                                {p.excerpt ?? p.desc}
                            </p>
                        )}

                        <div className="mt-auto flex items-center justify-between">
                            <span className="text-[12px] font-medium text-slate-400">
                                {p.published_at ?? p.date ?? "—"}
                            </span>

                            <motion.span
                                className="flex items-center gap-1.5 text-[12px] font-semibold text-teal-600"
                                animate={{ x: hovered ? 4 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                Lire
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </motion.span>
                        </div>
                    </div>
                </div>
            </Link>
        </BlurFade>
    );
}

// ─── Formation Card ──────────────────────────────────────────────────────────
function FormationCard({ f, i, isMobile }: { f: any; i: number; isMobile: boolean }) {
    const [hovered, setHovered] = useState(false);
    const isFree = f.is_free ?? f.free ?? false;
    const price = f.price_formatted ?? f.price ?? (isFree ? "Gratuit" : null);
    const category = f.category ?? f.cat ?? "Formation";

    return (
        <BlurFade delay={isMobile ? 0 : i * 0.08} className="h-full">
            <Link href={`/formations/${f.slug}`} className="group block h-full">
                <div
                    className="relative h-full overflow-hidden rounded-[20px] border border-slate-100 bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-slate-200 hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.08)]"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <div className="relative h-44 overflow-hidden">
                        <motion.img
                            src={f.cover_image_url ?? f.image}
                            alt={f.title}
                            className="h-full w-full object-cover"
                            animate={{ scale: hovered ? 1.04 : 1 }}
                            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-50" />

                        {price && (
                            <div
                                className={cn(
                                    "absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm",
                                    isFree
                                        ? "border border-teal-200/60 bg-teal-50 text-teal-700"
                                        : "border border-slate-200/60 bg-white/90 text-slate-700"
                                )}
                            >
                                {price}
                            </div>
                        )}

                        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-white/90 px-2.5 py-1 backdrop-blur-sm">
                            <span className="text-[11px] font-semibold text-slate-600">{category}</span>
                        </div>
                    </div>

                    <div className="space-y-3 p-5">
                        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-teal-600">
                            {f.title}
                        </h3>

                        {(f.excerpt ?? f.description ?? f.desc) && (
                            <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                                {f.excerpt ?? f.description ?? f.desc}
                            </p>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3 text-[12px] text-slate-400">
                                {(f.duration_hours || f.duration_formatted) && (
                                    <span>{f.duration_formatted ?? `${f.duration_hours}h`}</span>
                                )}
                                {f.lessons_count && <span>{f.lessons_count} leçons</span>}
                            </div>

                            <motion.span
                                className="flex items-center gap-1.5 text-[12px] font-semibold text-teal-600"
                                animate={{ x: hovered ? 4 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                Voir
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </motion.span>
                        </div>
                    </div>
                </div>
            </Link>
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
}: {
    projects?: any[];
    posts?: any[];
    formations?: any[];
}) {
    const isMobile = useIsMobile();

    return (
        <MainLayout>
            <Head title="Accueil — Sergio Junior Chebeu" />

            {/* ══ HERO ═══════════════════════════════════════════════ */}
            <section className="relative flex min-h-[92vh] items-center overflow-hidden">
                {!isMobile && (
                    <AnimatedGridPattern
                        numSquares={28}
                        maxOpacity={0.03}
                        duration={5}
                        repeatDelay={1.2}
                        className={cn(
                            "absolute inset-0 h-full w-full text-teal-600",
                            "[mask-image:radial-gradient(800px_circle_at_65%_45%,white,transparent)]"
                        )}
                    />
                )}

                <div className="pointer-events-none absolute top-1/4 right-1/3 h-[420px] w-[420px] rounded-full bg-teal-500/5 blur-3xl sm:h-[520px] sm:w-[520px]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-teal-400/4 blur-2xl sm:h-80 sm:w-80" />

                <div className="container-main relative z-10 w-full py-12 sm:py-16 lg:py-24">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24"
                    >
                        <div className="order-1 space-y-6 sm:space-y-8">
                            <motion.div variants={fadeUp}>
                                <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white px-4 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
                                    </span>
                                    <span className="text-[12px] font-medium text-slate-500">
                                        Disponible pour de nouveaux projets
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ink-muted">
                                    Développeur Full Stack
                                </p>

                                <h1 className="leading-[1.06] tracking-tight">
                                    <RevealText
                                        text="Sergio Junior"
                                        className="block text-4xl text-ink-primary sm:text-5xl lg:text-6xl xl:text-7xl"
                                        delay={0.1}
                                    />
                                    <span className="mt-1 block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
                                        {isMobile ? (
                                            <span className="gradient-text-hero font-display font-bold">Chebeu</span>
                                        ) : (
                                            <TypingAnimation
                                                duration={80}
                                                delay={500}
                                                className="gradient-text-hero font-display font-bold"
                                            >
                                                Chebeu
                                            </TypingAnimation>
                                        )}
                                    </span>
                                </h1>
                            </motion.div>

                            <motion.p variants={fadeUp} className="max-w-md text-base leading-relaxed text-ink-secondary sm:text-lg">
                                Je construis des produits web qui combinent{" "}
                                <span className="font-medium text-teal-600">performance technique</span>{" "}
                                et expérience utilisateur soignée. Laravel, React, Flutter — du backend à l'app mobile.
                            </motion.p>

                            <motion.div variants={fadeUp} className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Link href="/projects" className="shrink-0">
                                        <ShinyButton variant="primary" size="lg" icon={<ArrowIcon />}>
                                            Voir mes projets
                                        </ShinyButton>
                                    </Link>

                                    <Link href="/contact" className="shrink-0">
                                        <ShinyButton
                                            variant="ghost"
                                            size="lg"
                                            noShimmer
                                            icon={
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            }
                                        >
                                            Me contacter
                                        </ShinyButton>
                                    </Link>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    {socials.map((s) => (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            target={s.href.startsWith("mailto") ? undefined : "_blank"}
                                            rel="noreferrer"
                                            aria-label={s.label}
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-surface-card text-ink-muted shadow-sm transition-colors duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600"
                                        >
                                            {s.icon}
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <motion.div variants={fadeUp} className="order-2 flex justify-center lg:justify-end">
                            {isMobile ? (
                                <AvatarGlow src="/images/profile_avatar.jpg" alt="Sergio Junior Chebeu" />
                            ) : (
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <AvatarGlow src="/images/profile_avatar.jpg" alt="Sergio Junior Chebeu" />
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                {!isMobile && (
                    <motion.div
                        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                    >
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-muted">
                            Scroll
                        </span>
                        <motion.div
                            className="h-6 w-px bg-gradient-to-b from-slate-400 to-transparent"
                            animate={{ scaleY: [1, 0.35, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            style={{ transformOrigin: "top" }}
                        />
                    </motion.div>
                )}
            </section>

            {/* ══ TECH MARQUEE ════════════════════════════════════════ */}
            <TechMarquee isMobile={isMobile} />

            {/* ══ STATS ══════════════════════════════════════════════ */}
            <section className="bg-surface py-16 sm:py-20">
                <div className="container-main">
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-4">
                        {stats.map((stat, i) => (
                            <BlurFade key={i} delay={i * 0.1}>
                                <div className="text-center">
                                    <p className="gradient-text font-display text-4xl font-bold tracking-tight sm:text-5xl">
                                        <NumberTicker value={stat.value} suffix={stat.suffix} />
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-ink-muted">{stat.label}</p>
                                </div>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ PROJETS ════════════════════════════════════════════ */}
            <section className="relative overflow-hidden py-20 sm:py-28">
                <div className="absolute inset-0 bg-gradient-to-b from-surface via-white to-surface" />
                <DotPattern className="text-slate-300/30 [mask-image:radial-gradient(800px_circle_at_50%_50%,white,transparent)]" />

                <div className="container-main relative z-10">
                    <SectionTitle label="Portfolio" title="Projets récents" href="/projects" />

                    {projects.length === 0 ? (
                        <EmptyState message="Aucun projet publié pour l'instant." />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-teal-50/40 blur-[120px]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-slate-100/50 blur-[100px]" />

                <div className="container-main relative z-10">
                    <SectionTitle label="Blog" title="Articles récents" href="/blog" />

                    {posts.length === 0 ? (
                        <EmptyState message="Aucun article publié pour l'instant." />
                    ) : (
                        <div className="space-y-4">
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
            <section className="relative overflow-hidden py-20 sm:py-28">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-teal-50/20 to-white" />
                <DotPattern className="text-teal-400/10 [mask-image:radial-gradient(600px_circle_at_50%_50%,white,transparent)]" />

                <div className="container-main relative z-10">
                    <SectionTitle label="Formations" title="Apprendre avec moi" href="/formations" />

                    {formations.length === 0 ? (
                        <EmptyState message="Aucune formation publiée pour l'instant." />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {formations.map((f, i) => (
                                <FormationCard key={f.slug ?? i} f={f} i={i} isMobile={isMobile} />
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
            <section className="relative overflow-hidden bg-[#0F1A17] py-20 sm:py-28">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/[0.03] to-transparent" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundSize: "128px 128px",
                    }}
                />

                <div className="container-main relative z-10">
                    <BlurFade>
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.3em] text-teal-400/60">
                                Collaborons ensemble
                            </p>

                            <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-white/90 sm:text-4xl lg:text-5xl">
                                Un projet en tête ?
                            </h2>

                            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/35">
                                Discutons de votre idée et transformons-la en un produit digital d'exception.
                            </p>

                            <div className="mt-10 flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/contact"
                                    className="group inline-flex items-center gap-2.5 rounded-2xl bg-teal-500 px-8 py-4 text-sm font-bold text-[#0F1A17] transition-all duration-300 hover:bg-teal-400 hover:shadow-[0_0_40px_rgba(26,163,137,0.3)]"
                                >
                                    Démarrer un projet
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>

                                <a
                                    href="mailto:contact@mrsergio.dev"
                                    className="inline-flex items-center gap-2 px-8 py-4 font-mono text-sm font-medium text-white/35 transition-colors hover:text-white/60"
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