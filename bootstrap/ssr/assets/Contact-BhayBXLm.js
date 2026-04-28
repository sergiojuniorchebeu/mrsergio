import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import { useState } from "react";
import { H as HexagonPattern } from "./hexagon-pattern-ChGP_1Zf.js";
import { createMap } from "svg-dotted-map";
import { c as cn } from "./utils-DsUdfzPs.js";
import { S as SpotlightCard } from "./SpotlightCard-COP1lLJh.js";
import { M as MainLayout } from "./MainLayout-Cbh7ilul.js";
import "clsx";
import "tailwind-merge";
function DottedMap({
  width = 150,
  height = 75,
  mapSamples = 5e3,
  markers: markers2 = [],
  markerColor = "#FF6900",
  dotRadius = 0.2,
  stagger = true,
  className,
  style
}) {
  const { points, addMarkers } = createMap({
    width,
    height,
    mapSamples
  });
  const processedMarkers = addMarkers(markers2);
  const { xStep, yToRowIndex } = React.useMemo(() => {
    const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x);
    const rowMap = /* @__PURE__ */ new Map();
    let step = 0;
    let prevY = Number.NaN;
    let prevXInRow = Number.NaN;
    for (const p of sorted) {
      if (p.y !== prevY) {
        prevY = p.y;
        prevXInRow = Number.NaN;
        if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size);
      }
      if (!Number.isNaN(prevXInRow)) {
        const delta = p.x - prevXInRow;
        if (delta > 0) step = step === 0 ? delta : Math.min(step, delta);
      }
      prevXInRow = p.x;
    }
    return { xStep: step || 1, yToRowIndex: rowMap };
  }, [points]);
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: `0 0 ${width} ${height}`,
      className: cn("text-gray-500 dark:text-gray-500", className),
      style: { width: "100%", height: "100%", ...style },
      children: [
        points.map((point, index) => {
          const rowIndex = yToRowIndex.get(point.y) ?? 0;
          const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
          return /* @__PURE__ */ jsx(
            "circle",
            {
              cx: point.x + offsetX,
              cy: point.y,
              r: dotRadius,
              fill: "currentColor"
            },
            `${point.x}-${point.y}-${index}`
          );
        }),
        processedMarkers.map((marker, index) => {
          const rowIndex = yToRowIndex.get(marker.y) ?? 0;
          const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
          return /* @__PURE__ */ jsx(
            "circle",
            {
              cx: marker.x + offsetX,
              cy: marker.y,
              r: marker.size ?? dotRadius,
              fill: markerColor
            },
            `${marker.x}-${marker.y}-${index}`
          );
        })
      ]
    }
  );
}
const markers = [
  { lat: 40.7128, lng: -74.006, size: 0.3 },
  // New York
  { lat: 34.0522, lng: -118.2437, size: 0.3 },
  // Los Angeles
  { lat: 51.5074, lng: -0.1278, size: 0.3 },
  // London
  { lat: -33.8688, lng: 151.2093, size: 0.3 },
  // Sydney
  { lat: 48.8566, lng: 2.3522, size: 0.3 },
  // Paris
  { lat: 35.6762, lng: 139.6503, size: 0.3 },
  // Tokyo
  { lat: 55.7558, lng: 37.6176, size: 0.3 },
  // Moscou
  { lat: 39.9042, lng: 116.4074, size: 0.3 },
  // Beijing
  { lat: 28.6139, lng: 77.209, size: 0.3 },
  // New Delhi
  { lat: -23.5505, lng: -46.6333, size: 0.3 },
  // São Paulo
  { lat: 1.3521, lng: 103.8198, size: 0.3 },
  // Singapore
  { lat: 25.2048, lng: 55.2708, size: 0.3 },
  // Dubai
  { lat: 52.52, lng: 13.405, size: 0.3 },
  // Berlin
  { lat: 19.4326, lng: -99.1332, size: 0.3 },
  // Mexico City
  { lat: -26.2041, lng: 28.0473, size: 0.3 },
  // Johannesburg
  { lat: 3.848, lng: 11.5021, size: 0.55 },
  // Yaoundé ★
  { lat: 4.0511, lng: 9.7679, size: 0.45 }
  // Douala
];
const PhoneIcon = () => /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.8, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) });
const MailIcon = () => /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.8, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) });
const MapPinIcon = () => /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.8, children: [
  /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
  /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
] });
function Field({ label, error, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxs("label", { className: "block text-[13px] font-semibold text-slate-700", children: [
      label,
      " ",
      /* @__PURE__ */ jsx("span", { className: "text-teal-500", children: "*" })
    ] }),
    children,
    /* @__PURE__ */ jsx(AnimatePresence, { children: error && /* @__PURE__ */ jsxs(
      motion.p,
      {
        initial: { opacity: 0, y: -4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        className: "flex items-center gap-1 text-[12px] text-red-500",
        children: [
          /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
          error
        ]
      }
    ) })
  ] });
}
const inputBase = cn(
  "w-full px-4 py-3 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-400",
  "bg-[#fafaf8] border border-[rgb(226,224,218)] outline-none",
  "focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/15",
  "transition-all duration-200"
);
const inputError = "border-red-300 focus:border-red-400 focus:ring-red-400/15 bg-red-50/30";
function Spinner() {
  return /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [
    /* @__PURE__ */ jsx("circle", { className: "opacity-20", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
    /* @__PURE__ */ jsx("path", { className: "opacity-90", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
  ] });
}
function SuccessBanner({ message }) {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.96, y: 8 },
      animate: { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
      className: "flex flex-col items-center justify-center gap-5 py-12 text-center",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 border-2 border-teal-200", children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: { delay: 0.15, duration: 0.4, type: "spring", stiffness: 200 },
              className: "flex h-14 w-14 items-center justify-center rounded-full bg-teal-600",
              children: /* @__PURE__ */ jsx("svg", { className: "w-7 h-7 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-full animate-ping bg-teal-400/20" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-display text-[20px] font-bold text-slate-900", children: "Message envoyé !" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-[14px] text-slate-500 max-w-xs", children: message })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-[13px] font-medium text-teal-700", children: [
          /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" }),
          "Réponse attendue sous 24h"
        ] })
      ]
    }
  );
}
function Contact() {
  const [successMessage, setSuccessMessage] = useState(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  function handleSubmit(e) {
    e.preventDefault();
    post("/contact", {
      preserveScroll: true,
      preserveState: true,
      replace: true,
      onSuccess: () => {
        reset();
        setSuccessMessage("Votre message a bien ete envoye. Je vous repondrai dans les plus brefs delais.");
      }
    });
  }
  function updateField(field, value) {
    if (successMessage) {
      setSuccessMessage(null);
    }
    setData(field, value);
  }
  return /* @__PURE__ */ jsxs(MainLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Contact — Sergio Junior Chebeu" }),
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
          children: "Contact"
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
              /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Contact" })
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
                /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" }),
                "Disponible — Remote & Cameroun"
              ] }),
              /* @__PURE__ */ jsxs("h1", { className: "mt-5 font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-[#1a1916] sm:text-5xl lg:text-[52px]", children: [
                "Travaillons",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-teal-600", children: "ensemble" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-5 text-[17px] leading-[1.75] text-slate-600 max-w-lg", children: "Un projet web, une app mobile, une formation sur mesure ? Décrivez votre besoin — je vous réponds sous 24h." })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "bg-[#fafaf8] py-14 sm:py-18", children: /* @__PURE__ */ jsx("div", { className: "container-main", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6 items-start", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] },
          children: /* @__PURE__ */ jsxs(SpotlightCard, { className: "overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative h-56 overflow-hidden bg-slate-950 flex-shrink-0", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,6,23,0.8)_100%)]" }),
              /* @__PURE__ */ jsx(
                DottedMap,
                {
                  markers,
                  markerColor: "#2dd4bf",
                  dotRadius: 0.22,
                  className: "text-white/30"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 backdrop-blur-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" }),
                /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-white/80 tracking-wide", children: "Yaoundé, Cameroun" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-1", children: [
              /* @__PURE__ */ jsx("h2", { className: "font-display text-[19px] font-bold text-slate-900", children: "Prenons contact" }),
              /* @__PURE__ */ jsx("p", { className: "text-[13px] text-slate-500 leading-relaxed", children: "Disponible pour des missions freelance, collaborations et formations — en remote ou depuis Yaoundé." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-6 pb-6 space-y-1.5", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "tel:+237698824439",
                  className: "group flex items-center gap-4 rounded-xl border border-transparent px-4 py-3 transition-all duration-200 hover:border-teal-100 hover:bg-teal-50",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100", children: /* @__PURE__ */ jsx(PhoneIcon, {}) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400", children: "Téléphone" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[14px] font-semibold text-slate-800 transition-colors group-hover:text-teal-600", children: "+237 698 824 439" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "mailto:contact@mrsergio.dev",
                  className: "group flex items-center gap-4 rounded-xl border border-transparent px-4 py-3 transition-all duration-200 hover:border-teal-100 hover:bg-teal-50",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100", children: /* @__PURE__ */ jsx(MailIcon, {}) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400", children: "Email" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[14px] font-semibold text-slate-800 transition-colors group-hover:text-teal-600", children: "contact@mrsergio.dev" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-xl px-4 py-3", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500", children: /* @__PURE__ */ jsx(MapPinIcon, {}) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400", children: "Localisation" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[14px] font-semibold text-slate-800", children: "Yaoundé, Cameroun · Remote" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.8, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400", children: "Disponibilité" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[14px] font-semibold text-emerald-700", children: "Disponible — réponse sous 24h" })
                  ] })
                ] })
              ] })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.18, ease: [0.23, 1, 0.32, 1] },
          children: /* @__PURE__ */ jsxs(SpotlightCard, { children: [
            /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-slate-100", children: [
              /* @__PURE__ */ jsx("h2", { className: "font-display text-[19px] font-bold text-slate-900", children: "Envoyez un message" }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[13px] text-slate-500", children: [
                "Tous les champs ",
                /* @__PURE__ */ jsx("span", { className: "text-teal-600 font-semibold", children: "*" }),
                " sont obligatoires."
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5", children: [
              /* @__PURE__ */ jsx(AnimatePresence, { children: successMessage && /* @__PURE__ */ jsx(SuccessBanner, { message: successMessage }, "success") }),
              /* @__PURE__ */ jsxs(
                motion.form,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  onSubmit: handleSubmit,
                  className: "space-y-5",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsx(Field, { label: "Nom complet", error: errors.name, children: /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          value: data.name,
                          onChange: (e) => updateField("name", e.target.value),
                          placeholder: "Sergio Junior",
                          autoComplete: "name",
                          className: cn(inputBase, errors.name && inputError)
                        }
                      ) }),
                      /* @__PURE__ */ jsx(Field, { label: "Adresse email", error: errors.email, children: /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "email",
                          value: data.email,
                          onChange: (e) => updateField("email", e.target.value),
                          placeholder: "vous@exemple.com",
                          autoComplete: "email",
                          className: cn(inputBase, errors.email && inputError)
                        }
                      ) })
                    ] }),
                    /* @__PURE__ */ jsx(Field, { label: "Sujet", error: errors.subject, children: /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.subject,
                        onChange: (e) => updateField("subject", e.target.value),
                        placeholder: "Projet web, formation Laravel...",
                        className: cn(inputBase, errors.subject && inputError)
                      }
                    ) }),
                    /* @__PURE__ */ jsxs(Field, { label: "Message", error: errors.message, children: [
                      /* @__PURE__ */ jsx(
                        "textarea",
                        {
                          value: data.message,
                          onChange: (e) => updateField("message", e.target.value),
                          placeholder: "Décrivez votre projet, vos besoins, votre budget indicatif...",
                          rows: 6,
                          className: cn(inputBase, "resize-none leading-relaxed", errors.message && inputError)
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center justify-end gap-2", children: [
                        data.message.length > 1800 && /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-medium text-amber-500", children: [
                          2e3 - data.message.length,
                          " restants"
                        ] }),
                        /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-400", children: [
                          data.message.length,
                          " / 2000"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      motion.button,
                      {
                        type: "submit",
                        disabled: processing,
                        whileHover: !processing ? { scale: 1.01 } : {},
                        whileTap: !processing ? { scale: 0.98 } : {},
                        className: cn(
                          "relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-6 py-3.5",
                          "bg-teal-600 text-[14px] font-semibold text-white",
                          "shadow-sm shadow-teal-500/25 transition-all duration-200",
                          processing ? "cursor-not-allowed opacity-80" : "hover:bg-teal-700 hover:shadow-teal-500/35"
                        ),
                        children: [
                          processing && /* @__PURE__ */ jsx("span", { className: "absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" }),
                          /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: processing ? /* @__PURE__ */ jsxs(
                            motion.span,
                            {
                              initial: { opacity: 0, y: 6 },
                              animate: { opacity: 1, y: 0 },
                              exit: { opacity: 0, y: -6 },
                              className: "flex items-center gap-2.5",
                              children: [
                                /* @__PURE__ */ jsx(Spinner, {}),
                                "Envoi en cours…"
                              ]
                            },
                            "loading"
                          ) : /* @__PURE__ */ jsxs(
                            motion.span,
                            {
                              initial: { opacity: 0, y: 6 },
                              animate: { opacity: 1, y: 0 },
                              exit: { opacity: 0, y: -6 },
                              className: "flex items-center gap-2.5",
                              children: [
                                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }) }),
                                "Envoyer le message"
                              ]
                            },
                            "idle"
                          ) })
                        ]
                      }
                    )
                  ]
                }
              )
            ] })
          ] })
        }
      )
    ] }) }) })
  ] });
}
export {
  Contact as default
};
