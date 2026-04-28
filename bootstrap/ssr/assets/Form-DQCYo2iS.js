import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { F as Field, e as errorInputCls, i as inputCls, M as MarkdownEditor, T as TagInput, I as ImageUpload } from "./shared-Cru1ch58.js";
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
const categories = ["Laravel", "Flutter", "Python", "Java", "React", "Vue", "Node.js", "Autre"];
const levels = ["débutant", "intermédiaire", "avancé"];
function FormationForm({ formation }) {
  const isEdit = !!formation;
  const [values, setValues] = useState({
    title: formation?.title ?? "",
    excerpt: formation?.excerpt ?? "",
    content: formation?.content ?? "",
    category: formation?.category ?? "Laravel",
    tags: formation?.tags ?? [],
    level: formation?.level ?? "débutant",
    language: formation?.language ?? "Français",
    duration_hours: formation?.duration_hours ?? 10,
    lessons_count: formation?.lessons_count ?? 20,
    is_free: formation?.is_free ?? false,
    price: formation?.price?.toString() ?? "",
    featured: formation?.featured ?? false,
    published: formation?.published ?? false,
    sort_order: formation?.sort_order ?? 0
  });
  const [coverImage, setCoverImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  function set(key, value) {
    setValues((v) => ({ ...v, [key]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    setProcessing(true);
    const formData = new FormData();
    if (isEdit) formData.append("_method", "PUT");
    formData.append("title", values.title);
    formData.append("excerpt", values.excerpt);
    formData.append("content", values.content);
    formData.append("category", values.category);
    formData.append("level", values.level);
    formData.append("language", values.language);
    formData.append("duration_hours", String(values.duration_hours));
    formData.append("lessons_count", String(values.lessons_count));
    formData.append("is_free", values.is_free ? "1" : "0");
    formData.append("featured", values.featured ? "1" : "0");
    formData.append("published", values.published ? "1" : "0");
    formData.append("sort_order", String(values.sort_order));
    if (!values.is_free && values.price) formData.append("price", values.price);
    values.tags.forEach((tag) => formData.append("tags[]", tag));
    if (coverImage) formData.append("cover_image", coverImage);
    const url = isEdit ? `/admin/formations/${formation.id}` : "/admin/formations";
    router.post(url, formData, {
      onError: (e2) => {
        setErrors(e2);
        setProcessing(false);
      },
      onFinish: () => setProcessing(false)
    });
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: isEdit ? "Modifier la formation" : "Nouvelle formation", children: [
    /* @__PURE__ */ jsx(Head, { title: `${isEdit ? "Modifier" : "Créer"} une formation — Admin` }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsx(Link, { href: "/admin/formations", className: "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19l-7-7 7-7" }) }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-bold text-slate-800", children: isEdit ? "Modifier la formation" : "Nouvelle formation" }),
        isEdit && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 mt-0.5", children: [
          "ID #",
          formation.id
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            className: "bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-5",
            children: [
              /* @__PURE__ */ jsx(Field, { label: "Titre", required: true, error: errors.title, children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: values.title,
                  onChange: (e) => set("title", e.target.value),
                  placeholder: "Titre de la formation",
                  className: cn(inputCls, errors.title && errorInputCls)
                }
              ) }),
              /* @__PURE__ */ jsx(Field, { label: "Description courte", required: true, error: errors.excerpt, children: /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: values.excerpt,
                  onChange: (e) => set("excerpt", e.target.value),
                  placeholder: "Résumé de la formation...",
                  rows: 3,
                  className: cn(inputCls, "resize-none", errors.excerpt && errorInputCls)
                }
              ) }),
              /* @__PURE__ */ jsx(Field, { label: "Programme (Markdown)", error: errors.content, children: /* @__PURE__ */ jsx(MarkdownEditor, { value: values.content, onChange: (v) => set("content", v), error: errors.content }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.05 },
            className: "bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-slate-700", children: "Détails pédagogiques" }),
              /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsx(Field, { label: "Catégorie", required: true, error: errors.category, children: /* @__PURE__ */ jsx("select", { value: values.category, onChange: (e) => set("category", e.target.value), className: cn(inputCls, errors.category && errorInputCls), children: categories.map((c) => /* @__PURE__ */ jsx("option", { children: c }, c)) }) }),
                /* @__PURE__ */ jsx(Field, { label: "Niveau", required: true, error: errors.level, children: /* @__PURE__ */ jsx("select", { value: values.level, onChange: (e) => set("level", e.target.value), className: cn(inputCls, errors.level && errorInputCls), children: levels.map((l) => /* @__PURE__ */ jsx("option", { children: l }, l)) }) }),
                /* @__PURE__ */ jsx(Field, { label: "Langue", error: errors.language, children: /* @__PURE__ */ jsx("input", { type: "text", value: values.language, onChange: (e) => set("language", e.target.value), placeholder: "Français", className: inputCls }) }),
                /* @__PURE__ */ jsx(Field, { label: "Durée (heures)", required: true, error: errors.duration_hours, children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: values.duration_hours,
                    onChange: (e) => set("duration_hours", parseInt(e.target.value) || 1),
                    min: 1,
                    className: cn(inputCls, errors.duration_hours && errorInputCls)
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Nombre de leçons", required: true, error: errors.lessons_count, children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: values.lessons_count,
                    onChange: (e) => set("lessons_count", parseInt(e.target.value) || 1),
                    min: 1,
                    className: cn(inputCls, errors.lessons_count && errorInputCls)
                  }
                ) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.08 },
            className: "bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-slate-700 mb-3", children: "Tags" }),
              /* @__PURE__ */ jsx(TagInput, { tags: values.tags, onChange: (v) => set("tags", v) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.04 },
            className: "bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-slate-700", children: "Prix" }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between cursor-pointer", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: "Formation gratuite" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => set("is_free", !values.is_free),
                    className: cn("relative w-10 h-5 rounded-full transition-colors duration-200", values.is_free ? "bg-teal-500" : "bg-slate-300"),
                    children: /* @__PURE__ */ jsx("span", { className: cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200", values.is_free ? "translate-x-5" : "translate-x-0.5") })
                  }
                )
              ] }),
              !values.is_free && /* @__PURE__ */ jsx(Field, { label: "Prix (€)", error: errors.price, children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: values.price,
                  onChange: (e) => set("price", e.target.value),
                  placeholder: "29.99",
                  min: 0,
                  step: 0.01,
                  className: cn(inputCls, errors.price && errorInputCls)
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.06 },
            className: "bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-slate-700", children: "Publication" }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between cursor-pointer", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: "Publiée" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => set("published", !values.published),
                    className: cn("relative w-10 h-5 rounded-full transition-colors duration-200", values.published ? "bg-teal-500" : "bg-slate-300"),
                    children: /* @__PURE__ */ jsx("span", { className: cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200", values.published ? "translate-x-5" : "translate-x-0.5") })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between cursor-pointer", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: "Mise en avant" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => set("featured", !values.featured),
                    className: cn("relative w-10 h-5 rounded-full transition-colors duration-200", values.featured ? "bg-amber-500" : "bg-slate-300"),
                    children: /* @__PURE__ */ jsx("span", { className: cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200", values.featured ? "translate-x-5" : "translate-x-0.5") })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(Field, { label: "Ordre d'affichage", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: values.sort_order,
                  onChange: (e) => set("sort_order", parseInt(e.target.value) || 0),
                  className: cn(inputCls, "w-24"),
                  min: 0
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.1 },
            className: "bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5",
            children: [
              /* @__PURE__ */ jsx(
                ImageUpload,
                {
                  label: "Image de couverture",
                  value: coverImage,
                  onChange: setCoverImage,
                  currentUrl: formation?.cover_image ? `/storage/${formation.cover_image}` : null
                }
              ),
              errors.cover_image && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.cover_image })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: cn("w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 text-white text-sm font-semibold shadow-sm shadow-teal-500/20 transition-all duration-200", processing ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"),
              children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                  /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
                ] }),
                " Enregistrement..."
              ] }) : isEdit ? "Mettre à jour" : "Créer la formation"
            }
          ),
          /* @__PURE__ */ jsx(Link, { href: "/admin/formations", className: "w-full flex items-center justify-center py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors", children: "Annuler" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  FormationForm as default
};
