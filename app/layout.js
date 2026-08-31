import { Fredoka, Inter } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Percolia",
  description:
    "Percolia transforme automatiquement des données massives et désordonnées en structures exploitables.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${fredoka.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
