import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { H as HexagonPattern } from "./hexagon-pattern-ChGP_1Zf.js";
import { P as ProjectCard } from "./ProjectCard-DdafTY6j.js";
import { M as MainLayout } from "./MainLayout-Cbh7ilul.js";
import { c as cn } from "./utils-DsUdfzPs.js";
import "./SpotlightCard-COP1lLJh.js";
import "clsx";
import "tailwind-merge";
const TYPE_LABELS = {
  web: "Web",
  mobile: "Mobile",
  desktop: "Desktop",
  api: "API"
};
function Chip({
  active,
  onClick,
  children,
  count
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      className: cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40",
        active ? "border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-500/20" : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50/60 hover:text-teal-700"
      ),
      children: [
        children,
        count !== void 0 && /* @__PURE__ */ jsx("span", { className: cn(
          "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
          active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
        ), children: count })
      ]
    }
  );
}
function Index({ projects }) {
  const [activeTag, setActiveTag] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const allTypes = useMemo(() => {
    const s = /* @__PURE__ */ new Set();
    projects.forEach((p) => {
      if (p.project_type) s.add(p.project_type);
    });
    return Array.from(s);
  }, [projects]);
  const allTags = useMemo(() => {
    const s = /* @__PURE__ */ new Set();
    projects.forEach((p) => (p.tags ?? []).forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [projects]);
  const countForType = (type) => projects.filter((p) => {
    const matchTag = !activeTag || p.tags.includes(activeTag);
    return matchTag && p.project_type === type;
  }).length;
  const countForTag = (tag) => projects.filter((p) => {
    const matchType = !activeType || p.project_type === activeType;
    return matchType && p.tags.includes(tag);
  }).length;
  const filtered = useMemo(() => projects.filter((p) => {
    const matchTag = !activeTag || p.tags.includes(activeTag);
    const matchType = !activeType || p.project_type === activeType;
    return matchTag && matchType;
  }), [projects, activeTag, activeType]);
  const hasFilters = !!(activeTag || activeType);
  return /* @__PURE__ */ jsxs(MainLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Projets — Sergio Junior Chebeu" }),
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-white pt-[88px] pb-14 sm:pb-18", children: [
      /* @__PURE__ */ jsx(
        HexagonPattern,
        {
          radius: 28,
          gap: 4,
          className: cn(
            "absolute inset-0 h-full w-full fill-transparent stroke-teal-600/[0.06]",
            "[mask-image:radial-gradient(ellipse_85%_90%_at_50%_50%,white_30%,transparent_100%)]"
          )
        }
      ),
      /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsx(
        "span",
        {
          className: "font-display font-extrabold uppercase leading-none tracking-[-0.04em] whitespace-nowrap text-slate-900/[0.028]",
          style: { fontSize: "clamp(56px, 11vw, 150px)" },
          children: "Projets"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "container-main relative z-10", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
            className: "mb-8 flex items-center gap-2 text-[12px] font-medium text-slate-400",
            children: [
              /* @__PURE__ */ jsx(Link, { href: "/", className: "transition-colors hover:text-teal-600", children: "Accueil" }),
              /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Projets" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.05, ease: [0.23, 1, 0.32, 1] },
            className: "max-w-2xl",
            children: [
              /* @__PURE__ */ jsxs("span", { className: "mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-teal-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700", children: [
                /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-teal-500" }),
                "Portfolio"
              ] }),
              /* @__PURE__ */ jsxs("h1", { className: "mt-5 font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-[#1a1916] sm:text-5xl lg:text-[52px]", children: [
                "Mes",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-teal-600", children: "projets" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-5 text-[17px] leading-[1.75] text-slate-600 max-w-lg", children: "Projets web, mobiles, desktop et API — conçus avec une attention particulière à l'architecture et à l'expérience utilisateur." }),
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  className: "mt-7 flex items-center gap-3",
                  animate: { opacity: 1 },
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "font-display text-3xl font-bold tracking-tight text-[#1a1916]", children: filtered.length }),
                    /* @__PURE__ */ jsxs("span", { className: "text-[14px] font-medium text-slate-400", children: [
                      "projet",
                      filtered.length !== 1 ? "s" : "",
                      hasFilters && /* @__PURE__ */ jsx("span", { className: "ml-1 text-teal-600", children: "filtrés" }),
                      !hasFilters && /* @__PURE__ */ jsx("span", { className: "ml-1", children: "au total" })
                    ] })
                  ]
                }
              )
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-y border-slate-100 bg-[#fafaf8]", children: /* @__PURE__ */ jsx("div", { className: "container-main py-5", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] },
        className: "space-y-4",
        children: [
          allTypes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0", children: "Type" }),
            /* @__PURE__ */ jsx(Chip, { active: activeType === null, onClick: () => setActiveType(null), children: "Tous" }),
            allTypes.map((type) => /* @__PURE__ */ jsx(
              Chip,
              {
                active: activeType === type,
                onClick: () => setActiveType(activeType === type ? null : type),
                count: countForType(type),
                children: TYPE_LABELS[type]
              },
              type
            ))
          ] }),
          allTags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0", children: "Stack" }),
            /* @__PURE__ */ jsx(Chip, { active: activeTag === null, onClick: () => setActiveTag(null), children: "Tous" }),
            allTags.map((tag) => /* @__PURE__ */ jsx(
              Chip,
              {
                active: activeTag === tag,
                onClick: () => setActiveTag(activeTag === tag ? null : tag),
                count: countForTag(tag),
                children: tag
              },
              tag
            ))
          ] }),
          hasFilters && /* @__PURE__ */ jsxs(
            motion.button,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.9 },
              onClick: () => {
                setActiveTag(null);
                setActiveType(null);
              },
              className: "inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 transition-colors hover:text-red-500",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }),
                "Effacer les filtres"
              ]
            }
          )
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-white py-14 sm:py-18", children: /* @__PURE__ */ jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: filtered.length === 0 ? /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0 },
          className: "py-24 text-center",
          children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[15px] font-semibold text-slate-500", children: "Aucun projet pour ce filtre" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setActiveTag(null);
                  setActiveType(null);
                },
                className: "mt-3 text-[13px] font-semibold text-teal-600 hover:underline",
                children: "Réinitialiser"
              }
            )
          ]
        },
        "empty"
      ) : /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.25 },
          className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
          children: filtered.map((project, i) => /* @__PURE__ */ jsx(ProjectCard, { project, index: i }, project.id))
        },
        `${activeType ?? "all"}-${activeTag ?? "all"}`
      ) }),
      filtered.length > 0 && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5 },
          className: "mt-16 flex flex-col items-center gap-4 text-center",
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-[14px] font-medium text-slate-400", children: "Un projet similaire en tête ?" }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: "/contact",
                className: "inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700",
                children: [
                  "Discutons-en",
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })
                ]
              }
            )
          ]
        }
      )
    ] }) })
  ] });
}
export {
  Index as default
};
