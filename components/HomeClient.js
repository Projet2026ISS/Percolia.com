"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BirdMark from "@/components/BirdMark";
import IntroSequence from "@/components/IntroSequence";

const SESSION_KEY = "percolia-intro-played";

// Temporary size x thickness comparison panel.
// Remove this block (and public/brand-variants/) once a cell is chosen.
const PANEL_STROKES = [16, 20, 24, 28];
const PANEL_SIZES = [28, 36, 44];

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

          <section id="wordmark-panel">
            <h2>Panel taille × épaisseur (temporaire)</h2>
            <p>Donne-moi la cellule (ex. "épaisseur 24, taille 36").</p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.5rem" }}></th>
                    {PANEL_SIZES.map((size) => (
                      <th
                        key={size}
                        style={{
                          textAlign: "left",
                          padding: "0.5rem",
                          color: "var(--color-slate)",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        taille {size}px
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PANEL_STROKES.map((stroke) => (
                    <tr key={stroke}>
                      <td
                        style={{
                          padding: "0.5rem",
                          color: "var(--color-slate)",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        épaisseur {stroke}
                      </td>
                      {PANEL_SIZES.map((size) => (
                        <td
                          key={size}
                          style={{
                            padding: "0.75rem",
                            borderTop: "1px solid rgba(8, 44, 76, 0.1)",
                          }}
                        >
                          <img
                            src={`/brand-variants/stroke-${stroke}.svg`}
                            alt={`épaisseur ${stroke}, taille ${size}`}
                            style={{ height: `${size}px`, width: "auto" }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
