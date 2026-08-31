"use client";

import {
  NODES,
  EDGES,
  TRIANGLES,
  VIEWBOX,
  ACCENT_TEAL,
  ACCENT_BLUE,
} from "@/lib/birdGraph";

function triangleFill(a, b, c) {
  if (ACCENT_TEAL.has(a) || ACCENT_TEAL.has(b) || ACCENT_TEAL.has(c)) {
    return "var(--color-teal)";
  }
  if (ACCENT_BLUE.has(a) || ACCENT_BLUE.has(b) || ACCENT_BLUE.has(c)) {
    return "var(--color-blue)";
  }
  return "var(--color-text)";
}

/**
 * Static rendition of the Percolia bird mark, redrawn from
 * Documentation/Logo.jpeg (node positions, triangulation and accent
 * colors sampled directly from that image — see lib/birdGraph.js).
 */
export default function BirdMark({ className, width = 40, height = 30 }) {
  return (
    <svg
      viewBox={VIEWBOX}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="Percolia"
    >
      {TRIANGLES.map(([a, b, c], i) => {
        const [ax, ay] = NODES[a];
        const [bx, by] = NODES[b];
        const [cx, cy] = NODES[c];
        return (
          <polygon
            key={i}
            points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
            fill={triangleFill(a, b, c)}
            fillOpacity="0.28"
          />
        );
      })}

      {EDGES.map(([a, b], i) => {
        const [ax, ay] = NODES[a];
        const [bx, by] = NODES[b];
        return (
          <line
            key={i}
            x1={ax}
            y1={ay}
            x2={bx}
            y2={by}
            stroke="var(--color-text)"
            strokeOpacity="0.55"
            strokeWidth="2.2"
          />
        );
      })}

      {Object.entries(NODES).map(([name, [x, y]]) => (
        <circle
          key={name}
          cx={x}
          cy={y}
          r={ACCENT_TEAL.has(name) || ACCENT_BLUE.has(name) ? 7 : 5.5}
          fill={
            ACCENT_TEAL.has(name)
              ? "var(--color-teal)"
              : ACCENT_BLUE.has(name)
              ? "var(--color-blue)"
              : "var(--color-text)"
          }
        />
      ))}
    </svg>
  );
}
