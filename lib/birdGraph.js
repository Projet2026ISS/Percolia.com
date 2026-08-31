// Percolia bird mark, reconstructed as a vector node/edge/triangle graph
// from Documentation/Logo.jpeg: node centers were located by blob-detecting
// the dark/colored dots in the source image, then triangulated (Delaunay,
// filtered to drop long bridging edges) and colors sampled at each
// node/triangle. This is a faithful redraw of that artwork, not a
// from-scratch design.

export const VIEWBOX = "-20 -70 480 420";

export const NODES = {
  n0: [176.7, 5.7],
  n1: [235.5, 39.5],
  n2: [387.1, 48.7],
  n3: [110.1, 55.6],
  n4: [425.1, 70.3],
  n5: [344.6, 75.1],
  n6: [436.7, 87.8],
  n7: [217.7, 102.1],
  n8: [136.6, 107.1],
  n9: [415.3, 107.8],
  n10: [4.7, 112.8],
  n11: [280.4, 127.8],
  n12: [310.4, 141.7],
  n13: [227.7, 149.2],
  n14: [190.0, 153.4],
  n15: [397.9, 176.9],
  n16: [234.3, 191.3],
  n17: [113.7, 225.5],
  n18: [185.2, 227.4],
  n19: [369.0, 233.9],
  n20: [238.9, 265.8],
  n21: [124.7, 283.4],
  n22: [284.8, 292.5],
  n23: [270.9, 294.0],
  n24: [58.4, 296.9],
  n25: [101.6, 313.2],
  n26: [301.7, 322.2],
  n27: [314.2, 319.5],
  n28: [329.7, 325.9],
  n29: [61.4, 329.0],
};

export const TRIANGLES = [
  ["n24", "n25", "n29"],
  ["n8", "n3", "n0"],
  ["n21", "n24", "n17"],
  ["n21", "n25", "n24"],
  ["n14", "n18", "n17"],
  ["n18", "n21", "n17"],
  ["n14", "n7", "n13"],
  ["n7", "n14", "n8"],
  ["n7", "n8", "n0"],
  ["n1", "n7", "n0"],
  ["n18", "n16", "n20"],
  ["n16", "n14", "n13"],
  ["n16", "n18", "n14"],
  ["n16", "n22", "n20"],
  ["n15", "n9", "n6"],
  ["n9", "n4", "n6"],
  ["n2", "n9", "n5"],
  ["n4", "n9", "n2"],
  ["n12", "n15", "n19"],
  ["n9", "n12", "n5"],
  ["n12", "n9", "n15"],
  ["n22", "n23", "n20"],
  ["n23", "n22", "n26"],
  ["n26", "n27", "n28"],
  ["n22", "n27", "n26"],
  ["n27", "n19", "n28"],
  ["n27", "n22", "n19"],
  ["n11", "n16", "n13"],
  ["n11", "n12", "n16"],
  ["n7", "n11", "n13"],
  ["n11", "n7", "n1"],
  ["n11", "n1", "n5"],
  ["n12", "n11", "n5"],
];

// Nodes sampled as a bright accent color in the source image (the rest are
// the dark ink color). n18 reads distinctly teal; the others in this group
// read as the brighter signal blue.
export const ACCENT_TEAL = new Set(["n18"]);
export const ACCENT_BLUE = new Set(["n7", "n12", "n13", "n14", "n16", "n21"]);

function edgeKey(a, b) {
  return [a, b].sort().join("__");
}

export const EDGES = (() => {
  const seen = new Map();
  for (const [a, b, c] of TRIANGLES) {
    for (const [p, q] of [
      [a, b],
      [b, c],
      [c, a],
    ]) {
      const key = edgeKey(p, q);
      if (!seen.has(key)) seen.set(key, [p, q]);
    }
  }
  return Array.from(seen.values());
})();

// Scattered points around the bird, echoing the reference image's loose
// particle trail (sampled positions, decorative only — no edges).
export const DUST = [
  [264, 81],
  [299, 143],
  [146, 259],
  [71, 194],
  [161, -50],
  [65, 53],
  [329, 216],
  [56, 251],
  [119, 266],
  [16, 326],
  [75, 2],
  [301, 99],
  [6, 178],
  [158, 203],
];
