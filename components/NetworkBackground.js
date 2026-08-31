"use client";

import { useEffect, useRef } from "react";

const COLOR_TEXT = "234, 245, 247"; // --color-text
const COLOR_BLUE = "28, 131, 212"; // --color-blue
const COLOR_TEAL = "32, 201, 196"; // --color-teal

const LINK_DISTANCE = 150;
const TRIANGLE_OPACITY = 0.055;

function createNodes(width, height) {
  const area = width * height;
  const count = Math.min(90, Math.max(36, Math.round(area / 16000)));
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: 1.4 + Math.random() * 3.4,
    });
  }
  return nodes;
}

export default function NetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let raf = null;
    let running = true;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = createNodes(width, height);
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }

      // adjacency for triangle fills
      const neighbors = nodes.map(() => []);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DISTANCE) {
            neighbors[i].push(j);
            neighbors[j].push(i);
            const t = 1 - dist / LINK_DISTANCE;
            const color = t > 0.5 ? COLOR_TEAL : COLOR_BLUE;
            ctx.strokeStyle = `rgba(${color}, ${t * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // faceted triangles where three nodes are all mutually connected
      for (let i = 0; i < nodes.length; i++) {
        const ni = neighbors[i];
        for (let a = 0; a < ni.length; a++) {
          const j = ni[a];
          if (j <= i) continue;
          for (let b = a + 1; b < ni.length; b++) {
            const k = ni[b];
            if (k <= j) continue;
            if (!neighbors[j].includes(k)) continue;
            ctx.fillStyle = `rgba(${COLOR_TEAL}, ${TRIANGLE_OPACITY})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.lineTo(nodes[k].x, nodes[k].y);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `rgba(${COLOR_TEXT}, 0.55)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running && !reducedMotion) raf = requestAnimationFrame(step);
    }

    function handleVisibility() {
      if (document.hidden) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      } else if (!reducedMotion) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    }

    resize();
    step();
    if (reducedMotion) {
      // draw a single static frame, no loop
      running = false;
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
