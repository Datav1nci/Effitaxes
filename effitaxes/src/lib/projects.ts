export interface Project {
    slug: string;
    title: string;
    img: string;
    description?: string;
}

export const projects: Project[] = [
    {
        slug: "impots",
        title: "Déclaration d'impôts",
        img: "/images/projet1.webp",
        description: "Service complet de déclaration d'impôts pour particuliers et entreprises. Nous nous assurons que vous bénéficiez de toutes les déductions et crédits auxquels vous avez droit.",
    },
    {
        slug: "optimisation-fiscale",
        title: "Optimisation fiscale",
        img: "/images/projet2.webp",
        description: "Stratégies personnalisées pour minimiser votre charge fiscale légalement. Planification à long terme pour préserver et faire croître votre patrimoine.",
    },
    {
        slug: "gestion-paie-pme",
        title: "Gestion paie PME",
        img: "/images/projet3.webp",
        description: "Gestion externalisée de la paie pour les PME. Calculs précis, remises gouvernementales et relevés de fin d'année, le tout dans le respect des délais.",
    },
    {
        slug: "declarations-tps-tvq",
        title: "Déclarations TPS/TVQ",
        img: "/images/projet4.webp",
        description: "Préparation et transmission de vos rapports de taxes de vente. Suivi rigoureux pour éviter les pénalités et assurer la conformité de votre entreprise.",
    },
];
