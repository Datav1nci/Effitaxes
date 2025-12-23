"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative flex min-h-[80vh] flex-col items-center justify-center text-center bg-background text-foreground overflow-hidden"
    >
      {/* Subtle background (much lighter in light mode) */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(900px_circle_at_50%_20%,rgba(37,99,235,0.10),transparent_55%)]
          dark:bg-[radial-gradient(900px_circle_at_50%_20%,rgba(37,99,235,0.20),transparent_55%)]
        "
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
        >
          Effitaxes : Dédié à l’excellence en services comptables et financiers.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          viewport={{ once: true }}
          className="
            mx-auto mb-8 max-w-2xl text-pretty text-lg md:text-xl
            text-slate-700 dark:text-gray-300
          "
        >
          Des solutions personnalisées et sur mesure pour les particuliers, les
          entreprises et travailleurs autonomes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-center"
        >
          <Link
            href="#contact"
            className="
              inline-flex items-center justify-center rounded-full px-8 py-3 font-medium
              bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
              dark:focus-visible:ring-offset-gray-950
            "
          >
            Contactez-nous
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
