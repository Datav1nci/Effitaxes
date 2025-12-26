"use client";

import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";
import { useLanguage } from "@/context/LanguageContext";
import BrandName from "@/components/BrandName";

export default function ProjectsSection() {
  const { t, language } = useLanguage();
  return (
    <section id="projets" className="bg-background text-foreground py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-promethean tracking-tight sm:text-4xl">
            <BrandName />
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-gray-300" suppressHydrationWarning>
            {t.projects.title}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-6 sm:p-8 dark:bg-gray-950/40">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                title={language === "en" ? project.titleEn : project.title}
                img={project.img}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
