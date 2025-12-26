import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import { ArrowLeft } from "lucide-react";
import ContactSection from "@/components/ContactSection";

export function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-20">
            <div className="mx-auto max-w-7xl px-4">
                <Link
                    href="/#projets"
                    className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour aux projets
                </Link>

                <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                        <Image
                            src={project.img}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
                            {project.title}
                        </h1>
                        <p className="text-lg text-slate-700 dark:text-gray-300 leading-relaxed">
                            {project.description || "Détails à venir pour ce service."}
                        </p>
                        <div className="mt-8">
                            <Link
                                href="/#contact"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            >
                                Nous contacter
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <ContactSection />
        </div>
    );
}
