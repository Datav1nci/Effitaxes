"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import BrandName from "@/components/BrandName";

export default function Header() {
  const { t, language, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => setMounted(true), []);

  const links = [
    { href: "/#hero", label: t.nav.home },
    { href: "/#services", label: t.nav.services },
    { href: "/#projets", label: t.nav.projects },
    { href: "/#apropos", label: t.nav.about },
    { href: "/#contact", label: t.nav.contact },
  ];

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
          className="text-2xl font-promethean tracking-wide text-slate-900 dark:text-white"
        >
          <BrandName />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-gray-800"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5 text-slate-700 dark:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700 dark:text-gray-300" />
            )}
          </button>
          <button
            onClick={toggleLanguage}
            className="rounded-full px-3 py-1 text-sm font-medium border border-gray-300 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-gray-800"
          >
            {language.toUpperCase()}
          </button>
        </nav>

        {/* Mobile Actions: Language & Theme Toggles + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLanguage}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle Language"
          >
            <span className="flex items-center justify-center font-bold text-sm h-5 w-5">
              {language.toUpperCase()}
            </span>
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-slate-700 hover:bg-gray-50 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="md:hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-4 py-2">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
