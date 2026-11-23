// The three example videos of the home page (components/Examples.js).
// Each one exists in both site themes: public/videos/<id>-dark.mp4 and
// public/videos/<id>-light.mp4 (1440 × 1080, same timeline in both), plus a
// still image <id>-<theme>.jpg shown when the video cannot start by itself.

export const LINKEDIN_URL = "https://www.linkedin.com/company/percolia/";

export const EXAMPLES = [
  {
    id: "kitti",
    caption: "Street LiDAR · SemanticKITTI",
    description:
      "A pedestrian and two bicycles in a street LiDAR scan. HGP recovers the three objects; HDBSCAN merges the two bicycles.",
  },
  {
    id: "olive",
    caption: "Italian olive oils · 8 fatty acids",
    description:
      "572 Italian olive oils described by 8 fatty acids. HGP recovers their 9 regions of origin; HDBSCAN recovers 7.",
  },
  {
    id: "aidetech",
    caption: "Shipyard · plan vs scan, with AI-DEtech",
    description:
      "A shipyard in theory (the 3D plan) and in reality (the LiDAR scan). HGP clusters the points and finds the 6 differences.",
  },
];

export function videoSrc(id, theme) {
  return `/videos/${id}-${theme}.mp4`;
}

export function posterSrc(id, theme) {
  return `/videos/${id}-${theme}.jpg`;
}
