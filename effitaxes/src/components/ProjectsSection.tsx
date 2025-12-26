"use client";

import ProjectCard from "@/components/ProjectCard";

import { projects } from "@/lib/projects";

export default function ProjectsSection() {
  return (
    <section id="projets" className="bg-background text-foreground py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-promethean tracking-tight sm:text-4xl">
            Effita{"><"}es
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-gray-300">
            Un aperçu de nos services et accompagnements.
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-6 sm:p-8 dark:bg-gray-950/40">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.slug} {...p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
