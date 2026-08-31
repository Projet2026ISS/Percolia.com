"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BirdMark from "@/components/BirdMark";
import IntroSequence from "@/components/IntroSequence";

const SESSION_KEY = "percolia-intro-played";

// Temporary comparison gallery for picking the final wordmark weight/ratio.
// Remove this block (and public/brand-variants/) once a variant is chosen.
const WORDMARK_VARIANTS = [
  { n: 1, label: "trait 14 · P/reste 0.78 (original brother)" },
  { n: 2, label: "trait 17 · P/reste 0.78 (version actuelle)" },
  { n: 3, label: "trait 20 · P/reste 0.78" },
  { n: 4, label: "trait 12 · P/reste 0.78 (fin)" },
  { n: 5, label: "trait 14 · P/reste 0.65 (P plus dominant)" },
  { n: 6, label: "trait 17 · P/reste 0.65" },
  { n: 7, label: "trait 14 · P/reste 0.90 (P proche du reste)" },
  { n: 8, label: "trait 17 · P/reste 0.90" },
  { n: 9, label: "trait 22 · P/reste 0.72 (très affirmé)" },
  { n: 10, label: "trait 15 · P/reste 1.0 (toutes lettres identiques)" },
];

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

      <div
        className="page-surface"
        style={{ opacity: revealed ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        <header className="site-header">
          <Link href="/" className="brand">
            <span ref={logoRef} style={{ display: "inline-flex" }}>
              <BirdMark width={54} height={34} />
            </span>
            <img src="/percolia-wordmark.svg" alt="Percolia" className="wordmark" />
          </Link>
          <nav>
            <Link href="/" className="active">
              Accueil
            </Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>

        <main>
          <section className="hero">
            <h1>
              <img
                src="/percolia-wordmark.svg"
                alt="Percolia"
                className="wordmark-h1"
              />
            </h1>
            <p className="tagline">
              Percolia transforme automatiquement des données massives et
              désordonnées en structures exploitables.
            </p>
            <Link href="/contact" className="button">
              Nous contacter
            </Link>
          </section>

          <section id="wordmark-gallery">
            <h2>Galerie de variantes du logo (temporaire)</h2>
            <p>
              Choisis un numéro ci-dessous, on gardera uniquement celui-là.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.5rem",
              }}
            >
              {WORDMARK_VARIANTS.map((v) => (
                <div
                  key={v.n}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    padding: "1rem",
                    border: "1px solid rgba(8, 44, 76, 0.12)",
                    borderRadius: "12px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: "var(--color-slate)",
                      width: "2rem",
                    }}
                  >
                    {v.n}
                  </span>
                  <img
                    src={`/brand-variants/variant-${v.n}.svg`}
                    alt={`Variante ${v.n}`}
                    style={{ height: "56px", width: "auto" }}
                  />
                  <span
                    style={{ color: "var(--color-slate)", fontSize: "0.85rem" }}
                  >
                    {v.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Ce que nous faisons</h2>
            <p>
              Nous développons une technologie de clustering 3D pour les
              données LiDAR, destinée aux jumeaux numériques, à la robotique
              et au BTP naval. Elle isole avec précision les structures
              d&rsquo;intérêt dans des nuages de points massifs et bruités.
            </p>
          </section>
        </main>

        <footer>
          <Link href="/contact">Contact</Link>
          <p>&copy; 2026 Percolia. Tous droits réservés.</p>
        </footer>
      </div>
    </>
  );
}
