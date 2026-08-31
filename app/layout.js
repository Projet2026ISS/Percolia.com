import { Sora, Inter } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-sora",
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
    <html lang="fr" className={`${sora.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
