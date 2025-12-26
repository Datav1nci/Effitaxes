"use client";

import BrandName from "@/components/BrandName";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-50 text-slate-700 py-10 border-t border-gray-200 dark:bg-gray-950/40 dark:text-gray-300 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-slate-600 dark:text-gray-400" suppressHydrationWarning>
          © 2026 <BrandName className="text-base" />. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
