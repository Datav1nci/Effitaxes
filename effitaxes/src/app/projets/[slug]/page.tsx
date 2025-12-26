import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import ContactSection from "@/components/ContactSection";
import ProjectDetails from "@/components/ProjectDetails";

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
        <div className="min-h-screen bg-background text-foreground">
            <ProjectDetails project={project} />
            <ContactSection />
        </div>
    );
}
