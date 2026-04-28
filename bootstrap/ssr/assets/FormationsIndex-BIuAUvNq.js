import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { A as AnimatedGridPattern, F as FormationCard } from "./FormationCard-DcE083g9.js";
import { M as MainLayout } from "./MainLayout-Cbh7ilul.js";
import { c as cn } from "./utils-DsUdfzPs.js";
import "motion/react";
import "./SpotlightCard-COP1lLJh.js";
import "clsx";
import "tailwind-merge";
const LEVEL_ORDER = ["débutant", "intermédiaire", "avancé"];
const LEVEL_LABELS = {
  "débutant": "Débutant",
  "intermédiaire": "Intermédiaire",
  "avancé": "Avancé"
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
function FormationsIndex({ formations, categories }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const availableLevels = useMemo(() => {
    const s = /* @__PURE__ */ new Set();
    formations.forEach((f) => {
      if (f.level) s.add(f.level);
    });
    return LEVEL_ORDER.filter((l) => s.has(l));
  }, [formations]);
  const countForCategory = (cat) => formations.filter((f) => {
    const lvl = !activeLevel || f.level === activeLevel;
    return lvl && f.category === cat;
  }).length;
  const countForLevel = (lvl) => formations.filter((f) => {
    const cat = !activeCategory || f.category === activeCategory;
    return cat && f.level === lvl;
  }).length;
  const filtered = useMemo(
    () => formations.filter((f) => {
      const matchCat = !activeCategory || f.category === activeCategory;
      const matchLvl = !activeLevel || f.level === activeLevel;
      return matchCat && matchLvl;
    }),
    [formations, activeCategory, activeLevel]
  );
  const hasFilters = !!(activeCategory || activeLevel);
  const totalLessons = formations.reduce((acc, f) => acc + (f.lessons_count || 0), 0);
  const totalStudents = formations.reduce((acc, f) => acc + (f.students_count || 0), 0);
  return /* @__PURE__ */ jsxs(MainLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Formations — Sergio Junior Chebeu" }),
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-[#fafaf8] pt-[88px] pb-14", children: [
      /* @__PURE__ */ jsx(
        AnimatedGridPattern,
        {
          numSquares: 20,
          maxOpacity: 0.045,
          duration: 5,
          repeatDelay: 1.4,
          width: 36,
          height: 36,
          className: cn(
            "absolute inset-0 h-full w-full",
            "fill-transparent stroke-teal-500/[0.10] text-teal-500",
            "[mask-image:radial-gradient(ellipse_80%_70%_at_50%_42%,black_18%,rgba(0,0,0,0.65)_52%,transparent_88%)]"
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": true,
          className: "pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full",
          style: { background: "radial-gradient(circle, rgba(26,163,137,0.08) 0%, transparent 70%)" }
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": true,
          className: "pointer-events-none absolute -bottom-20 -right-20 h-[500px] w-[500px] rounded-full",
          style: { background: "radial-gradient(circle, rgba(248,194,62,0.07) 0%, transparent 70%)" }
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": true,
          className: "pointer-events-none absolute top-1/2 right-1/3 h-[320px] w-[320px] -translate-y-1/2 rounded-full",
          style: { background: "radial-gradient(circle, rgba(26,163,137,0.04) 0%, transparent 70%)" }
        }
      ),
      /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsx(
        "span",
        {
          className: "font-display font-extrabold uppercase leading-none tracking-[-0.04em] whitespace-nowrap text-slate-900/[0.025]",
          style: { fontSize: "clamp(48px, 10vw, 140px)" },
          children: "Formations"
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
              /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Formations" })
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
                "Apprendre · Pratiquer · Maîtriser"
              ] }),
              /* @__PURE__ */ jsxs("h1", { className: "mt-5 font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-[#1a1916] sm:text-5xl lg:text-[52px]", children: [
                "Mes",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-teal-600", children: "formations" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-5 text-[17px] leading-[1.75] text-slate-600 max-w-lg", children: "Des formations pratiques sur Laravel, Flutter, Firebase, Python et Java — conçues pour passer de zéro à opérationnel rapidement." }),
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 12 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5, delay: 0.2 },
                  className: "mt-8 flex flex-wrap items-center gap-6",
                  children: [
                    { value: filtered.length, label: hasFilters ? "filtrées" : "formations" },
                    { value: `${totalLessons}+`, label: "leçons" },
                    { value: categories.length, label: "technologies" },
                    ...totalStudents > 0 ? [{ value: `${totalStudents}+`, label: "apprenants" }] : []
                  ].map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-display text-2xl font-bold text-[#1a1916]", children: s.value }),
                    /* @__PURE__ */ jsx("span", { className: "text-[13px] font-medium text-slate-400", children: s.label })
                  ] }, i))
                }
              )
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-y border-slate-100 bg-white", children: /* @__PURE__ */ jsx("div", { className: "container-main py-5", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] },
        className: "space-y-4",
        children: [
          categories.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0", children: "Catégorie" }),
            /* @__PURE__ */ jsx(Chip, { active: activeCategory === null, onClick: () => setActiveCategory(null), children: "Toutes" }),
            categories.map((cat) => /* @__PURE__ */ jsx(
              Chip,
              {
                active: activeCategory === cat,
                onClick: () => setActiveCategory(activeCategory === cat ? null : cat),
                count: countForCategory(cat),
                children: cat
              },
              cat
            ))
          ] }),
          availableLevels.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0", children: "Niveau" }),
            /* @__PURE__ */ jsx(Chip, { active: activeLevel === null, onClick: () => setActiveLevel(null), children: "Tous" }),
            availableLevels.map((lvl) => /* @__PURE__ */ jsx(
              Chip,
              {
                active: activeLevel === lvl,
                onClick: () => setActiveLevel(activeLevel === lvl ? null : lvl),
                count: countForLevel(lvl),
                children: LEVEL_LABELS[lvl]
              },
              lvl
            ))
          ] }),
          hasFilters && /* @__PURE__ */ jsxs(
            motion.button,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              onClick: () => {
                setActiveCategory(null);
                setActiveLevel(null);
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
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-[#fafaf8] py-14 sm:py-18", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": true,
          className: "pointer-events-none absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full",
          style: { background: "radial-gradient(circle, rgba(26,163,137,0.05) 0%, transparent 70%)" }
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": true,
          className: "pointer-events-none absolute top-1/4 right-0 h-[350px] w-[350px] rounded-full",
          style: { background: "radial-gradient(circle, rgba(248,194,62,0.05) 0%, transparent 70%)" }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "container-main relative z-10", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: filtered.length === 0 ? /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: "py-24 text-center",
            children: [
              /* @__PURE__ */ jsx("div", { className: "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }),
              /* @__PURE__ */ jsx("p", { className: "text-[15px] font-semibold text-slate-500", children: "Aucune formation pour ce filtre" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setActiveCategory(null);
                    setActiveLevel(null);
                  },
                  className: "mt-3 text-[13px] font-semibold text-teal-600 hover:underline",
                  children: "Voir toutes les formations"
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
            children: filtered.map((formation, i) => /* @__PURE__ */ jsx(FormationCard, { formation, index: i }, formation.id))
          },
          `${activeCategory ?? "all"}-${activeLevel ?? "all"}`
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
              /* @__PURE__ */ jsx("p", { className: "text-[14px] font-medium text-slate-400", children: "Tu veux une formation sur un sujet spécifique ?" }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: "/contact",
                  className: "inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700",
                  children: [
                    "Suggérer un sujet",
                    /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })
                  ]
                }
              )
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  FormationsIndex as default
};
