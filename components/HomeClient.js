"use client";

import Link from "next/link";
import FlightStage from "@/components/FlightStage";

export default function HomeClient() {
  return (
    <div className="page-surface">
      <header className="site-header">
        <Link href="/" className="brand">
          <img src="/brand/percolia-bird-compact.svg" alt="" className="brand-mark" />
          <span className="brand-name">Percolia</span>
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
          <h1 className="visually-hidden">Percolia</h1>
          <FlightStage className="flight-stage" />
          <p className="tagline">
            Percolia transforme automatiquement des données massives et
            désordonnées en structures exploitables.
          </p>
          <Link href="/contact" className="button">
            Nous contacter
          </Link>
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
  );
}
