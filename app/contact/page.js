import Link from "next/link";
import BirdMark from "@/components/BirdMark";
import Wordmark from "@/components/Wordmark";

export const metadata = {
  title: "Contact — Percolia",
};

export default function ContactPage() {
  return (
    <div className="page-surface">
      <header className="site-header">
        <Link href="/" className="brand">
          <BirdMark width={40} height={25} />
          <span className="brand-name">Percolia</span>
        </Link>
        <nav>
          <Link href="/">Accueil</Link>
          <Link href="/contact" className="active">
            Contact
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>
            <Wordmark text="Contact" height={40} className="wordmark-h1" />
          </h1>
          <p className="tagline">Une question ? Écrivez-nous.</p>
        </section>

        {/*
          Formulaire statique sans backend pour l'instant.
          Brancher un service (Formspree, Netlify Forms, etc.) ou une API
          quand le site sera hébergé.
        */}
        <form>
          <div>
            <label htmlFor="name">Nom</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required />
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
