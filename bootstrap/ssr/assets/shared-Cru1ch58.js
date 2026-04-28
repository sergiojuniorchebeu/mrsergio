import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { c as cn } from "./utils-DsUdfzPs.js";
function PublishedBadge({ published }) {
  return /* @__PURE__ */ jsxs("span", { className: cn(
    "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
    published ? "bg-teal-50 text-teal-700 border border-teal-100" : "bg-slate-100 text-slate-500 border border-slate-200"
  ), children: [
    /* @__PURE__ */ jsx("span", { className: cn("w-1.5 h-1.5 rounded-full", published ? "bg-teal-500" : "bg-slate-400") }),
    published ? "Publié" : "Brouillon"
  ] });
}
function DeleteModal({
  open,
  onClose,
  onConfirm,
  label
}) {
  return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 8 },
        transition: { duration: 0.2 },
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-red-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-slate-800 text-center mb-1", children: "Confirmer la suppression" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 text-center mb-6", children: [
            "Supprimer ",
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-700", children: [
              "« ",
              label,
              " »"
            ] }),
            " ? Cette action est irréversible."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors",
                children: "Annuler"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onConfirm,
                className: "flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors",
                children: "Supprimer"
              }
            )
          ] })
        ] })
      }
    )
  ] }) });
}
function ImageUpload({
  value,
  onChange,
  currentUrl,
  label = "Image de couverture"
}) {
  const preview = value ? URL.createObjectURL(value) : currentUrl ?? null;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700", children: label }),
    /* @__PURE__ */ jsx("div", { className: cn(
      "relative rounded-xl border-2 border-dashed transition-colors duration-200",
      preview ? "border-slate-200" : "border-slate-300 hover:border-teal-400"
    ), children: preview ? /* @__PURE__ */ jsxs("div", { className: "relative h-40 rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsx("img", { src: preview, alt: "Preview", className: "w-full h-full object-cover" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(null),
          className: "absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors",
          children: /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) })
        }
      ),
      /* @__PURE__ */ jsx("label", { className: "absolute inset-0 cursor-pointer", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          accept: "image/*",
          className: "hidden",
          onChange: (e) => onChange(e.target.files?.[0] ?? null)
        }
      ) })
    ] }) : /* @__PURE__ */ jsxs("label", { className: "flex flex-col items-center justify-center gap-2 p-8 cursor-pointer", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.8, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-teal-600", children: "Choisir" }),
        " ou glisser une image"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: "PNG, JPG, WebP · max 2 Mo" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          accept: "image/*",
          className: "hidden",
          onChange: (e) => onChange(e.target.files?.[0] ?? null)
        }
      )
    ] }) })
  ] });
}
function MultiImageUpload({
  values,
  onChange,
  currentUrls = [],
  label = "Captures d'écran (max 8)"
}) {
  function addFiles(files) {
    if (!files) return;
    const arr = Array.from(files).slice(0, 8 - (values.length + currentUrls.length));
    onChange([...values, ...arr]);
  }
  function removeAt(index) {
    const copy = [...values];
    copy.splice(index, 1);
    onChange(copy);
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-3", children: [
      currentUrls.map((u, i) => /* @__PURE__ */ jsx("div", { className: "relative w-full h-24 rounded-lg overflow-hidden border", children: /* @__PURE__ */ jsx("img", { src: u, alt: `screenshot-${i}`, className: "w-full h-full object-cover" }) }, `cur-${i}`)),
      values.map((f, i) => /* @__PURE__ */ jsxs("div", { className: "relative w-full h-24 rounded-lg overflow-hidden border", children: [
        /* @__PURE__ */ jsx("img", { src: URL.createObjectURL(f), alt: `preview-${i}`, className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeAt(i), className: "absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white", children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }, `new-${i}`)),
      values.length + currentUrls.length < 8 && /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-center h-24 rounded-lg border-dashed border p-2 cursor-pointer text-slate-400", children: [
        /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: (e) => addFiles(e.target.files) }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-slate-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.8, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs", children: "Ajouter" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: "Jusqu\\'à 8 images, PNG/JPG/WebP · max 2 Mo chacune" })
  ] });
}
function Field({
  label,
  required = false,
  error,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-slate-700", children: [
      label,
      " ",
      required && /* @__PURE__ */ jsx("span", { className: "text-teal-600", children: "*" })
    ] }),
    children,
    error && /* @__PURE__ */ jsxs("p", { className: "text-xs text-red-500 flex items-center gap-1", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
      error
    ] })
  ] });
}
const inputCls = cn(
  "w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder:text-slate-400",
  "bg-white border border-slate-200 outline-none",
  "focus:border-teal-400 focus:ring-2 focus:ring-teal-400/15 transition-all duration-200"
);
const errorInputCls = "border-red-300 focus:border-red-400 focus:ring-red-400/15";
function TagInput({
  tags,
  onChange
}) {
  const [input, setInput] = useState("");
  function add() {
    const val = input.trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  }
  function remove(tag) {
    onChange(tags.filter((t) => t !== tag));
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          },
          placeholder: "Ajouter un tag et Entrée",
          className: inputCls
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: add,
          className: "px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 text-sm font-medium hover:bg-teal-100 transition-colors flex-shrink-0",
          children: "Ajouter"
        }
      )
    ] }),
    tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: tags.map((tag) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200", children: [
      tag,
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => remove(tag), className: "text-slate-400 hover:text-slate-700 ml-0.5", children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) })
    ] }, tag)) })
  ] });
}
function MarkdownEditor({
  value,
  onChange,
  error
}) {
  const [tab, setTab] = useState("edit");
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsx("div", { className: "flex gap-1 p-1 bg-slate-100 rounded-xl w-fit", children: ["edit", "preview"].map((t) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setTab(t),
        className: cn(
          "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
          tab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
        ),
        children: t === "edit" ? "Éditeur" : "Aperçu"
      },
      t
    )) }),
    tab === "edit" ? /* @__PURE__ */ jsx(
      "textarea",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        rows: 14,
        placeholder: "Rédigez le contenu en Markdown...",
        className: cn(inputCls, "resize-y font-mono text-xs leading-relaxed", error && errorInputCls)
      }
    ) : /* @__PURE__ */ jsx(
      "div",
      {
        className: "min-h-[14rem] p-4 rounded-xl border border-slate-200 bg-white prose prose-sm prose-slate max-w-none overflow-auto",
        dangerouslySetInnerHTML: { __html: markdownToHtml(value) }
      }
    ),
    error && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: error })
  ] });
}
function markdownToHtml(md) {
  return md.replace(/^### (.+)$/gm, "<h3>$1</h3>").replace(/^## (.+)$/gm, "<h2>$1</h2>").replace(/^# (.+)$/gm, "<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`(.+?)`/g, "<code>$1</code>").replace(/^- (.+)$/gm, "<li>$1</li>").replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>").replace(/\n\n/g, "</p><p>").replace(/^(?!<[hul])/gm, "<p>").replace(new RegExp("(?<![>])$", "gm"), "</p>");
}
export {
  DeleteModal as D,
  Field as F,
  ImageUpload as I,
  MarkdownEditor as M,
  PublishedBadge as P,
  TagInput as T,
  MultiImageUpload as a,
  errorInputCls as e,
  inputCls as i
};
