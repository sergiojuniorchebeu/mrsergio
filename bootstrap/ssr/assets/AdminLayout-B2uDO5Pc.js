import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import React__default, { useSyncExternalStore, useState, useEffect } from "react";
import { XIcon, PanelLeftOpenIcon, PanelLeftCloseIcon, LayoutGrid, Code2, FileText, GraduationCap, Mail, ExternalLink, LogOut, ChevronRight } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { c as cn } from "./utils-DsUdfzPs.js";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
const base = cn(
  "relative inline-flex items-center justify-center gap-2",
  "font-medium tracking-[-0.01em] rounded-xl",
  "transition-all duration-200 ease-out",
  "disabled:opacity-40 disabled:cursor-not-allowed",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2"
);
const variants = {
  // Teal plein — CTA principal
  primary: cn(
    "bg-teal-600 text-white",
    "shadow-[0_1px_2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(29,158,117,0.3)_inset]",
    "hover:bg-teal-700",
    "active:bg-teal-800 active:scale-[0.98]"
  ),
  // Contour transparent — CTA secondaire
  ghost: cn(
    "bg-transparent text-slate-700",
    "border border-slate-200",
    "hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900",
    "active:scale-[0.98]"
  ),
  // Dark section — bouton sur fond sombre
  dark: cn(
    "bg-white/10 text-white",
    "border border-white/15",
    "backdrop-blur-sm",
    "hover:bg-white/18 hover:border-white/25",
    "active:scale-[0.98]"
  )
};
const sizes = {
  sm: "h-8  px-3.5 text-xs",
  md: "h-10 px-5   text-sm",
  lg: "h-11 px-6   text-[15px]"
};
const Spinner = () => /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", "aria-hidden": true, className: "animate-spin", children: [
  /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "5.5", stroke: "currentColor", strokeOpacity: "0.25", strokeWidth: "1.5" }),
  /* @__PURE__ */ jsx("path", { d: "M7 1.5A5.5 5.5 0 0112.5 7", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
] });
const AppButton = React__default.forwardRef(
  ({ variant = "primary", size = "md", children, icon, loading, className, disabled, ...props }, ref) => /* @__PURE__ */ jsxs(
    motion.button,
    {
      ref,
      whileTap: { scale: 0.97 },
      transition: { duration: 0.1 },
      disabled: disabled || loading,
      className: cn(base, variants[variant], sizes[size], className),
      ...props,
      children: [
        loading ? /* @__PURE__ */ jsx(Spinner, {}) : null,
        children,
        !loading && icon ? icon : null
      ]
    }
  )
);
AppButton.displayName = "AppButton";
const Button = AppButton;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator-root",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      SheetPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx(XIcon, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Description,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    TooltipPrimitive.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-w-sm rounded-md px-3 py-1.5 text-xs",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(TooltipPrimitive.Arrow, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
const MOBILE_BREAKPOINT = 768;
const mql = typeof window === "undefined" ? void 0 : window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
function mediaQueryListener(callback) {
  if (!mql) {
    return () => {
    };
  }
  mql.addEventListener("change", callback);
  return () => {
    mql.removeEventListener("change", callback);
  };
}
function isSmallerThanBreakpoint() {
  return mql?.matches ?? false;
}
function getServerSnapshot() {
  return false;
}
function useIsMobile() {
  return useSyncExternalStore(
    mediaQueryListener,
    isSmallerThanBreakpoint,
    getServerSnapshot
  );
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn(
        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
        className
      ),
      ...props,
      children
    }
  ) }) });
}
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        "data-slot": "sidebar",
        className: cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        ),
        ...props,
        children
      }
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsxs(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: [
      /* @__PURE__ */ jsxs(SheetHeader, { className: "sr-only", children: [
        /* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }),
        /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })
      ] }),
      /* @__PURE__ */ jsx(
        SheetContent,
        {
          "data-sidebar": "sidebar",
          "data-slot": "sidebar",
          "data-mobile": "true",
          className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
          style: {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE
          },
          side,
          children: /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group peer text-sidebar-foreground hidden md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "relative h-svh w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            ),
            ...props,
            children: /* @__PURE__ */ jsx(
              "div",
              {
                "data-sidebar": "sidebar",
                className: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
                children
              }
            )
          }
        )
      ]
    }
  );
}
function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar, isMobile, state } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      className: cn("h-7 w-7", className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        isMobile || state === "collapsed" ? /* @__PURE__ */ jsx(PanelLeftOpenIcon, {}) : /* @__PURE__ */ jsx(PanelLeftCloseIcon, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function SidebarInset({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: cn(
        "bg-background relative flex max-w-full min-h-svh flex-1 flex-col",
        "peer-data-[variant=inset]:min-h-[calc(100svh-(--spacing(4)))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0",
        className
      ),
      ...props
    }
  );
}
function SidebarHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Separator,
    {
      "data-slot": "sidebar-separator",
      "data-sidebar": "separator",
      className: cn("bg-sidebar-border mx-2 w-auto", className),
      ...props
    }
  );
}
function SidebarContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
}
function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      className: cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:select-none group-data-[collapsible=icon]:pointer-events-none",
        className
      ),
      ...props
    }
  );
}
function SidebarGroupContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      className: cn("w-full text-sm", className),
      ...props
    }
  );
}
function SidebarMenu({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: cn("flex w-full min-w-0 flex-col gap-1", className),
      ...props
    }
  );
}
function SidebarMenuItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: cn("group/menu-item relative", className),
      ...props
    }
  );
}
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function SidebarMenuButton({
  asChild = false,
  isActive: isActive2 = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();
  const button = /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive2,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props
    }
  );
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx(
      TooltipContent,
      {
        side: "right",
        align: "center",
        hidden: state !== "collapsed" || isMobile,
        ...tooltip
      }
    )
  ] });
}
const navItems = [
  { label: "Vue d'ensemble", href: "/admin", exact: true, icon: LayoutGrid },
  { label: "Projets", href: "/admin/projects", exact: false, icon: Code2 },
  { label: "Blog", href: "/admin/blog", exact: false, icon: FileText },
  { label: "Formations", href: "/admin/formations", exact: false, icon: GraduationCap },
  { label: "Messages", href: "/admin/messages", exact: false, icon: Mail }
];
const isActive = (href, url, exact) => exact ? url === href : url.startsWith(href);
const logout = () => router.post("/logout");
function LogoMark({ size = 22 }) {
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 64 64", fill: "none", "aria-label": "mrsergio", children: [
    /* @__PURE__ */ jsx("polygon", { points: "32,3 58,17 58,47 32,61 6,47 6,17", fill: "#1D9E75", fillOpacity: "0.12" }),
    /* @__PURE__ */ jsx("polygon", { points: "32,3 58,17 58,47 32,61 6,47 6,17", fill: "none", stroke: "#1D9E75", strokeWidth: "1.5" }),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M20 24Q20 18 26 18L38 18Q44 18 44 24Q44 30 32 34Q20 38 20 44Q20 50 26 50L38 50Q44 50 44 44",
        stroke: "#1D9E75",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        fill: "none"
      }
    ),
    /* @__PURE__ */ jsx("circle", { cx: "54", cy: "17", r: "5", fill: "#1D9E75" })
  ] });
}
function FlashToast({ type, message }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 4500);
    return () => clearTimeout(t);
  }, [message]);
  if (!show) return null;
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -10, scale: 0.97 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -6, scale: 0.97 },
      transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
      className: cn(
        "fixed top-4 right-4 z-[100] flex items-start gap-3",
        "px-4 py-3 rounded-xl shadow-lg max-w-sm w-full",
        "bg-white border text-[13px] font-medium backdrop-blur-sm",
        type === "success" ? "border-teal-200 text-slate-800" : "border-red-200 text-slate-800"
      ),
      children: [
        type === "success" ? /* @__PURE__ */ jsxs("svg", { width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", className: "text-teal-500 flex-shrink-0 mt-[1px]", "aria-hidden": true, children: [
          /* @__PURE__ */ jsx("circle", { cx: "7.5", cy: "7.5", r: "6", stroke: "currentColor", strokeWidth: "1.3" }),
          /* @__PURE__ */ jsx("path", { d: "M4.5 7.5l2 2 4-4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
        ] }) : /* @__PURE__ */ jsxs("svg", { width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", className: "text-red-500 flex-shrink-0 mt-[1px]", "aria-hidden": true, children: [
          /* @__PURE__ */ jsx("circle", { cx: "7.5", cy: "7.5", r: "6", stroke: "currentColor", strokeWidth: "1.3" }),
          /* @__PURE__ */ jsx("path", { d: "M7.5 4.5v3.5M7.5 10.5v.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "flex-1 leading-relaxed", children: message }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShow(false),
            "aria-label": "Fermer",
            className: "text-slate-300 hover:text-slate-500 transition-colors",
            children: /* @__PURE__ */ jsx("svg", { width: "13", height: "13", viewBox: "0 0 13 13", fill: "none", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M2.5 2.5l8 8M10.5 2.5l-8 8", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) })
          }
        )
      ]
    }
  );
}
function AdminLayout({ children, title, breadcrumb }) {
  const { url, props } = usePage();
  const flash = props.flash ?? {};
  const user = props.auth?.user;
  const initials = user?.name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() ?? "A";
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsxs(AnimatePresence, { mode: "wait", children: [
      flash.success && /* @__PURE__ */ jsx(FlashToast, { type: "success", message: flash.success }, `s-${flash.success}`),
      flash.error && /* @__PURE__ */ jsx(FlashToast, { type: "error", message: flash.error }, `e-${flash.error}`)
    ] }),
    /* @__PURE__ */ jsxs(Sidebar, { collapsible: "icon", variant: "inset", children: [
      /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: "/admin", className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent flex-shrink-0", children: /* @__PURE__ */ jsx(LogoMark, { size: 20 }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-none min-w-0", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[13px] font-bold text-sidebar-foreground tracking-tight truncate", children: [
            "mr",
            /* @__PURE__ */ jsx("span", { className: "text-teal-600", children: "sergio" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[9px] font-mono text-sidebar-foreground/40 tracking-[0.18em]", children: ".dev / admin" })
        ] })
      ] }) }) }) }) }),
      /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsxs(SidebarGroup, { children: [
        /* @__PURE__ */ jsx(SidebarGroupLabel, { children: "Gestion" }),
        /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: navItems.map(({ label, href, exact, icon: Icon }) => {
          const active = isActive(href, url, exact);
          return /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(
            SidebarMenuButton,
            {
              asChild: true,
              isActive: active,
              tooltip: label,
              children: /* @__PURE__ */ jsxs(Link, { href, children: [
                /* @__PURE__ */ jsx(Icon, {}),
                /* @__PURE__ */ jsx("span", { children: label })
              ] })
            }
          ) }, href);
        }) }) })
      ] }) }),
      /* @__PURE__ */ jsxs(SidebarFooter, { children: [
        /* @__PURE__ */ jsx(SidebarSeparator, {}),
        /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, tooltip: "Voir le site public", children: /* @__PURE__ */ jsxs("a", { href: "/", target: "_blank", rel: "noreferrer", children: [
          /* @__PURE__ */ jsx(ExternalLink, {}),
          /* @__PURE__ */ jsx("span", { children: "Voir le site public" })
        ] }) }) }) }),
        /* @__PURE__ */ jsx(SidebarSeparator, {}),
        /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(SidebarMenuButton, { size: "lg", tooltip: user?.email ?? "", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex-shrink-0 shadow-sm", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-white leading-none", children: initials }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-none min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[12px] font-semibold text-sidebar-foreground truncate", children: user?.name ?? "Admin" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-sidebar-foreground/50 truncate", children: user?.email ?? "" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                logout();
              },
              title: "Déconnexion",
              "aria-label": "Déconnexion",
              className: "ml-auto p-1 rounded-md text-sidebar-foreground/30 hover:text-red-500 hover:bg-red-50 transition-all duration-150",
              children: /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" })
            }
          )
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsxs("header", { className: cn(
        "flex h-12 shrink-0 items-center gap-2 justify-between",
        "border-b border-sidebar-border/50 px-4",
        "transition-[width,height] ease-linear",
        "group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
        "sticky top-0 z-10 bg-background"
      ), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsx(SidebarTrigger, { className: "-ml-1" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 w-px bg-border" }),
          breadcrumb ? /* @__PURE__ */ jsx("nav", { className: "flex items-center gap-1 min-w-0 flex-wrap", "aria-label": "Breadcrumb", children: breadcrumb.map((crumb, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
            i > 0 && /* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-muted-foreground/50 flex-shrink-0" }),
            crumb.href ? /* @__PURE__ */ jsx(
              Link,
              {
                href: crumb.href,
                className: "text-[13px] text-muted-foreground hover:text-foreground transition-colors truncate font-medium",
                children: crumb.label
              }
            ) : /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-foreground truncate", "aria-current": "page", children: crumb.label })
          ] }, i)) }) : title ? /* @__PURE__ */ jsx("h1", { className: "text-[14px] font-semibold text-foreground truncate", children: title }) : null
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 flex-shrink-0", children: /* @__PURE__ */ jsxs("span", { className: "hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-[5px] rounded-full", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-teal-500 rounded-full", "aria-hidden": true }),
          "Admin"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex flex-1 flex-col gap-4 p-4 overflow-auto", children })
    ] })
  ] });
}
export {
  AdminLayout as A
};
