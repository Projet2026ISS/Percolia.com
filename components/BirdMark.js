"use client";

import { useId } from "react";
import { NODES, EDGES, TRIANGLES, VIEWBOX } from "@/lib/birdGraph";

/**
 * Static, resting rendition of the Percolia bird mark: nodes, edges and
 * translucent triangular faces, matching the reference logo's low-poly style.
 */
export default function BirdMark({ className, width = 40, height = 25 }) {
  const uid = useId();
  const faceGradientId = `bird-face-${uid}`;
  const edgeGradientId = `bird-edge-${uid}`;

  return (
    <svg
      viewBox={VIEWBOX}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="Percolia"
    >
      <defs>
        <linearGradient id={faceGradientId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-blue)" />
          <stop offset="100%" stopColor="var(--color-teal)" />
        </linearGradient>
        <linearGradient id={edgeGradientId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-blue)" />
          <stop offset="100%" stopColor="var(--color-teal)" />
        </linearGradient>
      </defs>

      {TRIANGLES.map(([a, b, c], i) => {
        const [ax, ay] = NODES[a];
        const [bx, by] = NODES[b];
        const [cx, cy] = NODES[c];
        return (
          <polygon
            key={i}
            points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
            fill={`url(#${faceGradientId})`}
            fillOpacity="0.35"
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
            stroke={`url(#${edgeGradientId})`}
            strokeWidth="1.5"
          />
        );
      })}

      {Object.entries(NODES).map(([name, [x, y]]) => (
        <circle
          key={name}
          cx={x}
          cy={y}
          r={name === "eyeDot" ? 5 : 3}
          fill={name === "eyeDot" ? "var(--color-teal)" : "var(--color-text)"}
        />
      ))}
    </svg>
  );
}
