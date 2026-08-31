// Low-poly bird mark for Percolia, redrawn as a node/edge/face graph so it can
// be animated (points -> edges -> faces -> flight). Coordinates live in a
// 0..640 x 0..400 viewBox, bird facing / flying toward the top-right.

export const VIEWBOX = "0 0 640 400";

export const NODES = {
  // top contour (back / spine), tail to head
  tailBack: [150, 275],
  back1: [210, 230],
  back2: [270, 175],
  back3: [330, 130],
  back4: [390, 95],
  back5: [450, 90],
  neck: [505, 100],
  headTop: [555, 85],
  beakUpper: [605, 110],

  // bottom contour (belly / chest), tail to chin
  tailTip: [70, 320],
  tailMid: [150, 320],
  belly1: [210, 290],
  belly2: [270, 260],
  belly3: [330, 235],
  chest: [390, 205],
  throat: [450, 175],
  chin: [505, 150],
  beakLower: [590, 135],

  beakEnd: [630, 122],

  // tail feathers (trailing, lower-left flourish)
  feather1: [60, 290],
  feather2: [90, 345],
  feather3: [112, 312],

  // legs
  legTip1: [232, 332],
  legTip2: [258, 342],

  // small crest / eye accent
  eyeDot: [545, 118],
};

// Triangle strip forming the bird's body silhouette (tail -> beak),
// plus a few decorative flourishes (tail feathers, legs, beak tip).
export const TRIANGLES = [
  ["tailBack", "tailTip", "back1"],
  ["tailTip", "back1", "tailMid"],
  ["back1", "tailMid", "back2"],
  ["tailMid", "back2", "belly1"],
  ["back2", "belly1", "back3"],
  ["belly1", "back3", "belly2"],
  ["back3", "belly2", "back4"],
  ["belly2", "back4", "belly3"],
  ["back4", "belly3", "back5"],
  ["belly3", "back5", "chest"],
  ["back5", "chest", "neck"],
  ["chest", "neck", "throat"],
  ["neck", "throat", "headTop"],
  ["throat", "headTop", "chin"],
  ["headTop", "chin", "beakUpper"],
  ["chin", "beakUpper", "beakLower"],
  ["beakUpper", "beakLower", "beakEnd"],

  // tail feather flourish
  ["tailTip", "feather1", "feather2"],
  ["tailTip", "feather2", "tailMid"],
  ["tailMid", "feather2", "feather3"],

  // legs
  ["belly1", "belly2", "legTip1"],
  ["belly2", "legTip1", "legTip2"],
];

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

// Scattered "stardust" points around the bird (no edges), echoing the
// reference logo's loose particle trail.
export const DUST = [
  [30, 250],
  [15, 218],
  [45, 198],
  [78, 178],
  [112, 160],
  [18, 292],
  [480, 55],
  [512, 42],
  [542, 32],
  [568, 48],
  [594, 38],
  [618, 64],
  [648, 90],
];
