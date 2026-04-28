import { jsxs, jsx, Fragment } from "react/jsx-runtime";
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
const Ico = {
  Plus: () => /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.6", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M7 2v10M2 7h10", strokeLinecap: "round" }) }),
  Edit: () => /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M9.5 2.5l2 2L5 11H3v-2l6.5-6.5z", strokeLinejoin: "round" }) }),
  Trash: () => /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7.5", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  Image: () => /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.3", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("rect", { x: "1.5", y: "2.5", width: "11", height: "9", rx: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M1.5 9l3-3 2.5 2.5 2-2 3 3.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx("circle", { cx: "9.5", cy: "5.5", r: "1" })
  ] }),
  Doc: () => /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: "1.3", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "2", width: "14", height: "16", rx: "2.5" }),
    /* @__PURE__ */ jsx("path", { d: "M6.5 7h7M6.5 10h7M6.5 13h5", strokeLinecap: "round" })
  ] }),
  Star: () => /* @__PURE__ */ jsx("svg", { width: "11", height: "11", viewBox: "0 0 11 11", fill: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M5.5 1l1.26 2.55 2.82.41-2.04 1.99.48 2.8L5.5 7.47 2.98 8.75l.48-2.8L1.42 3.96l2.82-.41z" }) })
};
function Toggle({ checked, onChange }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: onChange,
      "aria-label": checked ? "Dépublier" : "Publier",
      className: cn(
        "relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
        checked ? "bg-teal-500" : "bg-slate-200"
      ),
      children: /* @__PURE__ */ jsx("span", { className: cn(
        "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm",
        "transition-transform duration-200",
        checked ? "translate-x-4" : "translate-x-0.5"
      ) })
    }
  );
}
function EmptyState() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400", children: /* @__PURE__ */ jsx(Ico.Doc, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[14px] font-semibold text-slate-700", children: "Aucun article" }),
      /* @__PURE__ */ jsx("p", { className: "text-[12px] text-slate-400 mt-0.5", children: "Rédigez votre premier article de blog." })
    ] }),
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: "/admin/blog/create",
        className: "inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 hover:text-teal-700 transition-colors",
        children: [
          /* @__PURE__ */ jsx(Ico.Plus, {}),
          " Créer un article"
        ]
      }
    )
  ] });
}
function BlogIndex({ posts }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  function confirmDelete() {
    if (!deleteTarget) return;
    router.delete(`/admin/blog/${deleteTarget.id}`, {
      onSuccess: () => setDeleteTarget(null)
    });
  }
  function togglePublished(p) {
    router.patch(`/admin/blog/${p.id}`, { published: !p.published }, { preserveScroll: true });
  }
  const pub = posts.filter((p) => p.published).length;
  const draft = posts.length - pub;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Blog", breadcrumb: [{ label: "Blog" }], children: [
    /* @__PURE__ */ jsx(Head, { title: "Blog — Admin" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-[20px] font-bold text-slate-900 tracking-tight", children: "Articles" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-1", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[12px] text-slate-500", children: [
            posts.length,
            " au total"
          ] }),
          pub > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "w-px h-3 bg-slate-200" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[12px] text-teal-600 font-medium", children: [
              pub,
              " publiés"
            ] })
          ] }),
          draft > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "w-px h-3 bg-slate-200" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[12px] text-slate-400", children: [
              draft,
              " brouillons"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/admin/blog/create",
          className: cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl",
            "bg-teal-600 text-white text-[13px] font-semibold",
            "shadow-[0_1px_3px_rgba(29,158,117,0.3)]",
            "hover:bg-teal-700 hover:shadow-[0_4px_12px_rgba(29,158,117,0.35)]",
            "transition-all duration-200"
          ),
          children: [
            /* @__PURE__ */ jsx(Ico.Plus, {}),
            " Nouvel article"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-200/70 rounded-2xl overflow-hidden", children: posts.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {}) : /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-slate-100 bg-slate-50/60", children: [
          /* @__PURE__ */ jsx("th", { className: "text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-5 py-3.5", children: "Article" }),
          /* @__PURE__ */ jsx("th", { className: "text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-4 py-3.5 hidden sm:table-cell", children: "Tags" }),
          /* @__PURE__ */ jsx("th", { className: "text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-4 py-3.5", children: "Statut" }),
          /* @__PURE__ */ jsx("th", { className: "text-left text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-4 py-3.5 hidden md:table-cell", children: "Date" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3.5 w-[90px]" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100/70", children: posts.map((p, i) => /* @__PURE__ */ jsxs(
          motion.tr,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: i * 0.035 },
            className: "group hover:bg-slate-50/50 transition-colors duration-100",
            children: [
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200/50", children: p.cover_image ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: `/storage/${p.cover_image}`,
                    alt: "",
                    className: "w-full h-full object-cover",
                    loading: "lazy"
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-slate-300", children: /* @__PURE__ */ jsx(Ico.Image, {}) }) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[13px] font-semibold text-slate-800 truncate leading-snug", children: p.title }),
                    p.featured && /* @__PURE__ */ jsx("span", { className: "text-amber-500 flex-shrink-0", title: "Mis en avant", children: /* @__PURE__ */ jsx(Ico.Star, {}) })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 truncate mt-0.5 max-w-[260px]", children: p.excerpt })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5 hidden sm:table-cell", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
                (p.tags ?? []).slice(0, 3).map((tag) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full",
                    children: tag
                  },
                  tag
                )),
                (p.tags ?? []).length > 3 && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-400", children: [
                  "+",
                  p.tags.length - 3
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Toggle,
                  {
                    checked: p.published,
                    onChange: () => togglePublished(p)
                  }
                ),
                /* @__PURE__ */ jsx(PublishedBadge, { published: p.published })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5 hidden md:table-cell", children: /* @__PURE__ */ jsx("span", { className: "text-[12px] text-slate-400", children: p.published_at ? new Date(p.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "—" }) }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: `/admin/blog/${p.id}/edit`,
                    className: "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all duration-150",
                    title: "Modifier",
                    children: /* @__PURE__ */ jsx(Ico.Edit, {})
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setDeleteTarget(p),
                    className: "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150",
                    title: "Supprimer",
                    children: /* @__PURE__ */ jsx(Ico.Trash, {})
                  }
                )
              ] }) })
            ]
          },
          p.id
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3 border-t border-slate-100 bg-slate-50/40", children: /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-400", children: [
        posts.length,
        " article",
        posts.length > 1 ? "s" : "",
        " — ",
        pub,
        " publié",
        pub > 1 ? "s" : ""
      ] }) })
    ] }) }),
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
  BlogIndex as default
};
