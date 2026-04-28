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
const Ico = {
  Back: () => /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M9 2L4 7l5 5", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  Save: () => /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("path", { d: "M2 2h8l2 2v8a1 1 0 01-1 1H3a1 1 0 01-1-1V2z", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M4 2v4h6V2M4 10v2M10 10v2", strokeLinecap: "round" })
  ] }),
  Spinner: () => /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", className: "animate-spin", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "5.5", stroke: "currentColor", strokeOpacity: "0.2", strokeWidth: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M7 1.5A5.5 5.5 0 0112.5 7", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
  ] })
};
function Toggle({
  checked,
  onChange,
  label,
  accent = "teal"
}) {
  return /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between py-1 cursor-pointer group", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[13px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors", children: label }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onChange,
        "aria-label": label,
        className: cn(
          "relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
          checked ? accent === "teal" ? "bg-teal-500" : "bg-amber-500" : "bg-slate-200"
        ),
        children: /* @__PURE__ */ jsx("span", { className: cn(
          "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0.5"
        ) })
      }
    )
  ] });
}
function SectionCard({
  children,
  delay = 0,
  className
}) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, ease: [0, 0, 0.2, 1], delay },
      className: cn(
        "bg-white border border-slate-200/70 rounded-2xl",
        className
      ),
      children
    }
  );
}
function BlogForm({ post }) {
  const isEdit = !!post;
  const [values, setValues] = useState({
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    tags: post?.tags ?? [],
    featured: post?.featured ?? false,
    published: post?.published ?? false,
    published_at: post?.published_at ? post.published_at.slice(0, 10) : ""
  });
  const [coverImage, setCoverImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  function set(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    const fd = new FormData();
    if (isEdit) fd.append("_method", "PUT");
    fd.append("title", values.title);
    fd.append("excerpt", values.excerpt);
    fd.append("content", values.content);
    fd.append("featured", values.featured ? "1" : "0");
    fd.append("published", values.published ? "1" : "0");
    if (values.published_at) fd.append("published_at", values.published_at);
    values.tags.forEach((t) => fd.append("tags[]", t));
    if (coverImage) fd.append("cover_image", coverImage);
    router.post(
      isEdit ? `/admin/blog/${post.id}` : "/admin/blog",
      fd,
      {
        onError: (e2) => {
          setErrors(e2);
          setProcessing(false);
        },
        onFinish: () => setProcessing(false)
      }
    );
  }
  const pageTitle = isEdit ? "Modifier l'article" : "Nouvel article";
  return /* @__PURE__ */ jsxs(
    AdminLayout,
    {
      title: pageTitle,
      breadcrumb: [
        { label: "Blog", href: "/admin/blog" },
        { label: isEdit ? "Modifier" : "Nouvel article" }
      ],
      children: [
        /* @__PURE__ */ jsx(Head, { title: `${isEdit ? "Modifier" : "Créer"} un article — Admin` }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/admin/blog",
              className: "w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150",
              title: "Retour",
              children: /* @__PURE__ */ jsx(Ico.Back, {})
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-[20px] font-bold text-slate-900 tracking-tight", children: pageTitle }),
            isEdit && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-400 mt-0.5", children: [
              "ID #",
              post.id
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, noValidate: true, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
            /* @__PURE__ */ jsxs(SectionCard, { delay: 0.02, className: "p-5 space-y-5", children: [
              /* @__PURE__ */ jsx(Field, { label: "Titre", required: true, error: errors.title, children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: values.title,
                  onChange: (e) => set("title", e.target.value),
                  placeholder: "Titre de l'article",
                  autoFocus: true,
                  className: cn(inputCls, errors.title && errorInputCls)
                }
              ) }),
              /* @__PURE__ */ jsxs(Field, { label: "Extrait", required: true, error: errors.excerpt, children: [
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: values.excerpt,
                    onChange: (e) => set("excerpt", e.target.value),
                    placeholder: "Résumé court affiché dans la liste des articles…",
                    rows: 3,
                    className: cn(inputCls, "resize-none", errors.excerpt && errorInputCls)
                  }
                ),
                /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-400 mt-1", children: [
                  values.excerpt.length,
                  " / 200 caractères recommandés"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(SectionCard, { delay: 0.05, className: "p-5", children: /* @__PURE__ */ jsx(Field, { label: "Contenu", error: errors.content, children: /* @__PURE__ */ jsx(
              MarkdownEditor,
              {
                value: values.content,
                onChange: (v) => set("content", v),
                error: errors.content
              }
            ) }) }),
            /* @__PURE__ */ jsxs(SectionCard, { delay: 0.08, className: "p-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[13px] font-semibold text-slate-800", children: "Tags" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-400", children: [
                  values.tags.length,
                  " tag",
                  values.tags.length > 1 ? "s" : ""
                ] })
              ] }),
              /* @__PURE__ */ jsx(TagInput, { tags: values.tags, onChange: (v) => set("tags", v) }),
              errors.tags && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-500 mt-1", children: errors.tags })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs(SectionCard, { delay: 0.03, className: "p-5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-slate-400 uppercase tracking-[0.14em] mb-4", children: "Publication" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(
                  Toggle,
                  {
                    checked: values.published,
                    onChange: () => set("published", !values.published),
                    label: "Publier",
                    accent: "teal"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Toggle,
                  {
                    checked: values.featured,
                    onChange: () => set("featured", !values.featured),
                    label: "Mettre en avant",
                    accent: "amber"
                  }
                )
              ] }),
              values.published && /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  exit: { opacity: 0, height: 0 },
                  transition: { duration: 0.2 },
                  className: "mt-4 pt-4 border-t border-slate-100",
                  children: /* @__PURE__ */ jsx(Field, { label: "Date de publication", error: errors.published_at, children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "date",
                      value: values.published_at,
                      onChange: (e) => set("published_at", e.target.value),
                      className: cn(inputCls, errors.published_at && errorInputCls)
                    }
                  ) })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(SectionCard, { delay: 0.06, className: "p-5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-slate-400 uppercase tracking-[0.14em] mb-4", children: "Couverture" }),
              /* @__PURE__ */ jsx(
                ImageUpload,
                {
                  label: "Image de couverture",
                  value: coverImage,
                  onChange: setCoverImage,
                  currentUrl: post?.cover_image ? `/storage/${post.cover_image}` : null
                }
              ),
              errors.cover_image && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-500 mt-2", children: errors.cover_image })
            ] }),
            /* @__PURE__ */ jsxs(SectionCard, { delay: 0.08, className: "p-4 flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: processing,
                  className: cn(
                    "w-full flex items-center justify-center gap-2",
                    "py-2.5 rounded-xl text-[13px] font-semibold text-white",
                    "bg-teal-600",
                    "shadow-[0_1px_3px_rgba(29,158,117,0.3)]",
                    "transition-all duration-200",
                    processing ? "opacity-60 cursor-not-allowed" : "hover:bg-teal-700 hover:shadow-[0_4px_12px_rgba(29,158,117,0.35)]"
                  ),
                  children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Ico.Spinner, {}),
                    " Enregistrement…"
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Ico.Save, {}),
                    " ",
                    isEdit ? "Mettre à jour" : "Publier l'article"
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/admin/blog",
                  className: cn(
                    "w-full flex items-center justify-center",
                    "py-2.5 rounded-xl text-[13px] font-medium text-slate-600",
                    "border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
                    "transition-all duration-150"
                  ),
                  children: "Annuler"
                }
              )
            ] }),
            isEdit && /* @__PURE__ */ jsxs(SectionCard, { delay: 0.1, className: "p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-slate-400 uppercase tracking-[0.14em] mb-3", children: "Statut actuel" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  post.published ? "bg-teal-500" : "bg-slate-300"
                ) }),
                /* @__PURE__ */ jsx("span", { className: cn(
                  "text-[12px] font-medium",
                  post.published ? "text-teal-700" : "text-slate-500"
                ), children: post.published ? "Publié" : "Brouillon" }),
                post.published && post.published_at && /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-400 ml-auto", children: new Date(post.published_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }) })
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  BlogForm as default
};
