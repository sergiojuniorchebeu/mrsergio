import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { e as easings, c as cn } from "./utils-DsUdfzPs.js";
import { S as SpotlightCard } from "./SpotlightCard-COP1lLJh.js";
const TAG_COLORS = {
  Laravel: "bg-red-50    text-red-600    border-red-100",
  React: "bg-sky-50    text-sky-600    border-sky-100",
  Flutter: "bg-blue-50   text-blue-600   border-blue-100",
  TypeScript: "bg-violet-50 text-violet-600 border-violet-100",
  MySQL: "bg-orange-50 text-orange-600 border-orange-100",
  PostgreSQL: "bg-indigo-50 text-indigo-600 border-indigo-100",
  Firebase: "bg-amber-50  text-amber-600  border-amber-100",
  Redis: "bg-rose-50   text-rose-600   border-rose-100",
  Python: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Dart: "bg-cyan-50   text-cyan-600   border-cyan-100",
  Docker: "bg-sky-50    text-sky-700    border-sky-100",
  Vue: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Next: "bg-slate-50  text-slate-700  border-slate-200"
};
const defaultTag = "bg-slate-50 text-slate-500 border-slate-100";
const TYPE_BADGE = {
  web: { bg: "bg-emerald-50/90 text-emerald-700 border-emerald-200/60", dot: "bg-emerald-400" },
  mobile: { bg: "bg-blue-50/90    text-blue-700    border-blue-200/60", dot: "bg-blue-400" },
  desktop: { bg: "bg-indigo-50/90  text-indigo-700  border-indigo-200/60", dot: "bg-indigo-400" },
  api: { bg: "bg-amber-50/90   text-amber-700   border-amber-200/60", dot: "bg-amber-400" }
};
const defaultBadge = { bg: "bg-white/90 text-slate-600 border-slate-200/60", dot: "bg-slate-400" };
function getPreviewImage(p) {
  return p.screenshots_urls?.[0] ?? p.image_url ?? null;
}
function getPrimaryLink(p) {
  if (p.project_type === "mobile") return p.store_links?.play_store ?? p.store_links?.app_store ?? p.demo_url ?? null;
  if (p.project_type === "desktop") return p.store_links?.windows ?? p.store_links?.macos ?? p.demo_url ?? null;
  if (p.project_type === "api") return p.store_links?.docs ?? p.store_links?.base_url ?? p.demo_url ?? null;
  return p.demo_url ?? null;
}
function getCtaLabel(p) {
  switch (p.project_type) {
    case "mobile":
      return "Voir l'app";
    case "desktop":
      return "Voir le logiciel";
    case "api":
      return "Voir l'API";
    default:
      return "Voir le projet";
  }
}
function GithubIcon({ className = "w-4 h-4" }) {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className, fill: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" }) });
}
function ExternalIcon({ className = "w-4 h-4" }) {
  return /* @__PURE__ */ jsx("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) });
}
function ArrowSmall() {
  return /* @__PURE__ */ jsx("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M3 8h10M9 4l4 4-4 4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function ProjectCard({ project, index = 0 }) {
  const previewImage = getPreviewImage(project);
  const externalLink = getPrimaryLink(project);
  const typeKey = project.project_type ?? "web";
  const badge = TYPE_BADGE[typeKey] ?? defaultBadge;
  const typeLabel = project.project_type_label ?? typeKey.toUpperCase();
  return /* @__PURE__ */ jsx(
    motion.article,
    {
      initial: { opacity: 0, y: 28 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-40px" },
      transition: { duration: 0.55, delay: index * 0.09, ease: easings.smooth },
      className: "h-full",
      children: /* @__PURE__ */ jsxs(SpotlightCard, { className: "h-full", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: `/projects/${project.slug}`,
            "aria-label": `Voir ${project.title}`,
            className: "absolute inset-0 z-10 rounded-[19px]"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative h-48 sm:h-52 overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50/20 flex-shrink-0", children: [
          previewImage ? /* @__PURE__ */ jsx(
            "img",
            {
              src: previewImage,
              alt: project.title,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 text-teal-300", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-10 h-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-400", children: project.title })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/65 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-350 group-hover:opacity-100" }),
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-20 flex items-center justify-center gap-3 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0", children: [
            project.github_url && !project.private_repo && /* @__PURE__ */ jsx(
              "a",
              {
                href: project.github_url,
                target: "_blank",
                rel: "noreferrer",
                onClick: (e) => e.stopPropagation(),
                "aria-label": "GitHub",
                className: "flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 border border-white/25 text-white backdrop-blur-sm transition-colors hover:bg-white/30",
                children: /* @__PURE__ */ jsx(GithubIcon, {})
              }
            ),
            externalLink && /* @__PURE__ */ jsx(
              "a",
              {
                href: externalLink,
                target: "_blank",
                rel: "noreferrer",
                onClick: (e) => e.stopPropagation(),
                "aria-label": "Ouvrir",
                className: "flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/80 border border-teal-300/30 text-white backdrop-blur-sm transition-colors hover:bg-teal-500",
                children: /* @__PURE__ */ jsx(ExternalIcon, {})
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: cn(
            "absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] backdrop-blur-sm",
            badge.bg
          ), children: [
            /* @__PURE__ */ jsx("span", { className: cn("h-1.5 w-1.5 rounded-full", badge.dot) }),
            typeLabel
          ] }),
          project.featured && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full border border-teal-300/30 bg-teal-500/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-2.5 h-2.5", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" }) }),
            "Featured"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1 p-5 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
            project.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsx("span", { className: cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full border", TAG_COLORS[tag] ?? defaultTag), children: tag }, tag)),
            project.tags.length > 3 && /* @__PURE__ */ jsxs("span", { className: "text-[11px] px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-400 border-slate-100", children: [
              "+",
              project.tags.length - 3
            ] })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "font-display font-semibold text-[16px] leading-snug text-slate-900 group-hover:text-teal-600 transition-colors duration-300", children: project.title }),
          /* @__PURE__ */ jsx("p", { className: "text-[13px] leading-relaxed text-slate-500 line-clamp-2 flex-1", children: project.description }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 pt-4 border-t border-slate-100 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 transition-[gap] duration-200 group-hover:gap-2.5", children: [
              getCtaLabel(project),
              /* @__PURE__ */ jsx(ArrowSmall, {})
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              project.github_url && /* @__PURE__ */ jsx("span", { title: project.private_repo ? "Repo privé" : "GitHub", className: cn("flex h-6 w-6 items-center justify-center rounded-lg", project.private_repo ? "bg-slate-100 text-slate-300" : "bg-slate-100 text-slate-500"), children: /* @__PURE__ */ jsx(GithubIcon, { className: "w-3.5 h-3.5" }) }),
              externalLink && /* @__PURE__ */ jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-lg bg-teal-50 text-teal-500", children: /* @__PURE__ */ jsx(ExternalIcon, { className: "w-3.5 h-3.5" }) })
            ] })
          ] })
        ] })
      ] })
    }
  );
}
export {
  ProjectCard as P
};
