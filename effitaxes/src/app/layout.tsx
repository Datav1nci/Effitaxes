import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";       // ⬅ placé dans src/styles
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Effitaxes – Comptabilité à Montréal",
  description: "Comptabilité et gestion financière partout au Québec.",
  keywords: ["comptabilité", "finance", "gestion", "Montréal", "effitaxes", "paies", "paie", "travailleurs autonomes", "déclarations fiscales", "impôts", "tenue de livres", "comptabilité d'entreprise", "consultation fiscale", "planification fiscale", "déductions d'impôt", "TPS", "TVQ", "rapports financiers", "audit", "conseils financiers", "gestion de paie", "comptabilité pour PME", "services comptables", "expertise comptable", "déclarations de revenus", "optimisation fiscale"],
  authors: [{ name: "Effitaxes Experts-Comptables" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} scroll-smooth`}>
      <body className="antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header />
        <main className="mx-auto max-w-7xl px-4">{children}</main>
        <Footer />     
      </body>
    </html>
  );
}
