"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="accueil"
      className="flex min-h-[80vh] flex-col items-center justify-center text-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900"
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mb-4 px-4 text-4xl font-extrabold sm:text-5xl md:text-6xl"
      >
        Effitaxes : Dédié à l’excellence en services comptables et financiers.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        viewport={{ once: true }}
        className="mb-8 max-w-2xl px-6 text-lg md:text-xl"
      >
        Des solutions personnalisée et sur mesure pour les particuliers, les entreprises et travailleurs autonomes.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Link
          href="#contact"
          className="rounded-full bg-blue-600 px-8 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          Contactez-nous
        </Link>
      </motion.div>
    </section>
  );
}
