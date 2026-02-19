"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Moon, Sun, X, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import BrandName from "@/components/BrandName";
import { createClient } from "@/utils/supabase/client";
import { signOut } from "@/actions/auth";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({ initialUser }: { initialUser?: User | null }) {
  const { t, language, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser || null);
  const router = useRouter();

  const { theme, setTheme, resolvedTheme } = useTheme();



  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    // Check active session on mount to ensure client-side state is accurate
    // This overrides potential stale initialUser from server if they differ
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user !== initialUser) {
        setUser(user);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_OUT') {
        setUser(null);
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    await signOut(); // Server action
    router.refresh();
  };

  const links = [
    { href: `/${language}/#hero`, label: t.nav.home },
    { href: `/${language}/#services`, label: t.nav.services },
    { href: `/${language}/projets`, label: t.nav.projects },
    { href: `/${language}/about`, label: t.nav.about },
    { href: `/${language}/contact`, label: t.nav.contact },
  ];

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "dark" || resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          href={`/${language}`}
          className="text-2xl font-promethean tracking-wide text-slate-900 dark:text-white"
        >
          <BrandName />
        </Link>
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
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-gray-800"
          >
            {mounted && (theme === "dark" || resolvedTheme === "dark") ? (
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

          {mounted && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700">
                    <span className="font-medium text-sm">
                      {user.user_metadata?.first_name
                        ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name?.[0] || ''}`.toUpperCase()
                        : user.email?.[0].toUpperCase()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.first_name
                          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
                          : 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${language}/dashboard`}>{t.auth.dashboard}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t.auth.signOut}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={`/${language}/login`}>
                <Button variant="outline" size="sm">{t.auth.signIn}</Button>
              </Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLanguage}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span className="flex items-center justify-center font-bold text-sm h-5 w-5">
              {language.toUpperCase()}
            </span>
          </button>
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {mounted && (theme === "dark" || resolvedTheme === "dark") ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-slate-700 hover:bg-gray-50 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
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
            {/* Mobile Auth Links */}
            {mounted && (
              user ? (
                <>
                  <Link
                    href={`/${language}/dashboard`}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Dashboard ({user.email})
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-slate-100 dark:text-red-400 dark:hover:bg-gray-800"
                  >
                    {t.auth.signOut}
                  </button>
                </>
              ) : (
                <Link
                  href={`/${language}/login`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
