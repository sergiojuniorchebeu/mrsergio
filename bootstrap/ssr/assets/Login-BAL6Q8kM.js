import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { c as cn } from "./utils-DsUdfzPs.js";
import "clsx";
import "tailwind-merge";
function Login({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false
  });
  function handleSubmit(e) {
    e.preventDefault();
    post("/login");
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Connexion — Admin" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" }) }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          className: "relative w-full max-w-md",
          children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-8 pt-8 pb-6 border-b border-slate-100 text-center", children: [
              /* @__PURE__ */ jsxs(Link, { href: "/", className: "inline-flex items-center gap-2 mb-6", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm shadow-teal-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold font-display", children: "S" }) }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800 font-display", children: "mrsergio" })
              ] }),
              /* @__PURE__ */ jsx("h1", { className: "text-xl font-display font-bold text-slate-800", children: "Connexion admin" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Accès réservé aux administrateurs" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-8 py-6", children: [
              status && /* @__PURE__ */ jsx("div", { className: "mb-4 p-3 rounded-lg bg-teal-50 border border-teal-200 text-sm text-teal-700", children: status }),
              /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700", children: "Adresse email" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      value: data.email,
                      onChange: (e) => setData("email", e.target.value),
                      placeholder: "admin@mrsergio.dev",
                      autoComplete: "email",
                      autoFocus: true,
                      className: cn(
                        "w-full px-4 py-3 rounded-xl text-sm bg-slate-50 border outline-none transition-all duration-200",
                        "placeholder:text-slate-400 text-slate-800",
                        "focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/15",
                        errors.email ? "border-red-300" : "border-slate-200"
                      )
                    }
                  ),
                  errors.email && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.email })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700", children: "Mot de passe" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "password",
                      value: data.password,
                      onChange: (e) => setData("password", e.target.value),
                      placeholder: "••••••••",
                      autoComplete: "current-password",
                      className: cn(
                        "w-full px-4 py-3 rounded-xl text-sm bg-slate-50 border outline-none transition-all duration-200",
                        "placeholder:text-slate-400 text-slate-800",
                        "focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/15",
                        errors.password ? "border-red-300" : "border-slate-200"
                      )
                    }
                  ),
                  errors.password && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.password })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2.5 cursor-pointer", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: data.remember,
                      onChange: (e) => setData("remember", e.target.checked),
                      className: "w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-600", children: "Se souvenir de moi" })
                ] }),
                /* @__PURE__ */ jsx(
                  motion.button,
                  {
                    type: "submit",
                    disabled: processing,
                    whileHover: !processing ? { scale: 1.01 } : {},
                    whileTap: !processing ? { scale: 0.98 } : {},
                    className: cn(
                      "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl",
                      "bg-teal-600 text-white text-sm font-semibold",
                      "shadow-sm shadow-teal-500/20 transition-all duration-200",
                      processing ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"
                    ),
                    children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [
                        /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                        /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
                      ] }),
                      "Connexion..."
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" }) }),
                      "Se connecter"
                    ] })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "px-8 pb-6 text-center", children: /* @__PURE__ */ jsx(Link, { href: "/", className: "text-xs text-slate-400 hover:text-teal-600 transition-colors", children: "← Retour au site public" }) })
          ] })
        }
      )
    ] })
  ] });
}
export {
  Login as default
};
