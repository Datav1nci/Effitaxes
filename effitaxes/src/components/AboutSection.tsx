"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import BrandName from "@/components/BrandName";

export default function AboutSection() {
  const { t } = useLanguage();
  return (
    <section id="apropos" className="py-20">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-center">
        <Image
          src="/images/equipe.webp"
          alt="Équipe effitaxes"
          width={600}
          height={400}
          className="rounded-lg shadow-md"
        />

        <div>
          <h2 className="mb-4 text-3xl font-bold" suppressHydrationWarning>{t.about.title} <BrandName /></h2>
          <p className="mb-4" suppressHydrationWarning>
            {t.about.p1}
          </p>
          <p suppressHydrationWarning>
            {t.about.p2}
          </p>
        </div>
      </div>
    </section>
  );
}