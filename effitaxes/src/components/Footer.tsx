import Link from "next/link";

const links = [
  { label: "Accueil", href: "#accueil" },
  { label: "Services", href: "#services" },
  { label: "Projets", href: "#projets" },
  { label: "À propos", href: "#apropos" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-slate-700 py-10 border-t border-gray-200 dark:bg-gray-950/40 dark:text-gray-300 dark:border-gray-800">
      <div className="mx-auto max-w-7xl grid gap-8 px-4 md:grid-cols-2">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Effitaxes
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
            © 2025 Effitaxes. Tous droits réservés.
          </p>
        </div>

        <nav className="flex flex-col gap-2 md:items-end">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
