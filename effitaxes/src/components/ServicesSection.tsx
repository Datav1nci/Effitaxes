import { Wrench, Building, HardHat } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";

const data = [
  {
    title: "Experts Comptables",
    icon: <Building size={32} />,
    description:
      "Tenue de livres, analyse financière et optimisation fiscale pour assurer une gestion comptable solide.",
  },
  {
    title: "Gestion de projets",
    icon: <Wrench size={32} />,
    description:
      "Planification et exécution précises des paies et déclarations pour respecter les obligations légales.",
  },
  {
    title: "Développement immobilier",
    icon: <HardHat size={32} />,
    description:
      "Accompagnement et conseils stratégiques pour les particuliers et les PME",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20">
      <h2 className="mb-12 text-center text-3xl font-bold">Nos services</h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((card) => (
          <ServiceCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
