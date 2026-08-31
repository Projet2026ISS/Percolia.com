"use client";

import { useEffect, useRef } from "react";

let scriptPromise = null;
function loadAnimationScript() {
  if (typeof window.initPercoliaDirectionalScene === "function") {
    return Promise.resolve();
  }
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/brand/bird-animation.js";
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return scriptPromise;
}

/**
 * Embeds the canonical Percolia flight scene (Logo/Oiseau, brother's brand
 * kit at github.com/Ludwig-H/Percolia/tree/main/Logo): the wordmark with a
 * bird perched on the P, which takes off, exits right, and a second bird
 * lands back on the P. Plays once per mount using the original clip-based
 * animation engine (bird-animation.js), untouched.
 */
export default function FlightStage({ className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let controller = null;

    async function setup() {
      const res = await fetch("/brand/flight-stage.svg");
      const markup = await res.text();
      if (cancelled || !containerRef.current) return;
      containerRef.current.innerHTML = markup;

      await loadAnimationScript();
      if (cancelled || !containerRef.current) return;

      const stage = containerRef.current.querySelector("[data-flight-stage]");
      const perched = containerRef.current.querySelector("[data-perched-bird]");
      const outboundGroup = containerRef.current.querySelector(
        '[data-flight-bird="outbound"]'
      );
      const inboundGroup = containerRef.current.querySelector(
        '[data-flight-bird="inbound"]'
      );
      if (!stage || !perched || !outboundGroup || !inboundGroup) return;

      controller = window.initPercoliaDirectionalScene({
        stage,
        perched,
        outboundGroup,
        inboundGroup,
        autoplay: true,
      });
    }

    setup();

    return () => {
      cancelled = true;
      controller?.pause?.();
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
