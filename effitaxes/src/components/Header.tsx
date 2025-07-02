"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";

const links = [
  { href: "#accueil", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "#projets", label: "Projets" },
  { href: "#apropos", label: "À Propos" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
 
    useEffect(() => {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      }
    }, []);
  
  const toggleDarkMode = () => {
  if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
  } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
  }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
         <Link href="/" className="text-2xl font-bold tracking-wide">
         Effitaxes
        </Link>
        
        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary">
              {l.label}
            </Link>
          ))}
       <button onClick={toggleDarkMode} className="ml-4 text-gray-600 dark:text-gray-300">
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        </nav>  

        {/* Mobile hamburger */}
        <button
          aria-label="Ouvrir le menu"
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="md:hidden bg-white dark:bg-gray-950 border-t dark:border-gray-800">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {l.label}
            </Link>
          ))}
        <button onClick={toggleDarkMode} className="ml-4 text-gray-600 dark:text-gray-300">
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        </nav>
      )}
    </header>
  );
}
