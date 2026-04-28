import { jsx, jsxs } from "react/jsx-runtime";
import { Link, Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { H as HexagonPattern } from "./hexagon-pattern-ChGP_1Zf.js";
import { e as easings, c as cn } from "./utils-DsUdfzPs.js";
import { S as SpotlightCard } from "./SpotlightCard-COP1lLJh.js";
import { M as MainLayout } from "./MainLayout-Cbh7ilul.js";
import "clsx";
import "tailwind-merge";
const TAG_COLORS = {
  "Laravel": "bg-red-50    text-red-600    border-red-100",
  "Inertia": "bg-sky-50    text-sky-600    border-sky-100",
  "Tailwind": "bg-teal-50   text-teal-600   border-teal-100",
  "React": "bg-sky-50    text-sky-600    border-sky-100",
  "TypeScript": "bg-violet-50 text-violet-600 border-violet-100",
  "Database": "bg-violet-50 text-violet-600 border-violet-100",
  "Productivité": "bg-amber-50  text-amber-600  border-amber-100",
  "DevOps": "bg-orange-50 text-orange-600 border-orange-100",
  "Architecture": "bg-indigo-50 text-indigo-600 border-indigo-100",
  "PHP": "bg-purple-50 text-purple-600 border-purple-100"
};
const defaultTag = "bg-slate-50 text-slate-500 border-slate-100";
function BlogCard({ post, index = 0 }) {
  const firstTag = post.tags?.[0];
  return /* @__PURE__ */ jsx(
    motion.article,
    {
      initial: { opacity: 0, y: 28 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-40px" },
      transition: { duration: 0.55, delay: index * 0.08, ease: easings.smooth },
      className: "h-full",
      children: /* @__PURE__ */ jsxs(SpotlightCard, { className: "h-full", children: [
        /* @__PURE__ */ jsx(Link, { href: `/blog/${post.slug}`, "aria-label": post.title, className: "absolute inset-0 z-10 rounded-[19px]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50/20 flex-shrink-0", style: { aspectRatio: "16/9" }, children: [
          post.cover_image_url ? /* @__PURE__ */ jsx(
            "img",
            {
              src: post.cover_image_url,
              alt: post.title,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]",
              onError: (e) => {
                e.target.style.display = "none";
              }
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-10 h-10 text-teal-200", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
          firstTag && /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3 z-10 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm", children: firstTag }),
          post.featured && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full border border-teal-300/30 bg-teal-500/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-2.5 h-2.5", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" }) }),
            "À la une"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1 p-5 gap-2.5", children: [
          post.tags && post.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: post.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsx("span", { className: cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full border", TAG_COLORS[tag] ?? defaultTag), children: tag }, tag)) }),
          /* @__PURE__ */ jsx("h3", { className: "font-display font-semibold text-[16px] leading-snug text-slate-900 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300", children: post.title }),
          post.excerpt && /* @__PURE__ */ jsx("p", { className: "text-[13px] leading-relaxed text-slate-500 line-clamp-2 flex-1", children: post.excerpt }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-4 border-t border-slate-100 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[12px] font-medium text-slate-400", children: post.published_at ?? "—" }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 transition-[gap] duration-200 group-hover:gap-2.5", children: [
              "Lire l'article",
              /* @__PURE__ */ jsx("svg", { width: "11", height: "11", viewBox: "0 0 16 16", fill: "none", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M3 8h10M9 4l4 4-4 4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) })
            ] })
          ] })
        ] })
      ] })
    }
  );
}
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
function FeaturedCard({ post }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] },
      children: /* @__PURE__ */ jsxs(SpotlightCard, { className: "w-full", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: `/blog/${post.slug}`,
            "aria-label": `Lire : ${post.title}`,
            className: "absolute inset-0 z-10 rounded-[19px]"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50/20", style: { minHeight: "220px" }, children: [
            post.cover_image_url ? /* @__PURE__ */ jsx(
              "img",
              {
                src: post.cover_image_url,
                alt: post.title,
                className: "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]",
                onError: (e) => {
                  e.target.style.display = "none";
                }
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-12 h-12 text-teal-200", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
            /* @__PURE__ */ jsxs("div", { className: "absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-teal-300/30 bg-teal-500/85 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-2.5 h-2.5", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" }) }),
              "À la une"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center p-7 sm:p-10 gap-4", children: [
            post.tags && post.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: post.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-teal-50 text-teal-700 border-teal-100", children: tag }, tag)) }),
            /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl sm:text-3xl font-bold leading-snug text-slate-900 group-hover:text-teal-600 transition-colors duration-300", children: post.title }),
            post.excerpt && /* @__PURE__ */ jsx("p", { className: "text-[14px] leading-relaxed text-slate-500 line-clamp-3", children: post.excerpt }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-slate-100 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[12px] font-medium text-slate-400", children: post.published_at ?? "—" }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 transition-[gap] duration-200 group-hover:gap-2.5", children: [
                "Lire l'article",
                /* @__PURE__ */ jsx("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M3 8h10M9 4l4 4-4 4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) })
              ] })
            ] })
          ] })
        ] })
      ] })
    }
  );
}
function Index({ posts }) {
  const [activeTag, setActiveTag] = useState(null);
  const allTags = useMemo(() => {
    const s = /* @__PURE__ */ new Set();
    posts.forEach((p) => (p.tags ?? []).forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [posts]);
  const countForTag = (tag) => posts.filter((p) => p.tags.includes(tag)).length;
  const filtered = useMemo(
    () => activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts,
    [posts, activeTag]
  );
  const featured = !activeTag ? filtered.find((p) => p.featured) : void 0;
  const rest = filtered.filter((p) => p.id !== featured?.id);
  const hasFilter = !!activeTag;
  return /* @__PURE__ */ jsxs(MainLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Blog — Sergio Junior Chebeu" }),
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
          children: "Articles"
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
              /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Blog" })
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
                "Notes & articles"
              ] }),
              /* @__PURE__ */ jsxs("h1", { className: "mt-5 font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-[#1a1916] sm:text-5xl lg:text-[52px]", children: [
                "Le",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-teal-600", children: "blog" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-5 text-[17px] leading-[1.75] text-slate-600 max-w-lg", children: "Retours d'expérience, architecture, productivité et notes de build — ce que j'apprends en construisant." }),
              /* @__PURE__ */ jsxs(motion.div, { className: "mt-7 flex items-center gap-3", animate: { opacity: 1 }, children: [
                /* @__PURE__ */ jsx("span", { className: "font-display text-3xl font-bold tracking-tight text-[#1a1916]", children: filtered.length }),
                /* @__PURE__ */ jsxs("span", { className: "text-[14px] font-medium text-slate-400", children: [
                  "article",
                  filtered.length !== 1 ? "s" : "",
                  hasFilter ? /* @__PURE__ */ jsx("span", { className: "ml-1 text-teal-600", children: "filtrés" }) : /* @__PURE__ */ jsxs("span", { className: "ml-1", children: [
                    "publié",
                    filtered.length !== 1 ? "s" : ""
                  ] })
                ] })
              ] })
            ]
          }
        )
      ] })
    ] }),
    allTags.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-y border-slate-100 bg-[#fafaf8]", children: /* @__PURE__ */ jsx("div", { className: "container-main py-5", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] },
        className: "space-y-3",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0", children: "Thème" }),
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
          hasFilter && /* @__PURE__ */ jsxs(
            motion.button,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              onClick: () => setActiveTag(null),
              className: "inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 transition-colors hover:text-red-500",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }),
                "Effacer le filtre"
              ]
            }
          )
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-white py-14 sm:py-18", children: /* @__PURE__ */ jsxs("div", { className: "container-main space-y-12", children: [
      featured && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0", children: "À la une" }),
          /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-slate-100" })
        ] }),
        /* @__PURE__ */ jsx(FeaturedCard, { post: featured })
      ] }),
      /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: filtered.length === 0 ? /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0 },
          className: "py-24 text-center",
          children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" }) }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[15px] font-semibold text-slate-500", children: "Aucun article pour ce filtre" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setActiveTag(null),
                className: "mt-3 text-[13px] font-semibold text-teal-600 hover:underline",
                children: "Réinitialiser"
              }
            )
          ]
        },
        "empty"
      ) : rest.length > 0 ? /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.25 },
          children: [
            featured && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0", children: "Tous les articles" }),
              /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-slate-100" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3", children: rest.map((post, i) => /* @__PURE__ */ jsx(BlogCard, { post, index: i }, post.id)) })
          ]
        },
        activeTag ?? "all"
      ) : null }),
      posts.length === 0 && /* @__PURE__ */ jsxs("div", { className: "py-24 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" }) }) }),
        /* @__PURE__ */ jsx("p", { className: "text-[15px] font-semibold text-slate-500", children: "Aucun article pour le moment" }),
        /* @__PURE__ */ jsx("p", { className: "text-[13px] text-slate-400 mt-1", children: "Les premiers articles arrivent bientôt !" })
      ] }),
      filtered.length > 0 && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5 },
          className: "mt-4 flex flex-col items-center gap-4 text-center",
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-[14px] font-medium text-slate-400", children: "Un sujet vous intéresse ?" }),
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
    ] }) })
  ] });
}
export {
  Index as default
};
