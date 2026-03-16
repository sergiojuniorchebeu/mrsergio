
import { Link, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
}

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/projects", label: "Projets" },
  { href: "/blog", label: "Blog" },
  { href: "/formations", label: "Formations" },
];

const footerSocials = [
  {
    label: "GitHub",
    href: "https://github.com/sergiojuniorchebeu",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/sergiojuniorchebeu",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:contact@mrsergio.dev",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const footerLinks = [
  { href: "/projects", label: "Projets" },
  { href: "/blog", label: "Blog" },
  { href: "/formations", label: "Formations" },
  { href: "/contact", label: "Contact" },
];

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="mrsergio.dev">
      <polygon points="32,3 58,17 58,47 32,61 6,47 6,17" fill="#1D9E75" fillOpacity="0.13" />
      <polygon points="32,3 58,17 58,47 32,61 6,47 6,17" fill="none" stroke="#1D9E75" strokeWidth="1.5" />
      <path
        d="M20 24Q20 18 26 18L38 18Q44 18 44 24Q44 30 32 34Q20 38 20 44Q20 50 26 50L38 50Q44 50 44 44"
        stroke="#1D9E75"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="54" cy="17" r="5" fill="#1D9E75" />
    </svg>
  );
}

export default function MainLayout({ children }: Props) {
  const { url } = usePage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 16);
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

  const headerClass = useMemo(
    () =>
      cn(
        "relative flex items-center justify-between rounded-2xl border transition-all duration-300",
        "bg-white/90 supports-[backdrop-filter]:bg-white/70",
        "supports-[backdrop-filter]:backdrop-blur-md",
        "border-slate-200/70",
        scrolled
          ? "h-[56px] max-w-5xl px-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          : "h-[60px] max-w-6xl px-5 shadow-[0_6px_18px_rgba(15,23,42,0.06)]"
      ),
    [scrolled]
  );

  return (
    <div className="min-h-screen bg-surface">
      <div className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
        <div className="mx-auto w-full max-w-6xl">
          <header className={headerClass}>
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <LogoMark size={scrolled ? 28 : 32} />
              <div className="flex flex-col leading-none gap-[1px]">
                <span className="font-display text-[14px] font-bold tracking-tight text-slate-900">
                  mr<span className="text-teal-600">sergio</span>
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-slate-400">.dev</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = url === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-xl px-4 py-2 text-[13px] font-medium transition-colors",
                      isActive
                        ? "bg-teal-50 text-teal-700 border border-teal-100"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xl bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-teal-700"
              >
                Me contacter
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Fermer" : "Menu"}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              <div className="relative h-4 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 block h-[2px] w-5 rounded-full bg-current transition-all duration-200",
                    menuOpen && "top-[7px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[7px] block h-[2px] w-5 rounded-full bg-current transition-all duration-200",
                    menuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[14px] block h-[2px] w-5 rounded-full bg-current transition-all duration-200",
                    menuOpen && "top-[7px] -rotate-45"
                  )}
                />
              </div>
            </button>
          </header>

          {menuOpen && (
            <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.10)] md:hidden">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = url === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-teal-50 text-teal-700 border border-teal-100"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      {link.label}
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />}
                    </Link>
                  );
                })}

                <div className="pt-1">
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    Me contacter
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-[76px]" />

      <main>{children}</main>

      <footer className="relative overflow-hidden bg-[#0F1A17]">
        <div className="container-main relative z-10 pt-16 pb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 pb-10 border-b border-white/[0.06]">
            <div className="flex flex-col items-start gap-4 max-w-xs">
              <Link href="/" className="flex items-center gap-2.5 group">
                <LogoMark size={30} />
                <div className="flex flex-col leading-none gap-[1px]">
                  <span className="font-bold text-[14px] text-white/90 tracking-tight font-display">
                    mr<span className="text-teal-400">sergio</span>
                  </span>
                  <span className="text-[9px] font-mono text-white/25 tracking-[0.2em]">.dev</span>
                </div>
              </Link>
              <p className="text-[13px] text-white/30 leading-relaxed">
                Développeur Full Stack passionné. Je crée des expériences web performantes et soignées.
              </p>
            </div>

            <div className="flex gap-16">
              <div>
                <p className="text-[10px] font-semibold text-teal-400/60 uppercase tracking-[0.2em] mb-4">Navigation</p>
                <ul className="space-y-2.5">
                  {footerLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[13px] text-white/40 hover:text-teal-400 transition-colors duration-200 font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-teal-400/60 uppercase tracking-[0.2em] mb-4">Contact</p>
                <ul className="space-y-2.5">
                  <li>
                    <a href="mailto:contact@mrsergio.dev" className="text-[13px] text-white/40 hover:text-teal-400 transition-colors duration-200 font-medium font-mono">
                      contact@mrsergio.dev
                    </a>
                  </li>
                  <li className="flex items-center gap-2 pt-2">
                    {footerSocials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target={social.href.startsWith("mailto") ? undefined : "_blank"}
                        rel="noreferrer"
                        aria-label={social.label}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-white/30 hover:text-teal-400 bg-white/[0.04] border border-white/[0.06] hover:border-teal-500/20 hover:bg-teal-500/[0.06] transition-all duration-200"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
            <p className="text-[11px] text-white/15 font-medium">
              © {new Date().getFullYear()} Sergio Junior Chebeu — Tous droits réservés.
            </p>
            <span className="text-[11px] text-white/20 font-medium">
              Host by <a href="https://www.kennhosting.com" target="_blank" rel="noreferrer" className="underline hover:text-teal-400 transition-colors duration-200">KennHosting</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}