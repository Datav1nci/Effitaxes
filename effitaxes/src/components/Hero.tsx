"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BrandName from "@/components/BrandName";
import { Dictionary } from "@/lib/dictionary";

export default function Hero({ t }: { t: Dictionary }) {
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-6 text-balance text-4xl tracking-tight sm:text-5xl md:text-6xl"
          suppressHydrationWarning
        >
          <BrandName className="block mb-2 text-5xl sm:text-6xl md:text-7xl" />
          <span className="block text-slate-900 dark:text-white font-medium">
            {t.hero.subtitle}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-8 text-lg text-slate-700 dark:text-gray-300 sm:text-xl"
          suppressHydrationWarning
        >
          {t.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Link
            href="/inscription"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {t.hero.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
