import { jsxs, jsx } from "react/jsx-runtime";
import { useId } from "react";
import { c as cn } from "./utils-DsUdfzPs.js";
function hexVertexList(cx, cy, r, direction) {
  const startAngle = direction === "horizontal" ? 0 : 30;
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (startAngle + i * 60) * Math.PI / 180;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
}
function hexPoints(cx, cy, r, direction) {
  return hexVertexList(cx, cy, r, direction).map(([px, py]) => `${px},${py}`).join(" ");
}
function edgeLexKey(a, b) {
  const [p, q] = a[0] < b[0] || a[0] === b[0] && a[1] <= b[1] ? [a, b] : [b, a];
  return `${p[0].toFixed(6)},${p[1].toFixed(6)}|${q[0].toFixed(6)},${q[1].toFixed(6)}`;
}
function collectUniqueHexEdges(centers, r, direction) {
  const seen = /* @__PURE__ */ new Set();
  const edges = [];
  for (const [cx, cy] of centers) {
    const verts = hexVertexList(cx, cy, r, direction);
    for (let i = 0; i < 6; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % 6];
      const key = edgeLexKey(a, b);
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, b]);
      }
    }
  }
  return edges;
}
function isSolidStrokeDasharray(strokeDasharray) {
  const t = strokeDasharray.trim();
  return t === "" || t === "none" || t === "0";
}
function getHexSpacing(r, direction, gap) {
  const sqrt3 = Math.sqrt(3);
  if (direction === "horizontal") {
    const colStep2 = 3 * r / 2 + sqrt3 * gap / 2;
    const rowStep2 = sqrt3 * r + gap;
    return {
      colStep: colStep2,
      rowStep: rowStep2,
      tileW: colStep2 * 2,
      tileH: rowStep2
    };
  }
  const colStep = sqrt3 * r + gap;
  const rowStep = 3 * r / 2 + sqrt3 * gap / 2;
  return {
    colStep,
    rowStep,
    tileW: colStep,
    tileH: rowStep * 2
  };
}
function getTileGeometry(r, direction, gap) {
  if (direction === "horizontal") {
    const { colStep, rowStep, tileW, tileH } = getHexSpacing(r, direction, gap);
    const canonical = [
      [colStep / 2, rowStep / 2],
      [colStep * 3 / 2, rowStep]
    ];
    const centers = [];
    for (const [cx, cy] of canonical) {
      centers.push([cx, cy]);
      if (cy - r < 0) centers.push([cx, cy + tileH]);
      if (cy + r > tileH) centers.push([cx, cy - tileH]);
      if (cx - r < 0) centers.push([cx + tileW, cy]);
      if (cx + r > tileW) centers.push([cx - tileW, cy]);
      if (cy - r < 0 && cx - r < 0) centers.push([cx + tileW, cy + tileH]);
      if (cy - r < 0 && cx + r > tileW) centers.push([cx - tileW, cy + tileH]);
      if (cy + r > tileH && cx - r < 0) centers.push([cx + tileW, cy - tileH]);
      if (cy + r > tileH && cx + r > tileW)
        centers.push([cx - tileW, cy - tileH]);
    }
    return { tileW, tileH, centers };
  } else {
    const { colStep, rowStep, tileW, tileH } = getHexSpacing(r, direction, gap);
    const canonical = [
      [colStep / 2, rowStep / 2],
      [colStep, rowStep * 3 / 2]
    ];
    const centers = [];
    for (const [cx, cy] of canonical) {
      centers.push([cx, cy]);
      if (cy - r < 0) centers.push([cx, cy + tileH]);
      if (cy + r > tileH) centers.push([cx, cy - tileH]);
      if (cx - r < 0) centers.push([cx + tileW, cy]);
      if (cx + r > tileW) centers.push([cx - tileW, cy]);
      if (cy - r < 0 && cx - r < 0) centers.push([cx + tileW, cy + tileH]);
      if (cy - r < 0 && cx + r > tileW) centers.push([cx - tileW, cy + tileH]);
      if (cy + r > tileH && cx - r < 0) centers.push([cx + tileW, cy - tileH]);
      if (cy + r > tileH && cx + r > tileW)
        centers.push([cx - tileW, cy - tileH]);
    }
    return { tileW, tileH, centers };
  }
}
function hexCenter(col, row, r, direction, gap) {
  if (direction === "horizontal") {
    const { colStep, rowStep } = getHexSpacing(r, direction, gap);
    const x = col * colStep + colStep / 2;
    const y = row * rowStep + rowStep / 2 + (col % 2 !== 0 ? rowStep / 2 : 0);
    return [x, y];
  } else {
    const { colStep, rowStep } = getHexSpacing(r, direction, gap);
    const x = col * colStep + colStep / 2 + (row % 2 !== 0 ? colStep / 2 : 0);
    const y = row * rowStep + rowStep / 2;
    return [x, y];
  }
}
function HexagonPattern({
  radius = 40,
  gap = 0,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  direction = "horizontal",
  hexagons,
  className,
  ...props
}) {
  const id = useId();
  const { tileW, tileH, centers } = getTileGeometry(radius, direction, gap);
  const solidStroke = isSolidStrokeDasharray(strokeDasharray);
  const dashedEdges = solidStroke ? null : collectUniqueHexEdges(centers, radius, direction);
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "aria-hidden": "true",
      className: cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx(
          "pattern",
          {
            id,
            width: tileW,
            height: tileH,
            patternUnits: "userSpaceOnUse",
            x,
            y,
            children: solidStroke ? centers.map(([cx, cy]) => /* @__PURE__ */ jsx(
              "polygon",
              {
                className: "fill-none",
                points: hexPoints(cx, cy, radius, direction),
                strokeDasharray
              },
              `${cx}-${cy}`
            )) : dashedEdges?.map(([a, b]) => /* @__PURE__ */ jsx(
              "line",
              {
                className: "fill-none",
                x1: a[0],
                x2: b[0],
                y1: a[1],
                y2: b[1],
                strokeDasharray
              },
              edgeLexKey(a, b)
            ))
          }
        ) }),
        /* @__PURE__ */ jsx("rect", { width: "100%", height: "100%", fill: `url(#${id})`, stroke: "none" }),
        hexagons && hexagons.length > 0 && /* @__PURE__ */ jsx("svg", { "aria-hidden": "true", className: "overflow-visible", x, y, children: hexagons.map(([col, row]) => {
          const [cx, cy] = hexCenter(col, row, radius, direction, gap);
          return /* @__PURE__ */ jsx(
            "polygon",
            {
              points: hexPoints(cx, cy, radius - 1, direction),
              strokeWidth: "0"
            },
            `${col}-${row}`
          );
        }) })
      ]
    }
  );
}
export {
  HexagonPattern as H
};
