import { jsxs, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { D as DeleteModal } from "./shared-Cru1ch58.js";
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
function MessagesIndex({ messages }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expanded, setExpanded] = useState(null);
  function confirmDelete() {
    if (!deleteTarget) return;
    router.delete(`/admin/messages/${deleteTarget.id}`, { onSuccess: () => setDeleteTarget(null) });
  }
  function markRead(m) {
    if (m.read) return;
    router.patch(`/admin/messages/${m.id}/read`, {}, { preserveScroll: true });
  }
  const unread = messages.filter((m) => !m.read).length;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Messages", children: [
    /* @__PURE__ */ jsx(Head, { title: "Messages — Admin" }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-bold text-slate-800", children: "Messages reçus" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 mt-0.5", children: [
        messages.length,
        " message",
        messages.length > 1 ? "s" : "",
        " au total",
        unread > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full", children: [
          unread,
          " non lus"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: messages.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center py-16 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-500", children: "Aucun message pour l'instant" })
    ] }) : messages.map((m, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.04 },
        className: cn(
          "bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200",
          m.read ? "border-slate-200/80" : "border-amber-200 shadow-amber-500/5"
        ),
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-start gap-4 p-4 cursor-pointer hover:bg-slate-50/60 transition-colors",
              onClick: () => {
                setExpanded(expanded === m.id ? null : m.id);
                markRead(m);
              },
              children: [
                /* @__PURE__ */ jsx("div", { className: cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold",
                  m.read ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-800"
                ), children: m.name.charAt(0).toUpperCase() }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-0.5", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: m.name }),
                      !m.read && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 flex-shrink-0", children: new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mb-1", children: m.email }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-700 truncate", children: m.subject })
                ] }),
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: cn("w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 mt-1", expanded === m.id && "rotate-180"),
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    strokeWidth: 2,
                    children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" })
                  }
                )
              ]
            }
          ),
          expanded === m.id && /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: "auto" },
              exit: { opacity: 0, height: 0 },
              className: "border-t border-slate-100",
              children: /* @__PURE__ */ jsxs("div", { className: "p-4 pt-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-4 border border-slate-100", children: m.message }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-3", children: [
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: `mailto:${m.email}?subject=Re: ${m.subject}`,
                      className: "inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" }) }),
                        "Répondre par email"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => setDeleteTarget(m),
                      className: "inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
                        "Supprimer"
                      ]
                    }
                  )
                ] })
              ] })
            }
          )
        ]
      },
      m.id
    )) }),
    /* @__PURE__ */ jsx(DeleteModal, { open: !!deleteTarget, onClose: () => setDeleteTarget(null), onConfirm: confirmDelete, label: `message de ${deleteTarget?.name ?? ""}` })
  ] });
}
export {
  MessagesIndex as default
};
