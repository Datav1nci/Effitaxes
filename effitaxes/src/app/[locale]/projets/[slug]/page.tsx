import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import ContactSection from "@/components/ContactSection";
import ProjectDetails from "@/components/ProjectDetails";
import { dictionary } from "@/lib/dictionary";

export function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
    const { locale, slug } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    const lang = locale === "en" ? "en" : "fr";
    const t = dictionary[lang];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <ProjectDetails project={project} />
            <ContactSection t={t} />
        </div>
    );
}
