"use client"

import ProjectCard from "@/components/ProjectCard";

const projects = [
  { slug: "impots", title: "Déclaration d'impots", img: "/images/projet1.webp" },
  { slug: "optimisation-fiscale", title: "Optimisation Fiscale", img: "/images/projet2.webp" },
  { slug: "gestion-paie-pme", title: "Gestion Paie PME", img: "/images/projet3.webp" },
  { slug: "declarations-tps-tvq", title: "Déclarations TPS/TVQ", img: "/images/projet4.webp" },
];

export default function ProjectsSection() {
  return (
    <section id="projets" className="py-20 bg-gray-50 dark:bg-gray-900/40">
      <h2 className="mb-12 text-center text-3xl font-bold">Effitaxes</h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.slug} {...p} />
        ))}
      </div>
    </section>
  );
}
