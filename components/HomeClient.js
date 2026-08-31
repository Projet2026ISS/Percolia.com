"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BirdMark from "@/components/BirdMark";
import IntroSequence from "@/components/IntroSequence";
import NetworkBackground from "@/components/NetworkBackground";

const SESSION_KEY = "percolia-intro-played";

export default function HomeClient() {
  const logoRef = useRef(null);
  const [showIntro, setShowIntro] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadyPlayed = window.sessionStorage.getItem(SESSION_KEY);

    if (reducedMotion || alreadyPlayed) {
      setRevealed(true);
    } else {
      setShowIntro(true);
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
    setReady(true);
  }, []);

  return (
    <>
      {ready && showIntro && (
        <IntroSequence
          targetRef={logoRef}
          onComplete={() => setRevealed(true)}
        />
      )}

      <NetworkBackground
        config={{ glow: true, bgBlob: true, nodeAreaDivisor: 22000, speed: 3.6 }}
      />

      <div
        className="page-surface"
        style={{ opacity: revealed ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        <header className="site-header">
          <Link href="/" className="brand">
            <img
              src="/percolia-wordmark.svg"
              alt="Percolia"
              className="wordmark"
            />
            <span ref={logoRef} style={{ display: "inline-flex" }}>
              <BirdMark width={44} height={33} />
            </span>
          </Link>
          <nav>
            <Link href="/" className="active">
              Accueil
            </Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>

        <main className="hero-center">
          <h1 className="visually-hidden">Percolia</h1>
          <p className="tagline">
            Percolia structure automatiquement vos données massives et
            bruitées, plus finement que les méthodes actuelles, pour en
            extraire les structures qui comptent.
          </p>
        </main>

        <div className="bottom-block">
          <div className="cta-bottom">
            <Link href="/contact" className="button">
              Nous contacter
            </Link>
          </div>

          <footer>
            <Link href="/contact">Contact</Link>
            <p>&copy; 2026 Percolia. Tous droits réservés.</p>
          </footer>
        </div>
      </div>
    </>
  );
}
