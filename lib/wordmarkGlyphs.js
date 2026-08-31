// Hand-drawn uppercase glyphs for the Percolia wordmark, redrawn as filled
// (heavily stroked, round-capped/joined) letterforms measured directly off
// the reference lettering (pixel-sampled from typographie_percolia.jpeg):
// bold monoline strokes (~14 units thick on a 100-unit cap height), with the
// "P" bowl left open — a detached hook that doesn't reconnect to the stem —
// and two small accent dots (blue + teal) sitting in that gap.
//
// Grid: y=0 is the cap line, y=100 is the baseline. Each glyph declares its
// advance `width`; strokes are plain path data rendered with fill="none"
// and a heavy stroke (so they read as solid letterforms, not thin outlines).

export const CAP_HEIGHT = 100;

export const GLYPHS = {
  P: {
    width: 72,
    strokes: [
      "M7,0 L7,100", // stem
      // open bowl: leaves the stem at the top, arcs out and down the right
      // side, then hooks back left, ending well short of the stem
      "M7,6 C42,-4 68,10 68,32 C68,54 50,60 34,58",
    ],
    dots: [
      { cx: 12, cy: 58, r: 6.5, color: "var(--color-blue)" },
      { cx: 34, cy: 58, r: 6.5, color: "var(--color-teal)" },
    ],
  },
  E: {
    width: 65,
    strokes: ["M64,0 L7,0 L7,100 L65,100", "M7,50 L52,50"],
  },
  R: {
    width: 75,
    strokes: [
      "M7,0 L7,100",
      "M7,6 C42,-4 68,10 68,32 C68,54 50,60 34,58", // same open bowl as P
      "M20,55 L68,100", // leg
    ],
  },
  C: {
    width: 68,
    strokes: ["M62,16 C20,0 0,20 0,50 C0,80 20,100 62,84"],
  },
  O: {
    width: 70,
    ellipse: { cx: 35, cy: 50, rx: 28, ry: 43 },
  },
  L: {
    width: 62,
    strokes: ["M7,0 L7,100 L62,100"],
  },
  I: {
    width: 48,
    strokes: ["M7,0 L41,0", "M24,0 L24,100", "M7,100 L41,100"],
  },
  A: {
    width: 80,
    strokes: ["M4,100 L27,4 L53,4 L76,100", "M18,56 L62,56"],
  },
  N: {
    width: 68,
    strokes: ["M7,100 L7,0 L61,100 L61,0"],
  },
  T: {
    width: 64,
    strokes: ["M4,0 L60,0", "M32,0 L32,100"],
  },
};
