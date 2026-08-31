"use client";

import Link from "next/link";
import NetworkBackground from "@/components/NetworkBackground";

/**
 * Temporary page shell for comparing NetworkBackground presets.
 * Delete app/page-1..page-10/ and this file once a variant is chosen.
 */
export default function TestBgPage({ n, label, config }) {
  return (
    <div className="page-surface">
      <NetworkBackground config={config} />
      <header className="site-header">
        <Link href="/" className="brand">
          <img src="/percolia-wordmark.svg" alt="Percolia" className="wordmark" />
        </Link>
        <nav>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
            <Link key={i} href={`/page-${i}`} className={i === n ? "active" : ""}>
              {i}
            </Link>
          ))}
        </nav>
      </header>

      <main className="hero-center">
        <h1 className="text">Page {n}</h1>
        <p className="tagline">{label}</p>
      </main>
    </div>
  );
}
