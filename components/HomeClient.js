"use client";

import Link from "next/link";
import NetworkBackground from "@/components/NetworkBackground";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomeClient() {
  return (
    <>
      <NetworkBackground
        config={{ glow: true, bgBlob: true, nodeAreaDivisor: 22000, speed: 3.6 }}
      />

      <div className="page-surface">
        <header className="site-header">
          <Link href="/" className="brand">
            <img
              src="/percolia-wordmark.svg"
              alt="Percolia"
              className="wordmark wordmark-dark"
            />
            <img
              src="/percolia-wordmark-light.svg"
              alt="Percolia"
              className="wordmark wordmark-light"
            />
          </Link>
          <div className="header-actions">
            <nav>
              <Link href="/" className="active">
                Accueil
              </Link>
              <Link href="/contact">Contact</Link>
            </nav>
            <ThemeToggle />
          </div>
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
