import Link from "next/link";
import Image from "next/image";

export default function ProjectCard({
  slug,
  title,
  img,
  moreLabel,
}: {
  slug: string;
  title: string;
  img: string;
  moreLabel: string;
}) {
  return (
    <Link
      href={`/projets/${slug}`}
      className="
        group flex flex-col overflow-hidden rounded-xl
        bg-white text-slate-900
        border border-gray-200
        shadow-sm hover:shadow-md transition
        dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950
      "
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          quality={80}
          placeholder="blur"
          blurDataURL="/images/placeholder.webp"
          suppressHydrationWarning
        />
        {/* subtle overlay to keep titles readable if you add text later */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>

      <div className="p-4">
        <h3 className="font-semibold tracking-tight" suppressHydrationWarning>{title}</h3>

      </div>
    </Link>
  );
}
