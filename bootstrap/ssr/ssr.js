import { jsx } from "react/jsx-runtime";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "Mr.Sergio";
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(
      `./pages/${name}.tsx`,
      /* @__PURE__ */ Object.assign({ "./pages/Admin/Blog/Form.tsx": () => import("./assets/Form-DHo-u1Ku.js"), "./pages/Admin/Blog/Index.tsx": () => import("./assets/Index-HNbYBGo4.js"), "./pages/Admin/Dashboard.tsx": () => import("./assets/Dashboard-BquufIxM.js"), "./pages/Admin/Formations/Form.tsx": () => import("./assets/Form-DQCYo2iS.js"), "./pages/Admin/Formations/Index.tsx": () => import("./assets/Index-B5PnS9RI.js"), "./pages/Admin/Messages/Index.tsx": () => import("./assets/Index-D-pUj6WO.js"), "./pages/Admin/Projects/Form.tsx": () => import("./assets/Form-Dcidhyai.js"), "./pages/Admin/Projects/Index.tsx": () => import("./assets/Index-4L88_qMU.js"), "./pages/Auth/Login.tsx": () => import("./assets/Login-BAL6Q8kM.js"), "./pages/Blog/Index.tsx": () => import("./assets/Index-CIqTMPYu.js"), "./pages/Blog/Show.tsx": () => import("./assets/Show-TV-aMjot.js"), "./pages/Contact.tsx": () => import("./assets/Contact-BhayBXLm.js"), "./pages/Home.tsx": () => import("./assets/Home-DKz2EQDS.js"), "./pages/Projects/Index.tsx": () => import("./assets/Index-FSiLIwma.js"), "./pages/Projects/Show.tsx": () => import("./assets/Show-BjRcG9S2.js"), "./pages/formations/FormationsIndex.tsx": () => import("./assets/FormationsIndex-BIuAUvNq.js"), "./pages/formations/FormationsShow.tsx": () => import("./assets/FormationsShow-ByBOVbfb.js") })
    ),
    setup: ({ App, props }) => {
      return /* @__PURE__ */ jsx(App, { ...props });
    }
  })
);
