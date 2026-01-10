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
            <Link href="/about" className="mt-4 inline-block rounded-full bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition">
              {t.about.more}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}