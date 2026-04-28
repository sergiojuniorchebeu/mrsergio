import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { M as MainLayout } from "./MainLayout-Cbh7ilul.js";
import { e as easings, c as cn } from "./utils-DsUdfzPs.js";
import "react";
import "clsx";
import "tailwind-merge";
const LEVEL_COLORS = {
  "débutant": "bg-green-50  text-green-700  border-green-100",
  "intermédiaire": "bg-amber-50  text-amber-700  border-amber-100",
  "avancé": "bg-red-50    text-red-700    border-red-100"
};
const CATEGORY_ICONS = {
  "Laravel": "🔴",
  "Flutter": "🔵",
  "Python": "🐍",
  "Java": "☕"
};
function Show({ formation, related }) {
  return /* @__PURE__ */ jsxs(MainLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `${formation.title} — Formations` }),
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-surface-card border-b border-slate-200/60", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "container-main py-12 sm:py-16 relative z-10", children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, x: -12 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.4, ease: easings.smooth },
            children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: "/formations",
                className: "inline-flex items-center gap-2 text-sm text-ink-muted hover:text-teal-600 transition-colors mb-8 group",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 transition-transform group-hover:-translate-x-0.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16l-4-4m0 0l4-4m-4 4h18" }) }),
                  "Retour aux formations"
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-5 gap-10 lg:gap-16 items-start", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 24 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, ease: easings.smooth, delay: 0.1 },
              className: "lg:col-span-3 space-y-5",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-sm font-semibold text-ink-secondary", children: [
                    /* @__PURE__ */ jsx("span", { children: CATEGORY_ICONS[formation.category] ?? "📚" }),
                    formation.category
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-ink-subtle", children: "·" }),
                  /* @__PURE__ */ jsx("span", { className: cn(
                    "text-xs font-medium px-2.5 py-1 rounded-full border",
                    LEVEL_COLORS[formation.level]
                  ), children: formation.level.charAt(0).toUpperCase() + formation.level.slice(1) })
                ] }),
                /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink-primary tracking-tight leading-tight", children: formation.title }),
                /* @__PURE__ */ jsx("p", { className: "text-lg text-ink-secondary leading-relaxed", children: formation.excerpt }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: formation.tags.map((tag) => /* @__PURE__ */ jsx("span", { className: "text-xs font-medium px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200", children: tag }, tag)) }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-4 py-5 border-y border-slate-100", children: [
                  { icon: "⏱", label: "Durée", value: formation.duration_formatted },
                  { icon: "📚", label: "Leçons", value: `${formation.lessons_count}` },
                  { icon: "🌍", label: "Langue", value: formation.language ?? "Français" }
                ].map((m) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xl mb-1", children: m.icon }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-ink-primary", children: m.value }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-ink-muted", children: m.label })
                ] }, m.label)) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 24 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, ease: easings.smooth, delay: 0.2 },
              className: "lg:col-span-2",
              children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200/70 bg-surface-raised shadow-xl shadow-slate-200/50 overflow-hidden sticky top-24", children: [
                /* @__PURE__ */ jsx("div", { className: "aspect-video bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: formation.cover_image_url,
                    alt: formation.title,
                    className: "w-full h-full object-cover",
                    onError: (e) => {
                      e.target.style.display = "none";
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: cn(
                      "text-3xl font-display font-bold",
                      formation.is_free ? "text-teal-600" : "text-ink-primary"
                    ), children: formation.price_formatted }),
                    formation.is_free && /* @__PURE__ */ jsx("span", { className: "text-sm text-ink-muted", children: "accès complet" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "#",
                      className: "flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors duration-200 shadow-sm shadow-teal-500/20",
                      children: formation.is_free ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [
                          /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" }),
                          /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
                        ] }),
                        "Commencer gratuitement"
                      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" }) }),
                        "Accéder à la formation"
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: [
                    "Accès à vie au contenu",
                    "Exercices pratiques inclus",
                    `${formation.lessons_count} leçons vidéo`,
                    `${formation.duration_formatted} de contenu`
                  ].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-xs text-ink-muted", children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 text-teal-500 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M5 13l4 4L19 7" }) }),
                    item
                  ] }, item)) })
                ] })
              ] })
            }
          )
        ] })
      ] })
    ] }),
    formation.content && /* @__PURE__ */ jsx("section", { className: "container-main py-12 sm:py-16", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: easings.smooth, delay: 0.3 },
        className: "max-w-3xl",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-display font-bold text-ink-primary mb-8 pb-4 border-b border-slate-100", children: "Programme de la formation" }),
          /* @__PURE__ */ jsx("div", { className: "prose prose-slate prose-headings:font-display prose-headings:text-ink-primary prose-a:text-teal-600 prose-strong:text-ink-primary prose-li:text-ink-secondary max-w-none", children: /* @__PURE__ */ jsx(ReactMarkdown, { children: formation.content }) })
        ]
      }
    ) }),
    related.length > 0 && /* @__PURE__ */ jsx("section", { className: "border-t border-slate-200/60 bg-surface-card", children: /* @__PURE__ */ jsxs("div", { className: "container-main py-12 sm:py-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-slate-200" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-ink-muted uppercase tracking-[0.2em] whitespace-nowrap", children: "Formations similaires" }),
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-slate-200" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: related.map((f, i) => /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.45, ease: easings.smooth, delay: i * 0.08 },
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              href: `/formations/${f.slug}`,
              className: "group flex flex-col gap-3 p-5 rounded-2xl bg-surface-raised border border-slate-200/70 hover:border-teal-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-ink-secondary flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx("span", { children: CATEGORY_ICONS[f.category] ?? "📚" }),
                    f.category
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full border",
                    LEVEL_COLORS[f.level]
                  ), children: f.level })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-ink-primary leading-snug group-hover:text-teal-600 transition-colors", children: f.title }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-ink-muted", children: [
                    f.duration_formatted,
                    " · ",
                    f.lessons_count,
                    " leçons"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: cn(
                    "text-xs font-bold",
                    f.is_free ? "text-teal-600" : "text-ink-primary"
                  ), children: f.price_formatted })
                ] })
              ]
            }
          )
        },
        f.id
      )) })
    ] }) })
  ] });
}
export {
  Show as default
};
