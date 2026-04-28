import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { F as Field, e as errorInputCls, i as inputCls, M as MarkdownEditor, T as TagInput, I as ImageUpload, a as MultiImageUpload } from "./shared-Cru1ch58.js";
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
const platformSuggestions = {
  web: ["Web"],
  mobile: ["Android", "iOS"],
  desktop: ["Windows", "macOS", "Linux"],
  api: ["API"]
};
function ProjectForm({ project }) {
  const isEdit = !!project;
  const [values, setValues] = useState({
    title: project?.title ?? "",
    project_type: project?.project_type ?? "web",
    description: project?.description ?? "",
    content: project?.content ?? "",
    demo_url: project?.demo_url ?? "",
    github_url: project?.github_url ?? "",
    private_repo: project?.private_repo ?? false,
    platforms: project?.platforms ?? [],
    tags: project?.tags ?? [],
    featured: project?.featured ?? false,
    published: project?.published ?? false,
    sort_order: project?.sort_order ?? 0,
    store_links: {
      play_store: project?.store_links?.play_store ?? "",
      app_store: project?.store_links?.app_store ?? "",
      windows: project?.store_links?.windows ?? "",
      macos: project?.store_links?.macos ?? "",
      linux: project?.store_links?.linux ?? "",
      docs: project?.store_links?.docs ?? "",
      postman: project?.store_links?.postman ?? "",
      base_url: project?.store_links?.base_url ?? ""
    }
  });
  const [image, setImage] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  function set(key, value) {
    setValues((v) => ({ ...v, [key]: value }));
  }
  function setStoreLink(key, value) {
    setValues((v) => ({
      ...v,
      store_links: {
        ...v.store_links,
        [key]: value
      }
    }));
  }
  function togglePlatform(item) {
    const active = values.platforms.includes(item);
    set(
      "platforms",
      active ? values.platforms.filter((p) => p !== item) : [...values.platforms, item]
    );
  }
  function handleSubmit(e) {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    const formData = new FormData();
    if (isEdit) formData.append("_method", "PUT");
    formData.append("title", values.title);
    formData.append("project_type", values.project_type);
    formData.append("description", values.description);
    formData.append("content", values.content);
    formData.append("demo_url", values.demo_url);
    formData.append("github_url", values.github_url);
    formData.append("private_repo", values.private_repo ? "1" : "0");
    formData.append("featured", values.featured ? "1" : "0");
    formData.append("published", values.published ? "1" : "0");
    formData.append("sort_order", String(values.sort_order));
    values.tags.forEach((tag) => formData.append("tags[]", tag));
    values.platforms.forEach((platform) => formData.append("platforms[]", platform));
    formData.append("store_links[play_store]", values.store_links.play_store);
    formData.append("store_links[app_store]", values.store_links.app_store);
    formData.append("store_links[windows]", values.store_links.windows);
    formData.append("store_links[macos]", values.store_links.macos);
    formData.append("store_links[linux]", values.store_links.linux);
    formData.append("store_links[docs]", values.store_links.docs);
    formData.append("store_links[postman]", values.store_links.postman);
    formData.append("store_links[base_url]", values.store_links.base_url);
    screenshots.forEach((file) => formData.append("screenshots[]", file));
    if (image) formData.append("image", image);
    const url = isEdit ? `/admin/projects/${project.id}` : "/admin/projects";
    router.post(url, formData, {
      forceFormData: true,
      onError: (e2) => {
        setErrors(e2);
        setProcessing(false);
      },
      onFinish: () => setProcessing(false)
    });
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: isEdit ? "Modifier le projet" : "Nouveau projet", children: [
    /* @__PURE__ */ jsx(Head, { title: `${isEdit ? "Modifier" : "Créer"} un projet — Admin` }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/admin/projects",
          className: "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19l-7-7 7-7" }) })
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-slate-800", children: isEdit ? "Modifier le projet" : "Nouveau projet" }),
        isEdit && /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-slate-400", children: [
          "ID #",
          project.id
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            className: "space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm",
            children: [
              /* @__PURE__ */ jsx(Field, { label: "Titre", required: true, error: errors.title, children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: values.title,
                  onChange: (e) => set("title", e.target.value),
                  placeholder: "Nom du projet",
                  className: cn(inputCls, errors.title && errorInputCls)
                }
              ) }),
              /* @__PURE__ */ jsx(Field, { label: "Type de projet", required: true, error: errors.project_type, children: /* @__PURE__ */ jsxs(
                "select",
                {
                  value: values.project_type,
                  onChange: (e) => set("project_type", e.target.value),
                  className: cn(inputCls, errors.project_type && errorInputCls),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "web", children: "Web" }),
                    /* @__PURE__ */ jsx("option", { value: "mobile", children: "Mobile" }),
                    /* @__PURE__ */ jsx("option", { value: "desktop", children: "Desktop" }),
                    /* @__PURE__ */ jsx("option", { value: "api", children: "API" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx(Field, { label: "Description courte", required: true, error: errors.description, children: /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: values.description,
                  onChange: (e) => set("description", e.target.value),
                  placeholder: "Résumé du projet en 1-2 phrases...",
                  rows: 3,
                  className: cn(inputCls, "resize-none", errors.description && errorInputCls)
                }
              ) }),
              /* @__PURE__ */ jsx(Field, { label: "Contenu (Markdown)", error: errors.content, children: /* @__PURE__ */ jsx(
                MarkdownEditor,
                {
                  value: values.content,
                  onChange: (v) => set("content", v),
                  error: errors.content
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
            transition: { delay: 0.05 },
            className: "space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-slate-700", children: "Liens principaux" }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsx(Field, { label: "URL démo", error: errors.demo_url, children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: values.demo_url,
                    onChange: (e) => set("demo_url", e.target.value),
                    placeholder: "https://demo.exemple.com",
                    className: cn(inputCls, errors.demo_url && errorInputCls)
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "URL GitHub", error: errors.github_url, children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: values.github_url,
                    onChange: (e) => set("github_url", e.target.value),
                    placeholder: "https://github.com/...",
                    className: cn(inputCls, errors.github_url && errorInputCls)
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm font-semibold text-slate-700", children: "Plateformes" }),
                /* @__PURE__ */ jsx("div", { className: "mb-3 flex flex-wrap gap-2", children: platformSuggestions[values.project_type].map((item) => {
                  const active = values.platforms.includes(item);
                  return /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => togglePlatform(item),
                      className: cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        active ? "border-teal-600 bg-teal-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-600"
                      ),
                      children: item
                    },
                    item
                  );
                }) }),
                /* @__PURE__ */ jsx(TagInput, { tags: values.platforms, onChange: (v) => set("platforms", v) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.06 },
            className: "space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-slate-700", children: "Liens spécifiques au type" }),
              values.project_type === "web" && /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Pour un projet web, le lien principal peut rester dans “URL démo”." }),
              values.project_type === "mobile" && /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsx(Field, { label: "Lien Play Store", error: errors["store_links.play_store"], children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: values.store_links.play_store,
                    onChange: (e) => setStoreLink("play_store", e.target.value),
                    placeholder: "https://play.google.com/...",
                    className: cn(inputCls, errors["store_links.play_store"] && errorInputCls)
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Lien App Store", error: errors["store_links.app_store"], children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: values.store_links.app_store,
                    onChange: (e) => setStoreLink("app_store", e.target.value),
                    placeholder: "https://apps.apple.com/...",
                    className: cn(inputCls, errors["store_links.app_store"] && errorInputCls)
                  }
                ) })
              ] }),
              values.project_type === "desktop" && /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
                /* @__PURE__ */ jsx(Field, { label: "Téléchargement Windows", error: errors["store_links.windows"], children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: values.store_links.windows,
                    onChange: (e) => setStoreLink("windows", e.target.value),
                    placeholder: "https://...",
                    className: cn(inputCls, errors["store_links.windows"] && errorInputCls)
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Téléchargement macOS", error: errors["store_links.macos"], children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: values.store_links.macos,
                    onChange: (e) => setStoreLink("macos", e.target.value),
                    placeholder: "https://...",
                    className: cn(inputCls, errors["store_links.macos"] && errorInputCls)
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Téléchargement Linux", error: errors["store_links.linux"], children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: values.store_links.linux,
                    onChange: (e) => setStoreLink("linux", e.target.value),
                    placeholder: "https://...",
                    className: cn(inputCls, errors["store_links.linux"] && errorInputCls)
                  }
                ) })
              ] }),
              values.project_type === "api" && /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
                /* @__PURE__ */ jsx(Field, { label: "Documentation", error: errors["store_links.docs"], children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: values.store_links.docs,
                    onChange: (e) => setStoreLink("docs", e.target.value),
                    placeholder: "https://docs...",
                    className: cn(inputCls, errors["store_links.docs"] && errorInputCls)
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Postman", error: errors["store_links.postman"], children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: values.store_links.postman,
                    onChange: (e) => setStoreLink("postman", e.target.value),
                    placeholder: "https://postman...",
                    className: cn(inputCls, errors["store_links.postman"] && errorInputCls)
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Base URL API", error: errors["store_links.base_url"], children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: values.store_links.base_url,
                    onChange: (e) => setStoreLink("base_url", e.target.value),
                    placeholder: "https://api.exemple.com",
                    className: cn(inputCls, errors["store_links.base_url"] && errorInputCls)
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
            className: "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "mb-3 text-sm font-semibold text-slate-700", children: "Tags" }),
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
            transition: { delay: 0.06 },
            className: "space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-slate-700", children: "Publication" }),
              /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: "Publié" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => set("published", !values.published),
                    className: cn(
                      "relative h-5 w-10 rounded-full transition-colors duration-200",
                      values.published ? "bg-teal-500" : "bg-slate-300"
                    ),
                    children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                          values.published ? "translate-x-5" : "translate-x-0.5"
                        )
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: "Mis en avant" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => set("featured", !values.featured),
                    className: cn(
                      "relative h-5 w-10 rounded-full transition-colors duration-200",
                      values.featured ? "bg-amber-500" : "bg-slate-300"
                    ),
                    children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                          values.featured ? "translate-x-5" : "translate-x-0.5"
                        )
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(Field, { label: "Ordre d'affichage", error: errors.sort_order, children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: values.sort_order,
                  onChange: (e) => set("sort_order", parseInt(e.target.value) || 0),
                  className: cn(inputCls, "w-24", errors.sort_order && errorInputCls),
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
            className: "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm",
            children: [
              /* @__PURE__ */ jsx(
                ImageUpload,
                {
                  label: "Image principale du projet",
                  value: image,
                  onChange: setImage,
                  currentUrl: project?.image ? `/storage/${project.image}` : null
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
                MultiImageUpload,
                {
                  values: screenshots,
                  onChange: setScreenshots,
                  currentUrls: project?.screenshots ? project.screenshots.map((s) => `/storage/${s}`) : []
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: "Repo privé (masquer le bouton GitHub)" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => set("private_repo", !values.private_repo),
                    className: cn(
                      "relative h-5 w-10 rounded-full transition-colors duration-200",
                      values.private_repo ? "bg-slate-700" : "bg-slate-300"
                    ),
                    children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                          values.private_repo ? "translate-x-5" : "translate-x-0.5"
                        )
                      }
                    )
                  }
                )
              ] }) }),
              errors.image && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.image }),
              errors.screenshots && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.screenshots })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: cn(
                "flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-500/20 transition-all duration-200",
                processing ? "cursor-not-allowed opacity-70" : "hover:bg-teal-700"
              ),
              children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("svg", { className: "h-4 w-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                  /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
                ] }),
                "Enregistrement..."
              ] }) : isEdit ? "Mettre à jour" : "Créer le projet"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/admin/projects",
              className: "flex w-full items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50",
              children: "Annuler"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ProjectForm as default
};
