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
const levelColors = {
  "débutant": "bg-green-50 text-green-700 border-green-100",
  "intermédiaire": "bg-amber-50 text-amber-700 border-amber-100",
  "avancé": "bg-red-50  text-red-700  border-red-100"
};
function FormationsIndex({ formations }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  function confirmDelete() {
    if (!deleteTarget) return;
    router.delete(`/admin/formations/${deleteTarget.id}`, { onSuccess: () => setDeleteTarget(null) });
  }
  function togglePublished(f) {
    router.patch(`/admin/formations/${f.id}`, { published: !f.published }, { preserveScroll: true });
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Formations", children: [
    /* @__PURE__ */ jsx(Head, { title: "Formations — Admin" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-bold text-slate-800", children: "Formations" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 mt-0.5", children: [
          formations.length,
          " formation",
          formations.length > 1 ? "s" : "",
          " au total"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Link, { href: "/admin/formations/create", className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm shadow-teal-500/20", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4v16m8-8H4" }) }),
        "Nouvelle formation"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden", children: formations.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-500", children: "Aucune formation pour l'instant" }),
      /* @__PURE__ */ jsx(Link, { href: "/admin/formations/create", className: "mt-3 text-sm text-teal-600 font-semibold hover:underline", children: "Créer la première" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-slate-100 bg-slate-50/70", children: [
        /* @__PURE__ */ jsx("th", { className: "text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3.5", children: "Formation" }),
        /* @__PURE__ */ jsx("th", { className: "text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3.5 hidden sm:table-cell", children: "Catégorie / Niveau" }),
        /* @__PURE__ */ jsx("th", { className: "text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3.5 hidden md:table-cell", children: "Durée" }),
        /* @__PURE__ */ jsx("th", { className: "text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3.5 hidden lg:table-cell", children: "Prix" }),
        /* @__PURE__ */ jsx("th", { className: "text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3.5", children: "Statut" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3.5" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: formations.map((f, i) => /* @__PURE__ */ jsxs(motion.tr, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.04 }, className: "hover:bg-slate-50/60 transition-colors", children: [
        /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden", children: f.cover_image ? /* @__PURE__ */ jsx("img", { src: `/storage/${f.cover_image}`, alt: f.title, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-slate-400", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800 leading-snug", children: f.title })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-4 hidden sm:table-cell", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full w-fit", children: f.category }),
          /* @__PURE__ */ jsx("span", { className: cn("text-xs font-medium px-2 py-0.5 rounded-full border w-fit", levelColors[f.level] ?? "bg-slate-100 text-slate-600"), children: f.level })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-4 hidden md:table-cell", children: /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-600", children: [
          f.duration_hours,
          "h · ",
          f.lessons_count,
          " leçons"
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-4 hidden lg:table-cell", children: f.is_free ? /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-teal-600", children: "Gratuit" }) : /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-slate-700", children: [
          f.price ? Number(f.price).toFixed(2) : "—",
          " €"
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => togglePublished(f), className: cn("relative w-10 h-5 rounded-full transition-colors duration-200", f.published ? "bg-teal-500" : "bg-slate-300"), children: /* @__PURE__ */ jsx("span", { className: cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200", f.published ? "translate-x-5" : "translate-x-0.5") }) }),
          /* @__PURE__ */ jsx(PublishedBadge, { published: f.published })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 justify-end", children: [
          /* @__PURE__ */ jsx(Link, { href: `/admin/formations/${f.id}/edit`, className: "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setDeleteTarget(f), className: "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })
        ] }) })
      ] }, f.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsx(DeleteModal, { open: !!deleteTarget, onClose: () => setDeleteTarget(null), onConfirm: confirmDelete, label: deleteTarget?.title ?? "" })
  ] });
}
export {
  FormationsIndex as default
};
