import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({
  slug,
  title,
  img,
}: {
  slug: string;
  title: string;
  img: string;
}) {
  return (
    <Link
      href={`/projets/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition"
    >
      <Image
        src={img}
        alt={title}
        width={800}
        height={600}
        className="h-56 w-full object-cover transition group-hover:scale-105"
        quality={80}
        placeholder="blur"
        blurDataURL="/images/placeholder.webp"
      />
      <div className="p-4 bg-white dark:bg-gray-900">
        <h3 className="font-semibold">{title}</h3>
      </div>
    </Link>
  );
}
