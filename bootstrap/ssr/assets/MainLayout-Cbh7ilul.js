import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { c as cn } from "./utils-DsUdfzPs.js";
const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/projects", label: "Projets" },
  { href: "/blog", label: "Blog" },
  { href: "/formations", label: "Formations" }
];
const footerLinks = [
  { href: "/projects", label: "Projets" },
  { href: "/blog", label: "Blog" },
  { href: "/formations", label: "Formations" },
  { href: "/contact", label: "Contact" }
];
const socials = [
  {
    label: "GitHub",
    href: "https://github.com/sergiojuniorchebeu",
    icon: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "w-4 h-4", fill: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" }) })
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/sergiojuniorchebeu",
    icon: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "w-4 h-4", fill: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" }) })
  },
  {
    label: "Email",
    href: "mailto:contact@mrsergio.dev",
    icon: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "w-4 h-4", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) })
  }
];
function LogoMark({ size = 26 }) {
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 32 32", fill: "none", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx(
      "polygon",
      {
        points: "16,2 28,9 28,23 16,30 4,23 4,9",
        fill: "#1aa389",
        fillOpacity: "0.14",
        stroke: "#1aa389",
        strokeWidth: "1.2"
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M11 12.5Q11 9.5 14 9.5H18Q21 9.5 21 12.5Q21 15.5 16 17Q11 18.5 11 21.5Q11 24.5 14 24.5H18Q21 24.5 21 21.5",
        stroke: "#1aa389",
        strokeWidth: "2.2",
        strokeLinecap: "round",
        fill: "none"
      }
    ),
    /* @__PURE__ */ jsx("circle", { cx: "26", cy: "9", r: "3", fill: "#1aa389" })
  ] });
}
function MainLayout({ children }) {
  const { url } = usePage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setMenuOpen(false);
  }, [url]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-surface", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-x-0 top-0 z-50 px-4 pt-3", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-5xl", children: [
      /* @__PURE__ */ jsxs(
        "header",
        {
          className: cn(
            "flex items-center justify-between rounded-2xl border transition-all duration-300",
            "bg-white/90 supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:backdrop-blur-md",
            "border-slate-200/70",
            scrolled ? "h-[52px] px-4 shadow-[0_8px_24px_rgba(15,23,42,0.09)]" : "h-[58px] px-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
          ),
          children: [
            /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex items-center gap-2.5 shrink-0", children: [
              /* @__PURE__ */ jsx(LogoMark, { size: scrolled ? 24 : 26 }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-none gap-[2px]", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-display text-[13px] font-bold tracking-tight text-slate-900", children: [
                  "mr",
                  /* @__PURE__ */ jsx("span", { className: "text-teal-600", children: "sergio" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-mono text-[9px] tracking-[0.18em] text-slate-400", children: ".dev" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "hidden md:block h-4 w-px bg-slate-200 mx-1" }),
            /* @__PURE__ */ jsx("nav", { className: "hidden md:flex items-center gap-0.5", children: navLinks.map((link) => {
              const isActive = link.href === "/" ? url === "/" : url.startsWith(link.href);
              return /* @__PURE__ */ jsxs(
                Link,
                {
                  href: link.href,
                  className: cn(
                    "relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150",
                    isActive ? "text-teal-700" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/80"
                  ),
                  children: [
                    link.label,
                    isActive && /* @__PURE__ */ jsx("span", { className: "absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-teal-500" })
                  ]
                },
                link.href
              );
            }) }),
            /* @__PURE__ */ jsx("div", { className: "hidden md:block h-4 w-px bg-slate-200 mx-1" }),
            /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx(
              Link,
              {
                href: "/contact",
                className: "inline-flex items-center rounded-xl bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(26,163,137,0.2)_inset] transition-all duration-200 hover:bg-teal-700 hover:shadow-[0_2px_8px_rgba(26,163,137,0.25)]",
                children: "Me contacter"
              }
            ) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setMenuOpen((v) => !v),
                "aria-label": menuOpen ? "Fermer le menu" : "Ouvrir le menu",
                "aria-expanded": menuOpen,
                className: "md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50",
                children: /* @__PURE__ */ jsxs("div", { className: "relative h-[14px] w-[18px]", children: [
                  /* @__PURE__ */ jsx("span", { className: cn("absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-current transition-all duration-200", menuOpen ? "top-[6px] rotate-45" : "") }),
                  /* @__PURE__ */ jsx("span", { className: cn("absolute left-0 top-[6px] h-[1.5px] w-full rounded-full bg-current transition-opacity duration-200", menuOpen ? "opacity-0" : "") }),
                  /* @__PURE__ */ jsx("span", { className: cn("absolute left-0 top-[12px] h-[1.5px] w-full rounded-full bg-current transition-all duration-200", menuOpen ? "top-[6px] -rotate-45" : "") })
                ] })
              }
            )
          ]
        }
      ),
      menuOpen && /* @__PURE__ */ jsx("div", { className: "mt-2 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.10)] supports-[backdrop-filter]:backdrop-blur-md md:hidden", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        navLinks.map((link) => {
          const isActive = link.href === "/" ? url === "/" : url.startsWith(link.href);
          return /* @__PURE__ */ jsxs(
            Link,
            {
              href: link.href,
              className: cn(
                "flex items-center justify-between rounded-lg px-4 py-3 text-[14px] font-medium transition-colors",
                isActive ? "bg-teal-50 text-teal-700 border border-teal-100/80" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              ),
              children: [
                link.label,
                isActive && /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-teal-500" })
              ]
            },
            link.href
          );
        }),
        /* @__PURE__ */ jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsx(
          Link,
          {
            href: "/contact",
            className: "flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-teal-700",
            children: "Me contacter"
          }
        ) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("main", { children }),
    /* @__PURE__ */ jsx("footer", { className: "bg-[#1a1916]", children: /* @__PURE__ */ jsxs("div", { className: "container-main pt-14 pb-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row items-start justify-between gap-10 pb-10 border-b border-white/[0.07]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 max-w-[280px]", children: [
          /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsx(LogoMark, { size: 26 }),
            /* @__PURE__ */ jsxs("span", { className: "font-display text-[14px] font-bold tracking-tight text-white/80", children: [
              "mr",
              /* @__PURE__ */ jsx("span", { className: "text-teal-400", children: "sergio" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono font-normal text-[10px] text-white/20 ml-px", children: ".dev" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[13px] text-white/25 leading-relaxed", children: "Développeur Full Stack. Je construis des produits web performants et soignés." }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: socials.map((s) => /* @__PURE__ */ jsx(
            "a",
            {
              href: s.href,
              target: s.href.startsWith("mailto") ? void 0 : "_blank",
              rel: "noreferrer",
              "aria-label": s.label,
              className: "flex h-9 w-9 items-center justify-center rounded-xl text-white/25 bg-white/[0.05] border border-white/[0.07] hover:text-white/60 hover:bg-white/[0.08] transition-all duration-200",
              children: s.icon
            },
            s.label
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-12 sm:gap-16", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20", children: "Navigation" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-2.5", children: footerLinks.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                href: link.href,
                className: "text-[13px] text-white/35 hover:text-white/70 transition-colors duration-200",
                children: link.label
              }
            ) }, link.href)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20", children: "Contact" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-2.5", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              "a",
              {
                href: "mailto:contact@mrsergio.dev",
                className: "text-[13px] font-mono text-white/35 hover:text-teal-400 transition-colors duration-200",
                children: "contact@mrsergio.dev"
              }
            ) }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-3 pt-8", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-white/15", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Sergio Junior Chebeu — Tous droits réservés."
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-white/15", children: [
          "Hébergé chez",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://www.kennhosting.com",
              target: "_blank",
              rel: "noreferrer",
              className: "hover:text-white/40 transition-colors duration-200",
              children: "KennHosting"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  MainLayout as M
};
