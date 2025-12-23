"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";

const links = [
  { href: "#accueil", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "#projets", label: "Projets" },
  { href: "#apropos", label: "À propos" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    // If not mounted yet, do nothing to avoid hydration mismatch
    if (!mounted) return;
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide text-slate-900 dark:text-white"
        >
          Effitaxes
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white transition"
            >
              {l.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Basculer le thème"
            className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-slate-700 hover:bg-gray-50 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {/* Prevent icon mismatch on first render */}
            {mounted ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : null}
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-slate-700 hover:bg-gray-50 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="md:hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-4 py-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-slate-700 hover:bg-gray-50 hover:text-slate-900 transition dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
              >
                {l.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={toggleTheme}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-slate-700 hover:bg-gray-50 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {mounted ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : null}
              <span>{isDark ? "Mode clair" : "Mode sombre"}</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
