import Link from "next/link";
import NetworkBackground from "@/components/NetworkBackground";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "Contact — Percolia",
};

export default async function ContactPage({ searchParams }) {
  const { status } = await searchParams;

  return (
    <div className="page-surface">
      <NetworkBackground
        config={{ glow: true, bgBlob: true, nodeAreaDivisor: 22000, speed: 3.6 }}
      />
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
            <Link href="/">Accueil</Link>
            <Link href="/contact" className="active">
              Contact
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main>
        <section className="hero">
          <h1 className="text">Contact</h1>
          <p className="tagline">Une question ? Écrivez-nous.</p>
        </section>

        {status === "success" && (
          <p className="form-status form-status-success" role="status">
            Merci, votre message a bien été envoyé.
          </p>
        )}
        {status === "error" && (
          <p className="form-status form-status-error" role="alert">
            L’envoi a échoué. Vérifiez les champs ou réessayez plus tard.
          </p>
        )}

        <form action="/api/contact" method="post">
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="website">Site web</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              maxLength={100}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              maxLength={254}
              required
            />
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              maxLength={5000}
              required
            />
          </div>
          <button type="submit" className="submit">
            Envoyer
          </button>
        </form>
      </main>

      <footer>
        <Link href="/contact">Contact</Link>
        <p>&copy; 2026 Percolia. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
