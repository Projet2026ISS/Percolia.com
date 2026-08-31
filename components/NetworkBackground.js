"use client";

import { useEffect, useRef } from "react";

const COLOR_TEXT_DARK = "234, 245, 247"; // --color-text, dark theme
const COLOR_TEXT_LIGHT = "8, 44, 76"; // --color-text, light theme
const COLOR_BLUE = "28, 131, 212"; // --color-blue (same in both themes)
const COLOR_TEAL = "32, 201, 196"; // --color-teal (same in both themes)

function currentTextColor() {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? COLOR_TEXT_LIGHT
    : COLOR_TEXT_DARK;
}

const DEFAULTS = {
  speed: 1.8, // was effectively 1 before — bumped per feedback
  nodeAreaDivisor: 16000, // smaller => more nodes
  minNodes: 36,
  maxNodes: 90,
  minR: 1.4,
  maxR: 4.8,
  linkDistance: 150,
  lineOpacityMax: 0.35,
  triangleOpacity: 0.055,
  showDots: true,
  showLines: true,
  showTriangles: true,
  glow: false,
  colorMode: "mixed", // 'mixed' | 'blue' | 'teal'
  mouseInteraction: false,
  bgBlob: false,
};

function colorFor(mode, t) {
  if (mode === "blue") return COLOR_BLUE;
  if (mode === "teal") return COLOR_TEAL;
  return t > 0.5 ? COLOR_TEAL : COLOR_BLUE;
}

function createNodes(width, height, cfg) {
  const area = width * height;
  const count = Math.min(
    cfg.maxNodes,
    Math.max(cfg.minNodes, Math.round(area / cfg.nodeAreaDivisor))
  );
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22 * cfg.speed,
      vy: (Math.random() - 0.5) * 0.22 * cfg.speed,
      r: cfg.minR + Math.random() * (cfg.maxR - cfg.minR),
    });
  }
  return nodes;
}

export default function NetworkBackground({ config }) {
  const canvasRef = useRef(null);
  const cfg = { ...DEFAULTS, ...config };

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
    let textColor = currentTextColor();
    const mouse = { x: -9999, y: -9999 };

    const themeObserver = new MutationObserver(() => {
      textColor = currentTextColor();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = createNodes(width, height, cfg);
    }

    function handlePointerMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function step(time) {
      ctx.clearRect(0, 0, width, height);

      if (cfg.bgBlob) {
        const bx = width * (0.3 + 0.2 * Math.sin(time / 6000));
        const by = height * (0.3 + 0.2 * Math.cos(time / 7000));
        const grad = ctx.createRadialGradient(
          bx,
          by,
          0,
          bx,
          by,
          Math.max(width, height) * 0.5
        );
        grad.addColorStop(0, `rgba(${COLOR_TEAL}, 0.10)`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        if (cfg.mouseInteraction) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 120 && d > 0.01) {
            const force = (120 - d) / 120;
            n.x += (dx / d) * force * 1.6;
            n.y += (dy / d) * force * 1.6;
          }
        }

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }

      const neighbors = nodes.map(() => []);

      if (cfg.showLines || cfg.showTriangles) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist < cfg.linkDistance) {
              neighbors[i].push(j);
              neighbors[j].push(i);
              if (cfg.showLines) {
                const t = 1 - dist / cfg.linkDistance;
                const color = colorFor(cfg.colorMode, t);
                ctx.strokeStyle = `rgba(${color}, ${t * cfg.lineOpacityMax})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      if (cfg.showTriangles) {
        for (let i = 0; i < nodes.length; i++) {
          const ni = neighbors[i];
          for (let a = 0; a < ni.length; a++) {
            const j = ni[a];
            if (j <= i) continue;
            for (let b = a + 1; b < ni.length; b++) {
              const k = ni[b];
              if (k <= j) continue;
              if (!neighbors[j].includes(k)) continue;
              const color = colorFor(cfg.colorMode, 0.6);
              ctx.fillStyle = `rgba(${color}, ${cfg.triangleOpacity})`;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.lineTo(nodes[k].x, nodes[k].y);
              ctx.closePath();
              ctx.fill();
            }
          }
        }
      }

      if (cfg.showDots) {
        for (const n of nodes) {
          if (cfg.glow) {
            ctx.shadowColor = `rgba(${COLOR_TEAL}, 0.9)`;
            ctx.shadowBlur = 8;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fillStyle = `rgba(${textColor}, 0.55)`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
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
    step(0);
    if (reducedMotion) {
      running = false;
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    if (cfg.mouseInteraction) {
      window.addEventListener("pointermove", handlePointerMove);
    }

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointermove", handlePointerMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(config)]);

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
