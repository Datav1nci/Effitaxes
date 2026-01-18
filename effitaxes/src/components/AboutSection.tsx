import Image from "next/image";
import BrandName from "@/components/BrandName";
import { Dictionary } from "@/lib/dictionary";
import Link from "next/link";

export default function AboutSection({ t, isTeaser = false }: { t: Dictionary; isTeaser?: boolean }) {
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
          {!isTeaser && (
            <p suppressHydrationWarning>
              {t.about.p2}
            </p>
          )}
          {isTeaser && (
            <Link href="/about" className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
              {t.about.more}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}