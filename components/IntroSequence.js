"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { NODES, EDGES, TRIANGLES, DUST, VIEWBOX } from "@/lib/birdGraph";

// Timing budget (ms) for each phase of the intro.
const T = {
  darkPause: 250,
  nodeStagger: 14,
  nodeDuration: 380,
  edgeStartOffset: 650, // relative to nodes phase start
  edgeStagger: 20,
  edgeDuration: 320,
  faceStartOffset: 500, // relative to edges phase start
  faceStagger: 16,
  faceDuration: 420,
  holdDuration: 550,
  flyRightDuration: 620,
  flyInDuration: 950,
  settleFade: 350,
};

const ALL_POINTS = [
  ...Object.entries(NODES).map(([name, pos]) => ({ key: `n-${name}`, pos })),
  ...DUST.map((pos, i) => ({ key: `d-${i}`, pos })),
];

function dist([x1, y1], [x2, y2]) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export default function IntroSequence({ targetRef, onComplete }) {
  const [phase, setPhase] = useState("dark");
  const [flight, setFlight] = useState({ x: 0, y: 0, scale: 1, opacity: 0 });
  const wrapRef = useRef(null);

  const nodesStart =
    T.darkPause;
  const edgesStart = nodesStart + T.edgeStartOffset;
  const facesStart = edgesStart + T.faceStartOffset;
  const buildEnd =
    facesStart + TRIANGLES.length * T.faceStagger + T.faceDuration;
  const baseRectRef = useRef(null);

  useEffect(() => {
    // Capture the wrapper's natural (untransformed, centered) rect once,
    // before any flight animation moves/scales it — getBoundingClientRect()
    // reflects the live transform, so measuring later would compound with
    // whatever offset/scale is already applied.
    if (wrapRef.current) {
      baseRectRef.current = wrapRef.current.getBoundingClientRect();
    }

    const timers = [];
    timers.push(setTimeout(() => setPhase("building"), T.darkPause));

    timers.push(
      setTimeout(() => {
        setPhase("hold");
      }, buildEnd)
    );

    timers.push(
      setTimeout(() => {
        setPhase("flyRight");
        setFlight({ x: window.innerWidth * 0.85, y: -window.innerHeight * 0.08, scale: 1.1, opacity: 0 });
      }, buildEnd + T.holdDuration)
    );

    timers.push(
      setTimeout(() => {
        // Reposition instantly off-screen to the left, small and far away,
        // then fly in toward the header logo.
        setPhase("reposition");
        setFlight({ x: -window.innerWidth * 0.85, y: window.innerHeight * 0.05, scale: 0.3, opacity: 0 });

        requestAnimationFrame(() => {
          const elRect = baseRectRef.current;
          const target = targetRef?.current;
          if (!elRect || !target) {
            setPhase("done");
            onComplete?.();
            return;
          }
          const elCenterX = elRect.left + elRect.width / 2;
          const elCenterY = elRect.top + elRect.height / 2;
          const targetRect = target.getBoundingClientRect();
          const targetCenterX = targetRect.left + targetRect.width / 2;
          const targetCenterY = targetRect.top + targetRect.height / 2;

          setPhase("flyIn");
          setFlight({
            x: targetCenterX - elCenterX,
            y: targetCenterY - elCenterY,
            scale: targetRect.width / elRect.width,
            opacity: 1,
          });
        });
      }, buildEnd + T.holdDuration + T.flyRightDuration)
    );

    timers.push(
      setTimeout(() => {
        setPhase("settle");
        onComplete?.();
      }, buildEnd + T.holdDuration + T.flyRightDuration + T.flyInDuration)
    );

    timers.push(
      setTimeout(() => {
        setPhase("done");
      }, buildEnd + T.holdDuration + T.flyRightDuration + T.flyInDuration + T.settleFade)
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const building = phase !== "dark";

  if (phase === "done") return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "var(--color-navy)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
      animate={{ opacity: phase === "settle" ? 0 : 1 }}
      transition={{ duration: T.settleFade / 1000, ease: "easeInOut" }}
    >
      <motion.div
        ref={wrapRef}
        style={{ width: 260, height: 162.5 }}
        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        animate={
          phase === "flyRight"
            ? flight
            : phase === "reposition"
            ? { ...flight, transition: { duration: 0 } }
            : phase === "flyIn"
            ? flight
            : { x: 0, y: 0, scale: 1, opacity: 1 }
        }
        transition={{
          duration:
            phase === "flyRight"
              ? T.flyRightDuration / 1000
              : phase === "flyIn"
              ? T.flyInDuration / 1000
              : 0,
          ease: phase === "flyRight" ? "easeIn" : "easeOut",
        }}
      >
        <svg viewBox={VIEWBOX} width="100%" height="100%">
          <defs>
            <linearGradient id="intro-face" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-blue)" />
              <stop offset="100%" stopColor="var(--color-teal)" />
            </linearGradient>
          </defs>

          {TRIANGLES.map(([a, b, c], i) => {
            const [ax, ay] = NODES[a];
            const [bx, by] = NODES[b];
            const [cx, cy] = NODES[c];
            return (
              <motion.polygon
                key={i}
                points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
                fill="url(#intro-face)"
                initial={{ opacity: 0 }}
                animate={{ opacity: building ? 0.4 : 0 }}
                transition={{
                  delay: (facesStart + i * T.faceStagger) / 1000,
                  duration: T.faceDuration / 1000,
                }}
              />
            );
          })}

          {EDGES.map(([a, b], i) => {
            const [ax, ay] = NODES[a];
            const [bx, by] = NODES[b];
            const length = dist([ax, ay], [bx, by]);
            return (
              <motion.line
                key={i}
                x1={ax}
                y1={ay}
                x2={bx}
                y2={by}
                stroke="var(--color-teal)"
                strokeWidth="1.5"
                style={{ strokeDasharray: length }}
                initial={{ strokeDashoffset: length, opacity: 0 }}
                animate={{
                  strokeDashoffset: building ? 0 : length,
                  opacity: building ? 0.9 : 0,
                }}
                transition={{
                  delay: (edgesStart + i * T.edgeStagger) / 1000,
                  duration: T.edgeDuration / 1000,
                  ease: "easeInOut",
                }}
              />
            );
          })}

          {ALL_POINTS.map(({ key, pos: [x, y] }, i) => (
            <motion.circle
              key={key}
              cx={x}
              cy={y}
              r={key === "n-eyeDot" ? 5 : 3}
              fill={key === "n-eyeDot" ? "var(--color-blue)" : "var(--color-teal)"}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: building ? 1 : 0, scale: building ? 1 : 0 }}
              transition={{
                delay: (nodesStart + i * T.nodeStagger) / 1000,
                duration: T.nodeDuration / 1000,
                ease: "backOut",
              }}
            />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
}
