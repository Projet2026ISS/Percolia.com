"use client";

import { GLYPHS, CAP_HEIGHT } from "@/lib/wordmarkGlyphs";

/**
 * Renders text as the custom hand-drawn Percolia lettering (see
 * lib/wordmarkGlyphs.js) instead of a webfont — chunky rounded monoline
 * strokes, with an intentionally open "P" bowl.
 */
export default function Wordmark({
  text,
  className,
  height = 28,
  strokeWidth = 15,
  gap = 18,
  color = "currentColor",
  style,
}) {
  const chars = text.toUpperCase().split("");
  let cursor = 0;
  const placed = [];

  for (const ch of chars) {
    if (ch === " ") {
      cursor += 34 + gap;
      continue;
    }
    const glyph = GLYPHS[ch];
    if (!glyph) continue;
    placed.push({ glyph, x: cursor });
    cursor += glyph.width + gap;
  }

  const totalWidth = Math.max(cursor - gap, 0);
  const pad = strokeWidth;
  const viewBoxHeight = CAP_HEIGHT + pad * 2;
  const viewBoxWidth = totalWidth + pad * 2;

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${viewBoxWidth} ${viewBoxHeight}`}
      height={height}
      width={(viewBoxWidth * height) / viewBoxHeight}
      className={className}
      style={style}
      role="img"
      aria-label={text}
    >
      {placed.map(({ glyph, x }, i) => (
        <g key={i} transform={`translate(${x},0)`}>
          {glyph.ellipse ? (
            <ellipse
              cx={glyph.ellipse.cx}
              cy={glyph.ellipse.cy}
              rx={glyph.ellipse.rx}
              ry={glyph.ellipse.ry}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
            />
          ) : (
            glyph.strokes.map((d, j) => (
              <path
                key={j}
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))
          )}
        </g>
      ))}
    </svg>
  );
}
