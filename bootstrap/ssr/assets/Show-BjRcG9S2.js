import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { M as MainLayout } from "./MainLayout-Cbh7ilul.js";
import { P as ProjectCard } from "./ProjectCard-DdafTY6j.js";
import { c as cn, e as easings } from "./utils-DsUdfzPs.js";
import "react";
import "./SpotlightCard-COP1lLJh.js";
import "clsx";
import "tailwind-merge";
const PHONE_WIDTH = 433;
const PHONE_HEIGHT = 882;
const SCREEN_X = 21.25;
const SCREEN_Y = 19.25;
const SCREEN_WIDTH = 389.5;
const SCREEN_HEIGHT = 843.5;
const SCREEN_RADIUS = 55.75;
const LEFT_PCT = SCREEN_X / PHONE_WIDTH * 100;
const TOP_PCT = SCREEN_Y / PHONE_HEIGHT * 100;
const WIDTH_PCT = SCREEN_WIDTH / PHONE_WIDTH * 100;
const HEIGHT_PCT = SCREEN_HEIGHT / PHONE_HEIGHT * 100;
const RADIUS_H = SCREEN_RADIUS / SCREEN_WIDTH * 100;
const RADIUS_V = SCREEN_RADIUS / SCREEN_HEIGHT * 100;
function Iphone({
  src,
  videoSrc,
  className,
  style,
  ...props
}) {
  const hasVideo = !!videoSrc;
  const hasMedia = hasVideo || !!src;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative inline-block w-full align-middle leading-none ${className}`,
      style: {
        aspectRatio: `${PHONE_WIDTH}/${PHONE_HEIGHT}`,
        ...style
      },
      ...props,
      children: [
        hasVideo && /* @__PURE__ */ jsx(
          "div",
          {
            className: "pointer-events-none absolute z-0 overflow-hidden",
            style: {
              left: `${LEFT_PCT}%`,
              top: `${TOP_PCT}%`,
              width: `${WIDTH_PCT}%`,
              height: `${HEIGHT_PCT}%`,
              borderRadius: `${RADIUS_H}% / ${RADIUS_V}%`
            },
            children: /* @__PURE__ */ jsx(
              "video",
              {
                className: "block size-full object-cover",
                src: videoSrc,
                autoPlay: true,
                loop: true,
                muted: true,
                playsInline: true,
                preload: "metadata"
              }
            )
          }
        ),
        !hasVideo && src && /* @__PURE__ */ jsx(
          "div",
          {
            className: "pointer-events-none absolute z-0 overflow-hidden",
            style: {
              left: `${LEFT_PCT}%`,
              top: `${TOP_PCT}%`,
              width: `${WIDTH_PCT}%`,
              height: `${HEIGHT_PCT}%`,
              borderRadius: `${RADIUS_H}% / ${RADIUS_V}%`
            },
            children: /* @__PURE__ */ jsx(
              "img",
              {
                src,
                alt: "",
                className: "block size-full object-cover object-top"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(
          "svg",
          {
            viewBox: `0 0 ${PHONE_WIDTH} ${PHONE_HEIGHT}`,
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: "absolute inset-0 size-full",
            style: { transform: "translateZ(0)" },
            children: [
              /* @__PURE__ */ jsxs("g", { mask: hasMedia ? "url(#screenPunch)" : void 0, children: [
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z",
                    className: "fill-[#E5E5E5] dark:fill-[#404040]"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z",
                    className: "fill-[#E5E5E5] dark:fill-[#404040]"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M1 234C1 233.448 1.44772 233 2 233H3.5V300H2C1.44772 300 1 299.552 1 299V234Z",
                    className: "fill-[#E5E5E5] dark:fill-[#404040]"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M1 319C1 318.448 1.44772 318 2 318H3.5V385H2C1.44772 385 1 384.552 1 384V319Z",
                    className: "fill-[#E5E5E5] dark:fill-[#404040]"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M430 279H432C432.552 279 433 279.448 433 280V384C433 384.552 432.552 385 432 385H430V279Z",
                    className: "fill-[#E5E5E5] dark:fill-[#404040]"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z",
                    className: "fill-white dark:fill-[#262626]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "path",
                {
                  opacity: "0.5",
                  d: "M174 5H258V5.5C258 6.60457 257.105 7.5 256 7.5H176C174.895 7.5 174 6.60457 174 5.5V5Z",
                  className: "fill-[#E5E5E5] dark:fill-[#404040]"
                }
              ),
              /* @__PURE__ */ jsx(
                "path",
                {
                  d: `M${SCREEN_X} 75C${SCREEN_X} 44.2101 46.2101 ${SCREEN_Y} 77 ${SCREEN_Y}H355C385.79 ${SCREEN_Y} 410.75 44.2101 410.75 75V807C410.75 837.79 385.79 862.75 355 862.75H77C46.2101 862.75 ${SCREEN_X} 837.79 ${SCREEN_X} 807V75Z`,
                  className: "fill-[#E5E5E5] stroke-[#E5E5E5] stroke-[0.5] dark:fill-[#404040] dark:stroke-[#404040]",
                  mask: hasMedia ? "url(#screenPunch)" : void 0
                }
              ),
              /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M154 48.5C154 38.2827 162.283 30 172.5 30H259.5C269.717 30 278 38.2827 278 48.5C278 58.7173 269.717 67 259.5 67H172.5C162.283 67 154 58.7173 154 48.5Z",
                  className: "fill-[#F5F5F5] dark:fill-[#262626]"
                }
              ),
              /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M249 48.5C249 42.701 253.701 38 259.5 38C265.299 38 270 42.701 270 48.5C270 54.299 265.299 59 259.5 59C253.701 59 249 54.299 249 48.5Z",
                  className: "fill-[#F5F5F5] dark:fill-[#262626]"
                }
              ),
              /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M254 48.5C254 45.4624 256.462 43 259.5 43C262.538 43 265 45.4624 265 48.5C265 51.5376 262.538 54 259.5 54C256.462 54 254 51.5376 254 48.5Z",
                  className: "fill-[#E5E5E5] dark:fill-[#404040]"
                }
              ),
              /* @__PURE__ */ jsxs("defs", { children: [
                /* @__PURE__ */ jsxs("mask", { id: "screenPunch", maskUnits: "userSpaceOnUse", children: [
                  /* @__PURE__ */ jsx(
                    "rect",
                    {
                      x: "0",
                      y: "0",
                      width: PHONE_WIDTH,
                      height: PHONE_HEIGHT,
                      fill: "white"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "rect",
                    {
                      x: SCREEN_X,
                      y: SCREEN_Y,
                      width: SCREEN_WIDTH,
                      height: SCREEN_HEIGHT,
                      rx: SCREEN_RADIUS,
                      ry: SCREEN_RADIUS,
                      fill: "black"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("clipPath", { id: "roundedCorners", children: /* @__PURE__ */ jsx(
                  "rect",
                  {
                    x: SCREEN_X,
                    y: SCREEN_Y,
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    rx: SCREEN_RADIUS,
                    ry: SCREEN_RADIUS
                  }
                ) })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function BrowserWindow({
  src,
  alt = "",
  urlLabel = "https://product.demo",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-full bg-red-400" }),
            /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-full bg-amber-400" }),
            /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-full bg-emerald-400" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mx-4 flex h-9 flex-1 items-center rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-400", children: urlLabel })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "aspect-[16/10] bg-slate-100", children: /* @__PURE__ */ jsx(
          "img",
          {
            src,
            alt,
            loading: "lazy",
            decoding: "async",
            className: "h-full w-full object-cover object-top"
          }
        ) })
      ]
    }
  );
}
function DesktopWindow({
  src,
  alt = "",
  title = "Desktop App",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("mx-auto w-full max-w-5xl", className), ...props, children: [
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-[24px] border border-slate-300 bg-[#111827] shadow-[0_20px_80px_rgba(15,23,42,0.18)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-white/10 bg-[#1f2937] px-4 py-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-full bg-red-400" }),
          /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-full bg-amber-400" }),
          /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-full bg-emerald-400" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-white/50", children: title })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "aspect-[16/10] bg-black", children: /* @__PURE__ */ jsx(
        "img",
        {
          src,
          alt,
          loading: "lazy",
          decoding: "async",
          className: "h-full w-full object-cover object-top"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto h-4 w-[38%] rounded-b-2xl bg-slate-300" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto mt-1 h-2 w-[18%] rounded-full bg-slate-200" })
  ] });
}
function ProjectScreenshotsGallery({
  projectType,
  screenshots,
  title,
  demoUrl
}) {
  if (!screenshots?.length) return null;
  if (projectType === "mobile") {
    return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: screenshots.map((src, i) => /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-[260px]", children: /* @__PURE__ */ jsx(Iphone, { src, "aria-label": `${title} screenshot ${i + 1}` }) }, src + i)) });
  }
  if (projectType === "desktop") {
    return /* @__PURE__ */ jsx("div", { className: "space-y-8", children: screenshots.map((src, i) => /* @__PURE__ */ jsx(
      DesktopWindow,
      {
        src,
        alt: `${title} screenshot ${i + 1}`,
        title
      },
      src + i
    )) });
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-8", children: screenshots.map((src, i) => /* @__PURE__ */ jsx(
    BrowserWindow,
    {
      src,
      alt: `${title} screenshot ${i + 1}`,
      urlLabel: demoUrl || "https://product.demo"
    },
    src + i
  )) });
}
const TAG_COLORS = {
  Laravel: "bg-red-50 text-red-600 border-red-100",
  React: "bg-sky-50 text-sky-600 border-sky-100",
  Flutter: "bg-blue-50 text-blue-600 border-blue-100",
  TypeScript: "bg-blue-50 text-blue-700 border-blue-100",
  MySQL: "bg-orange-50 text-orange-600 border-orange-100",
  PostgreSQL: "bg-indigo-50 text-indigo-600 border-indigo-100",
  Firebase: "bg-amber-50 text-amber-600 border-amber-100",
  Redis: "bg-rose-50 text-rose-600 border-rose-100",
  Python: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Dart: "bg-cyan-50 text-cyan-600 border-cyan-100"
};
const defaultTagColor = "bg-slate-50 text-slate-600 border-slate-100";
const PLATFORM_COLORS = {
  Web: "bg-slate-50 text-slate-700 border-slate-200",
  Android: "bg-emerald-50 text-emerald-700 border-emerald-100",
  iOS: "bg-sky-50 text-sky-700 border-sky-100",
  Desktop: "bg-indigo-50 text-indigo-700 border-indigo-100",
  API: "bg-amber-50 text-amber-700 border-amber-100",
  Windows: "bg-indigo-50 text-indigo-700 border-indigo-100",
  macOS: "bg-slate-50 text-slate-700 border-slate-200",
  Linux: "bg-amber-50 text-amber-700 border-amber-100"
};
const defaultPlatformColor = "bg-slate-50 text-slate-700 border-slate-200";
const TYPE_COLORS = {
  web: "bg-emerald-50 text-emerald-700 border-emerald-100",
  mobile: "bg-blue-50 text-blue-700 border-blue-100",
  desktop: "bg-indigo-50 text-indigo-700 border-indigo-100",
  api: "bg-amber-50 text-amber-700 border-amber-100"
};
function Show({ project, related }) {
  const repoDisabled = project.private_repo || !project.github_url;
  return /* @__PURE__ */ jsxs(MainLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `${project.title} — Sergio Junior Chebeu` }),
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-slate-200/60 bg-surface-card", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "container-main relative z-10 py-12 sm:py-16", children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, x: -12 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.4, ease: easings.smooth },
            children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: "/projects",
                className: "group mb-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-teal-600",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16l-4-4m0 0l4-4m-4 4h18" }) }),
                  "Retour aux projets"
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid items-start gap-10 lg:grid-cols-2 lg:gap-16", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 24 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, ease: easings.smooth, delay: 0.1 },
              className: "space-y-6",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cn(
                        "rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
                        TYPE_COLORS[project.project_type] ?? "bg-slate-50 text-slate-700 border-slate-200"
                      ),
                      children: project.project_type_label ?? project.project_type
                    }
                  ),
                  project.tags.map((tag) => /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cn(
                        "rounded-lg border px-2.5 py-1 text-xs font-medium",
                        TAG_COLORS[tag] ?? defaultTagColor
                      ),
                      children: tag
                    },
                    tag
                  ))
                ] }),
                project.platforms?.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: project.platforms.map((platform) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: cn(
                      "rounded-lg border px-2.5 py-1 text-xs font-medium",
                      PLATFORM_COLORS[platform] ?? defaultPlatformColor
                    ),
                    children: platform
                  },
                  platform
                )) }),
                /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold leading-tight tracking-tight text-ink-primary sm:text-4xl", children: project.title }),
                /* @__PURE__ */ jsx("p", { className: "text-lg leading-relaxed text-ink-secondary", children: project.description }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
                  !repoDisabled ? /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: project.github_url,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-700",
                      children: [
                        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "h-4 w-4", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" }) }),
                        "Voir le code"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      disabled: true,
                      title: project.private_repo ? "Repo privé" : "Repo non disponible",
                      className: "cursor-not-allowed inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500",
                      children: [
                        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "h-4 w-4", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" }) }),
                        project.private_repo ? "Repo privé" : "Repo indisponible"
                      ]
                    }
                  ),
                  project.demo_url && /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: project.demo_url,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-500/20 transition-colors duration-200 hover:bg-teal-700",
                      children: [
                        /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }),
                        "Voir la démo"
                      ]
                    }
                  )
                ] }),
                project.project_type === "mobile" && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-1", children: [
                  project.store_links?.play_store && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: project.store_links.play_store,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700",
                      children: "Play Store"
                    }
                  ),
                  project.store_links?.app_store && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: project.store_links.app_store,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700",
                      children: "App Store"
                    }
                  )
                ] }),
                project.project_type === "desktop" && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-1", children: [
                  project.store_links?.windows && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: project.store_links.windows,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700",
                      children: "Windows"
                    }
                  ),
                  project.store_links?.macos && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: project.store_links.macos,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700",
                      children: "macOS"
                    }
                  ),
                  project.store_links?.linux && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: project.store_links.linux,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700",
                      children: "Linux"
                    }
                  )
                ] }),
                project.project_type === "api" && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-1", children: [
                  project.store_links?.docs && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: project.store_links.docs,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700",
                      children: "Documentation"
                    }
                  ),
                  project.store_links?.postman && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: project.store_links.postman,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700",
                      children: "Postman"
                    }
                  ),
                  project.store_links?.base_url && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: project.store_links.base_url,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700",
                      children: "Base URL"
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.97 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.6, ease: easings.smooth, delay: 0.2 },
              className: "relative aspect-video overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-100 to-slate-50 shadow-xl shadow-slate-200/60",
              children: project.image_url ? /* @__PURE__ */ jsx("img", { src: project.image_url, alt: project.title, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-teal-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" }) }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400", children: "Pas d'image disponible" })
              ] }) })
            }
          )
        ] })
      ] })
    ] }),
    project.content && /* @__PURE__ */ jsx("section", { className: "container-main py-12 sm:py-16", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: easings.smooth, delay: 0.3 },
        className: "mx-auto max-w-3xl",
        children: /* @__PURE__ */ jsx("div", { className: "prose prose-slate max-w-none prose-headings:font-display prose-headings:text-ink-primary prose-a:text-teal-600 prose-strong:text-ink-primary", children: /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap border-0 bg-transparent p-0 font-sans text-sm leading-relaxed text-ink-secondary", children: project.content.trim() }) })
      }
    ) }),
    project.screenshots?.length > 0 && /* @__PURE__ */ jsx("section", { className: "pb-16 sm:pb-20", children: /* @__PURE__ */ jsxs("div", { className: "container-main", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-shrink-0 items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-teal-400" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted", children: "Captures d'écran" }),
          /* @__PURE__ */ jsx("span", { className: "rounded-full border border-teal-100 bg-teal-50 px-2 py-0.5 text-[10px] font-bold tabular-nums text-teal-600", children: project.screenshots.length })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" })
      ] }),
      /* @__PURE__ */ jsx(
        ProjectScreenshotsGallery,
        {
          projectType: project.project_type,
          screenshots: project.screenshots,
          title: project.title,
          demoUrl: project.demo_url
        }
      )
    ] }) }),
    related.length > 0 && /* @__PURE__ */ jsx("section", { className: "border-t border-slate-200/60 bg-surface-card", children: /* @__PURE__ */ jsxs("div", { className: "container-main py-12 sm:py-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-slate-200" }),
        /* @__PURE__ */ jsx("p", { className: "whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-ink-muted", children: "Autres projets" }),
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-slate-200" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: related.map((p, i) => /* @__PURE__ */ jsx(ProjectCard, { project: p, index: i }, p.id)) })
    ] }) })
  ] });
}
export {
  Show as default
};
