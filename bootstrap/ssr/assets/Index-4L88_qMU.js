import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { P as PublishedBadge, D as DeleteModal } from "./shared-Cru1ch58.js";
import { A as AdminLayout } from "./AdminLayout-B2uDO5Pc.js";
import { c as cn } from "./utils-DsUdfzPs.js";
import "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
function TypeBadge({ type }) {
  const cls = type === "mobile" ? "bg-blue-50 text-blue-700 border-blue-100" : type === "desktop" ? "bg-indigo-50 text-indigo-700 border-indigo-100" : type === "api" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100";
  const label = type === "mobile" ? "MOBILE" : type === "desktop" ? "DESKTOP" : type === "api" ? "API" : "WEB";
  return /* @__PURE__ */ jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide", cls), children: label });
}
function ProjectsIndex({ projects }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  function confirmDelete() {
    if (!deleteTarget) return;
    router.delete(`/admin/projects/${deleteTarget.id}`, {
      onSuccess: () => setDeleteTarget(null)
    });
  }
  function togglePublished(project) {
    router.patch(
      `/admin/projects/${project.id}`,
      { published: !project.published },
      { preserveScroll: true }
    );
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Projets", children: [
    /* @__PURE__ */ jsx(Head, { title: "Projets — Admin" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-slate-800", children: "Projets" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-sm text-slate-500", children: [
          projects.length,
          " projet",
          projects.length > 1 ? "s" : "",
          " au total"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/admin/projects/create",
          className: "inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-500/20 transition-colors hover:bg-teal-700",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4v16m8-8H4" }) }),
            "Nouveau projet"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm", children: projects.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400", children: /* @__PURE__ */ jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" }) }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-500", children: "Aucun projet pour l'instant" }),
      /* @__PURE__ */ jsx(Link, { href: "/admin/projects/create", className: "mt-3 text-sm font-semibold text-teal-600 hover:underline", children: "Créer le premier" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-slate-100 bg-slate-50/70", children: [
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500", children: "Projet" }),
        /* @__PURE__ */ jsx("th", { className: "hidden px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:table-cell", children: "Tags" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500", children: "Statut" }),
        /* @__PURE__ */ jsx("th", { className: "hidden px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 md:table-cell", children: "Featured" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3.5" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: projects.map((project, i) => /* @__PURE__ */ jsxs(
        motion.tr,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: i * 0.04 },
          className: "transition-colors hover:bg-slate-50/60",
          children: [
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100", children: project.image ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: `/storage/${project.image}`,
                  alt: project.title,
                  className: "h-full w-full object-cover"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center text-slate-400", children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold leading-snug text-slate-800", children: project.title }),
                /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400", children: [
                    "/",
                    project.slug
                  ] }),
                  /* @__PURE__ */ jsx(TypeBadge, { type: project.project_type })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "hidden px-4 py-4 sm:table-cell", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: (project.tags ?? []).slice(0, 3).map((tag) => /* @__PURE__ */ jsx(
              "span",
              {
                className: "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600",
                children: tag
              },
              tag
            )) }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => togglePublished(project),
                  className: cn(
                    "relative h-5 w-10 rounded-full transition-colors duration-200",
                    project.published ? "bg-teal-500" : "bg-slate-300"
                  ),
                  children: /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                        project.published ? "translate-x-5" : "translate-x-0.5"
                      )
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(PublishedBadge, { published: project.published })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "hidden px-4 py-4 md:table-cell", children: project.featured ? /* @__PURE__ */ jsx("span", { className: "rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700", children: "Mis en avant" }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "—" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/admin/projects/${project.id}/edit`,
                  className: "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-teal-50 hover:text-teal-600",
                  children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setDeleteTarget(project),
                  className: "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-500",
                  children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
                }
              )
            ] }) })
          ]
        },
        project.id
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsx(
      DeleteModal,
      {
        open: !!deleteTarget,
        onClose: () => setDeleteTarget(null),
        onConfirm: confirmDelete,
        label: deleteTarget?.title ?? ""
      }
    )
  ] });
}
export {
  ProjectsIndex as default
};
