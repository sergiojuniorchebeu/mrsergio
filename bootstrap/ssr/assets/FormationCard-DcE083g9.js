import { jsxs, jsx } from "react/jsx-runtime";
import { useId, useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { c as cn, e as easings } from "./utils-DsUdfzPs.js";
import { Link } from "@inertiajs/react";
import { motion as motion$1 } from "framer-motion";
import { S as SpotlightCard } from "./SpotlightCard-COP1lLJh.js";
function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}) {
  const id = useId();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState([]);
  const getPos = useCallback(() => {
    if (!dimensions.width || !dimensions.height) return [0, 0];
    return [
      Math.floor(Math.random() * dimensions.width / width),
      Math.floor(Math.random() * dimensions.height / height)
    ];
  }, [dimensions.width, dimensions.height, width, height]);
  const generateSquares = useCallback(
    (count) => Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos(),
      iteration: 0
    })),
    [getPos]
  );
  const updateSquarePosition = useCallback(
    (squareId) => {
      setSquares((prev) => {
        const current = prev[squareId];
        if (!current || current.id !== squareId) return prev;
        const next = prev.slice();
        next[squareId] = {
          ...current,
          pos: getPos(),
          iteration: current.iteration + 1
        };
        return next;
      });
    },
    [getPos]
  );
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setSquares(generateSquares(numSquares));
    }
  }, [dimensions.width, dimensions.height, generateSquares, numSquares]);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        setDimensions(
          (prev) => prev.width === w && prev.height === h ? prev : { width: w, height: h }
        );
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const pathD = useMemo(() => `M.5 ${height}V.5H${width}`, [width, height]);
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ref: containerRef,
      "aria-hidden": "true",
      className: cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx(
          "pattern",
          {
            id,
            width,
            height,
            patternUnits: "userSpaceOnUse",
            x,
            y,
            children: /* @__PURE__ */ jsx("path", { d: pathD, fill: "none", strokeDasharray })
          }
        ) }),
        /* @__PURE__ */ jsx("rect", { width: "100%", height: "100%", fill: `url(#${id})` }),
        /* @__PURE__ */ jsx("svg", { x, y, className: "overflow-visible", children: squares.map(({ pos: [sx, sy], id: sqId, iteration }, index) => /* @__PURE__ */ jsx(
          motion.rect,
          {
            initial: { opacity: 0 },
            animate: { opacity: maxOpacity },
            transition: {
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
              repeatDelay
            },
            onAnimationComplete: () => updateSquarePosition(sqId),
            width: width - 1,
            height: height - 1,
            x: sx * width + 1,
            y: sy * height + 1,
            fill: "currentColor",
            strokeWidth: "0"
          },
          `${sqId}-${iteration}`
        )) })
      ]
    }
  );
}
const LEVEL_STYLES = {
  "débutant": "bg-emerald-50/90 text-emerald-700 border-emerald-200/60",
  "intermédiaire": "bg-amber-50/90   text-amber-700   border-amber-200/60",
  "avancé": "bg-red-50/90     text-red-700     border-red-200/60"
};
const defaultLevel = "bg-slate-50/90 text-slate-600 border-slate-200/60";
function FormationCard({ formation, index = 0 }) {
  const levelStyle = LEVEL_STYLES[formation.level] ?? defaultLevel;
  const levelLabel = formation.level.charAt(0).toUpperCase() + formation.level.slice(1);
  return /* @__PURE__ */ jsx(
    motion$1.article,
    {
      initial: { opacity: 0, y: 28 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-40px" },
      transition: { duration: 0.55, delay: index * 0.08, ease: easings.smooth },
      className: "h-full",
      children: /* @__PURE__ */ jsxs(SpotlightCard, { className: "h-full", children: [
        /* @__PURE__ */ jsx(Link, { href: `/formations/${formation.slug}`, "aria-label": formation.title, className: "absolute inset-0 z-10 rounded-[19px]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative h-48 overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50/20 flex-shrink-0", children: [
          formation.cover_image_url ? /* @__PURE__ */ jsx(
            "img",
            {
              src: formation.cover_image_url,
              alt: formation.title,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]",
              onError: (e) => {
                e.target.style.display = "none";
              }
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-10 h-10 text-teal-200", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0", children: /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-white/20 border border-white/30 backdrop-blur-sm", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-white translate-x-0.5", fill: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) }) }),
          /* @__PURE__ */ jsx("div", { className: cn(
            "absolute top-3 right-3 z-10 rounded-full border px-3 py-1 text-[11px] font-bold backdrop-blur-sm",
            formation.is_free ? "border-teal-200/60 bg-teal-500/80 text-white" : "border-white/20 bg-black/50 text-white"
          ), children: formation.price_formatted }),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 left-3 z-10 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm", children: formation.category }),
            /* @__PURE__ */ jsx("div", { className: cn("rounded-full border px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm", levelStyle), children: levelLabel })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1 p-5 gap-3", children: [
          formation.featured && /* @__PURE__ */ jsxs("span", { className: "self-start inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-2.5 h-2.5", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" }) }),
            "Populaire"
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "font-display font-semibold text-[16px] leading-snug text-slate-900 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300", children: formation.title }),
          formation.excerpt && /* @__PURE__ */ jsx("p", { className: "text-[13px] leading-relaxed text-slate-500 line-clamp-2 flex-1", children: formation.excerpt }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-[12px] text-slate-400", children: [
            formation.duration_formatted && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
              formation.duration_formatted
            ] }),
            formation.lessons_count > 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
              formation.lessons_count,
              " leçons"
            ] }),
            formation.students_count !== void 0 && formation.students_count > 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }) }),
              formation.students_count
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 pt-4 border-t border-slate-100 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 transition-[gap] duration-200 group-hover:gap-2.5", children: [
              "Accéder",
              /* @__PURE__ */ jsx("svg", { width: "11", height: "11", viewBox: "0 0 16 16", fill: "none", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M3 8h10M9 4l4 4-4 4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) })
            ] }),
            formation.is_free ? /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-2.5 py-0.5", children: "Gratuit" }) : /* @__PURE__ */ jsx("span", { className: "text-[13px] font-bold text-slate-700", children: formation.price_formatted })
          ] })
        ] })
      ] })
    }
  );
}
export {
  AnimatedGridPattern as A,
  FormationCard as F
};
