import { Wrench, Building, HardHat } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";

const data = [
  {
    title: "Experts comptables",
    icon: <Building size={32} />,
    description:
      "Tenue de livres, analyse financière et optimisation fiscale pour assurer une gestion comptable solide.",
  },
  {
    title: "Gestion de la paie",
    icon: <Wrench size={32} />,
    description:
      "Planification et exécution précises des paies et déclarations pour respecter les obligations légales.",
  },
  {
    title: "Consultation",
    icon: <HardHat size={32} />,
    description:
      "Accompagnement et conseils stratégiques pour les particuliers et les PME.",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-background text-foreground py-20"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Nos services
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-gray-300">
            Des solutions claires, conformes et adaptées à votre réalité.
          </p>
        </div>

        {/* Soft surface behind the cards for consistent contrast */}
        <div className="rounded-2xl bg-gray-50 p-6 sm:p-8 dark:bg-gray-950/40">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((card) => (
              <ServiceCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
