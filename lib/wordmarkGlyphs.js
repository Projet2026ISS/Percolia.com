// Hand-drawn uppercase glyphs for the Percolia wordmark, redrawn as stroked
// SVG paths (round caps/joins) to match the reference lettering: chunky
// monoline strokes with open, rounded terminals rather than closed shapes —
// most visibly on the "P", whose bowl is a detached arc that doesn't touch
// the stem, leaving two rounded "points".
//
// Grid: y=0 is the cap line, y=100 is the baseline. Each glyph declares its
// advance `width`; strokes are plain path data rendered with fill="none".

export const CAP_HEIGHT = 100;

export const GLYPHS = {
  P: {
    width: 68,
    strokes: [
      "M10,100 L10,0", // stem
      "M26,6 C64,6 64,48 26,48", // bowl, open — a clear gap from the stem, leaving two rounded points
    ],
  },
  E: {
    width: 60,
    strokes: ["M58,0 L10,0 L10,100 L58,100", "M10,48 L46,48"],
  },
  R: {
    width: 70,
    strokes: [
      "M10,100 L10,0",
      "M26,6 C64,6 64,48 26,48", // same open bowl as P
      "M28,48 L62,100", // leg
    ],
  },
  C: {
    width: 62,
    strokes: ["M56,16 A34,42 0 1,0 56,84"],
  },
  O: {
    width: 66,
    ellipse: { cx: 33, cy: 50, rx: 31, ry: 48 },
  },
  L: {
    width: 56,
    strokes: ["M10,0 L10,100 L54,100"],
  },
  I: {
    width: 48,
    strokes: ["M24,0 L24,100"],
  },
  A: {
    width: 62,
    strokes: ["M4,100 L31,2 L58,100", "M16,60 L46,60"],
  },
  N: {
    width: 64,
    strokes: ["M10,100 L10,0 L56,100 L56,0"],
  },
  T: {
    width: 60,
    strokes: ["M4,0 L56,0", "M30,0 L30,100"],
  },
  U: {
    width: 64,
    strokes: ["M10,0 L10,68 C10,92 22,100 34,100 C46,100 58,92 58,68 L58,0"],
  },
};
