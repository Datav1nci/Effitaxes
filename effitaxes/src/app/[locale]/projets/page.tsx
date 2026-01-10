import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import { dictionary } from "@/lib/dictionary";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const lang = locale === "en" ? "en" : "fr";
    const t = dictionary[lang];

    return (
        <main>
            <ProjectsSection t={t} lang={lang} isTeaser={false} />
            <ContactSection t={t} />
        </main>
    );
}
