import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="apropos" className="py-20">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-center">
        <Image
          src="/images/equipe.webp"
          alt="Équipe effitaxes"
          width={600}
          height={400}
          className="rounded-lg shadow-md"
        />

        <div>
          <h2 className="mb-4 text-3xl font-bold">À propos d’<span className="font-promethean">Effita{"><"}es</span></h2>
          <p className="mb-4">
            Basée sur la rive-sud de Montréal, Effitaxes est un cabinet comptable dédié à l’excellence en services financiers.
            Notre mission : soutenir nos clients dans la gestion comptable et fiscale avec professionnalisme et fiabilité.
          </p>
          <p>
            Grâce à une approche personnalisée, nous offrons des solutions sur mesure incluant
            la tenue de livres, les déclarations d’impôts, la gestion de paie et la planification financière
            pour les pariculiers, les entreprises et travailleurs autonomes.
          </p>
        </div>
      </div>
    </section>
  );
}