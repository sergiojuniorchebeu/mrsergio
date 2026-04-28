import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { A as AdminLayout } from "./AdminLayout-B2uDO5Pc.js";
import { c as cn } from "./utils-DsUdfzPs.js";
import "react";
import "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
const Ico = {
  Code: () => /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M5.5 3.5L2 8l3.5 4.5M10.5 3.5L14 8l-3.5 4.5M9.5 2l-3 12", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  Doc: () => /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "1.5", width: "12", height: "13", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M5 5.5h6M5 8h6M5 10.5h4", strokeLinecap: "round" })
  ] }),
  Cap: () => /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("path", { d: "M8 2.5L1.5 6 8 9.5 14.5 6 8 2.5z", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M4.5 7.5V11c0 1.5 1.5 2.5 3.5 2.5S11.5 12.5 11.5 11V7.5", strokeLinecap: "round" })
  ] }),
  Mail: () => /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("rect", { x: "1.5", y: "3.5", width: "13", height: "9", rx: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M1.5 3.5l6.5 5 6.5-5", strokeLinecap: "round", strokeLinejoin: "round" })
  ] }),
  ArrowUpRight: () => /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  Plus: () => /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.6", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M7 2v10M2 7h10", strokeLinecap: "round" }) }),
  ChevronRight: () => /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M4.5 2.5L7.5 6l-3 3.5", strokeLinecap: "round", strokeLinejoin: "round" }) })
};
function pct(pub, total) {
  if (total === 0) return 0;
  return Math.round(pub / total * 100);
}
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 6e4);
  const hours = Math.floor(diff / 36e5);
  const days = Math.floor(diff / 864e5);
  if (mins < 2) return "À l'instant";
  if (mins < 60) return `${mins}min`;
  if (hours < 24) return `${hours}h`;
  return `${days}j`;
}
const ACCENTS = {
  teal: { iconBg: "bg-teal-50", iconText: "text-teal-600", barBg: "bg-teal-500", pillBg: "bg-teal-50", pillText: "text-teal-700" },
  blue: { iconBg: "bg-blue-50", iconText: "text-blue-600", barBg: "bg-blue-500", pillBg: "bg-blue-50", pillText: "text-blue-700" },
  violet: { iconBg: "bg-violet-50", iconText: "text-violet-600", barBg: "bg-violet-500", pillBg: "bg-violet-50", pillText: "text-violet-700" },
  amber: { iconBg: "bg-amber-50", iconText: "text-amber-600", barBg: "bg-amber-400", pillBg: "bg-amber-50", pillText: "text-amber-700" }
};
function StatCard({
  label,
  total,
  published,
  href,
  color,
  Icon,
  delay,
  suffix
}) {
  const a = ACCENTS[color];
  const p = pct(published, total);
  const diff = total - published;
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: [0, 0, 0.2, 1], delay },
      children: /* @__PURE__ */ jsx(Link, { href, className: "group block h-full", children: /* @__PURE__ */ jsxs("div", { className: cn(
        "h-full bg-white border border-slate-200/70 rounded-2xl p-5",
        "flex flex-col gap-4",
        "transition-all duration-200",
        "hover:border-slate-300/80 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
        "hover:-translate-y-0.5"
      ), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", a.iconBg), children: /* @__PURE__ */ jsx("span", { className: a.iconText, children: /* @__PURE__ */ jsx(Icon, {}) }) }),
          /* @__PURE__ */ jsxs("span", { className: cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", a.pillBg, a.pillText), children: [
            published,
            " pub."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[32px] font-bold text-slate-900 leading-none tracking-tight", children: total }),
          /* @__PURE__ */ jsx("p", { className: "text-[13px] font-medium text-slate-500 mt-1", children: label })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[3px] bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { width: 0 },
              animate: { width: `${p}%` },
              transition: { duration: 0.7, delay: delay + 0.2, ease: [0, 0, 0.2, 1] },
              className: cn("h-full rounded-full", a.barBg)
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-400", children: [
              p,
              "% publiés"
            ] }),
            diff > 0 && /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-400", children: [
              diff,
              " brouillon",
              diff > 1 ? "s" : ""
            ] })
          ] })
        ] })
      ] }) })
    }
  );
}
function MessageRow({ msg, i }) {
  const initials = msg.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return /* @__PURE__ */ jsxs(
    motion.tr,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.3 + i * 0.04 },
      className: cn(
        "group transition-colors duration-150",
        msg.read ? "hover:bg-slate-50/60" : "bg-amber-50/40 hover:bg-amber-50/70"
      ),
      children: [
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0",
            msg.read ? "bg-slate-100 text-slate-600" : "bg-amber-200 text-amber-800"
          ), children: initials }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: cn("text-[13px] font-semibold truncate leading-tight", msg.read ? "text-slate-700" : "text-slate-900"), children: msg.name }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 truncate", children: msg.email })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5 hidden sm:table-cell", children: /* @__PURE__ */ jsx("p", { className: "text-[13px] text-slate-600 truncate max-w-[280px]", children: msg.subject }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
          !msg.read && /* @__PURE__ */ jsx("span", { className: "inline-flex text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full", children: "Nouveau" }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-400", children: timeAgo(msg.created_at) })
        ] }) })
      ]
    }
  );
}
function QuickAction({ href, label, sub, color }) {
  const a = ACCENTS[color];
  return /* @__PURE__ */ jsxs(Link, { href, className: "group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors", children: [
    /* @__PURE__ */ jsx("div", { className: cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", a.iconBg), children: /* @__PURE__ */ jsx("span", { className: a.iconText, children: /* @__PURE__ */ jsx(Ico.Plus, {}) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[13px] font-medium text-slate-800 leading-tight", children: label }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 truncate", children: sub })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "text-slate-300 group-hover:text-slate-400 transition-colors", children: /* @__PURE__ */ jsx(Ico.ChevronRight, {}) })
  ] });
}
function Dashboard({ stats, recent_messages }) {
  const hour = (/* @__PURE__ */ new Date()).getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Vue d'ensemble", children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard — Admin" }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        className: "mb-7",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-[22px] font-bold text-slate-900 tracking-tight", children: [
            greeting,
            ", Sergio 👋"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[13px] text-slate-500 mt-1", children: "Voici l'état de votre portfolio aujourd'hui." })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Projets", total: stats.projects, published: stats.projects_pub, href: "/admin/projects", color: "teal", Icon: Ico.Code, delay: 0.04 }),
      /* @__PURE__ */ jsx(StatCard, { label: "Articles de blog", total: stats.blog_posts, published: stats.blog_posts_pub, href: "/admin/blog", color: "blue", Icon: Ico.Doc, delay: 0.08 }),
      /* @__PURE__ */ jsx(StatCard, { label: "Formations", total: stats.formations, published: stats.formations_pub, href: "/admin/formations", color: "violet", Icon: Ico.Cap, delay: 0.12 }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, ease: [0, 0, 0.2, 1], delay: 0.16 },
          children: /* @__PURE__ */ jsx(Link, { href: "/admin/messages", className: "group block h-full", children: /* @__PURE__ */ jsxs("div", { className: cn(
            "h-full bg-white border border-slate-200/70 rounded-2xl p-5",
            "flex flex-col gap-4",
            "transition-all duration-200",
            "hover:border-slate-300/80 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
          ), children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-amber-600", children: /* @__PURE__ */ jsx(Ico.Mail, {}) }) }),
              stats.messages_unread > 0 ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" }),
                stats.messages_unread,
                " non lus"
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full", children: "Tous lus" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[32px] font-bold text-slate-900 leading-none tracking-tight", children: stats.messages }),
              /* @__PURE__ */ jsx("p", { className: "text-[13px] font-medium text-slate-500 mt-1", children: "Messages reçus" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "h-[3px] bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { width: 0 },
                  animate: { width: `${pct(stats.messages - stats.messages_unread, stats.messages)}%` },
                  transition: { duration: 0.7, delay: 0.36, ease: [0, 0, 0.2, 1] },
                  className: "h-full rounded-full bg-amber-400"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-400", children: [
                  stats.messages - stats.messages_unread,
                  " lus"
                ] }),
                stats.messages_unread > 0 && /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-400", children: [
                  stats.messages_unread,
                  " en attente"
                ] })
              ] })
            ] })
          ] }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay: 0.22 },
          className: "bg-white border border-slate-200/70 rounded-2xl p-5",
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-slate-400 uppercase tracking-[0.16em] mb-4", children: "Actions rapides" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx(QuickAction, { href: "/admin/projects/create", label: "Nouveau projet", sub: "Ajouter un projet au portfolio", color: "teal" }),
              /* @__PURE__ */ jsx(QuickAction, { href: "/admin/blog/create", label: "Nouvel article", sub: "Rédiger un article de blog", color: "blue" }),
              /* @__PURE__ */ jsx(QuickAction, { href: "/admin/formations/create", label: "Nouvelle formation", sub: "Créer une formation", color: "violet" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay: 0.26 },
          className: "lg:col-span-2 bg-white border border-slate-200/70 rounded-2xl overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-slate-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[13px] font-semibold text-slate-800", children: "Messages récents" }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: "/admin/messages",
                  className: "flex items-center gap-1 text-[12px] font-medium text-teal-600 hover:text-teal-700 transition-colors",
                  children: [
                    "Voir tout ",
                    /* @__PURE__ */ jsx(Ico.ArrowUpRight, {})
                  ]
                }
              )
            ] }),
            recent_messages.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400", children: /* @__PURE__ */ jsx(Ico.Mail, {}) }),
              /* @__PURE__ */ jsx("p", { className: "text-[12px] text-slate-400 font-medium", children: "Aucun message pour l'instant" })
            ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: "w-full", children: /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100/70", children: recent_messages.map((msg, i) => /* @__PURE__ */ jsx(MessageRow, { msg, i }, msg.id)) }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  Dashboard as default
};
