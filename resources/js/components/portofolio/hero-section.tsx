// resources/js/components/portfolio/hero-section.tsx
"use client";

import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { BadgeCheck, ArrowRight, Code2, Layers3, Smartphone } from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";
import { AvatarGlow } from "@/components/ui/AvatarGlow";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: <Code2 className="w-4 h-4" />,
    label: "Backend solide",
    value: "Laravel · APIs · Architecture",
  },
  {
    icon: <Layers3 className="w-4 h-4" />,
    label: "Frontend moderne",
    value: "React · Inertia · Tailwind",
  },
  {
    icon: <Smartphone className="w-4 h-4" />,
    label: "Mobile cross-platform",
    value: "Flutter performant",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,white,white,rgba(248,250,252,0.9))]" />

      <div className="container-main relative z-10 py-20 sm:py-24 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700"
            >
              <BadgeCheck className="w-3.5 h-3.5" />
              Développeur Full Stack disponible pour des projets ambitieux
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02]"
            >
              Je conçois des produits digitaux
              <span className="block bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                rapides, élégants et utiles.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg"
            >
              Je développe des applications web et mobiles avec une approche
              orientée performance, clarté produit et expérience utilisateur.
              De l’idée au déploiement, je transforme des besoins métiers en
              solutions concrètes avec Laravel, React et Flutter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href="/projects">
                <ShinyButton className="rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(13,148,136,0.22)]">
                  <span className="flex items-center gap-2">
                    Explorer mes projets
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </ShinyButton>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-700"
              >
                Discuter d’un projet
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32 }}
              className="mt-10 grid gap-3 sm:grid-cols-3"
            >
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-sm"
                >
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    {item.icon}
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">{item.value}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-teal-500/10 blur-3xl" />
              <AvatarGlow src="/images/profile_avatar.jpg" alt="Sergio Junior Chebeu" />

              <div className="absolute -left-6 top-10 hidden w-48 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur-md lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                  Focus
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Produits web modernes
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  UI propre, backend robuste, expérience utilisateur soignée.
                </p>
              </div>

              <div className="absolute -right-6 bottom-10 hidden w-52 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur-md lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                  Stack
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Laravel · React · Flutter
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Architecture fiable, composants réutilisables, design cohérent.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}