import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useCallback } from "react";
import { c as cn } from "./utils-DsUdfzPs.js";
const BORDER_INACTIVE = "rgb(226, 224, 218)";
function SpotlightCard({ children, className }) {
  const outerRef = useRef(null);
  const glowRef = useRef(null);
  const onMove = useCallback((e) => {
    const el = outerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.background = `radial-gradient(380px circle at ${x}px ${y}px, rgba(26,163,137,0.28) 0%, ${BORDER_INACTIVE} 55%)`;
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(26,163,137,0.06), transparent 68%)`;
      glowRef.current.style.opacity = "1";
    }
  }, []);
  const onLeave = useCallback(() => {
    if (outerRef.current) {
      outerRef.current.style.background = BORDER_INACTIVE;
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: outerRef,
      onMouseMove: onMove,
      onMouseLeave: onLeave,
      className: cn(
        "group relative rounded-[20px]",
        "transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "hover:-translate-y-1.5 hover:shadow-[0_22px_55px_-12px_rgba(0,0,0,0.1)]",
        className
      ),
      style: { background: BORDER_INACTIVE, padding: "1px" },
      children: /* @__PURE__ */ jsxs("div", { className: "relative rounded-[19px] bg-white h-full flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: glowRef,
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-0 z-0",
            style: { opacity: 0, transition: "opacity 0.25s ease" }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "relative z-10 flex flex-col h-full", children })
      ] })
    }
  );
}
export {
  SpotlightCard as S
};
