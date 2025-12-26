export interface Project {
    slug: string;
    title: string;
    titleEn: string;
    img: string;
    description?: string;
    descriptionEn?: string;
}

export const projects: Project[] = [
    {
        slug: "impots",
        title: "Déclaration d'impôts",
        titleEn: "Tax Returns",
        img: "/images/projet1.webp",
        description:
            "Nous prenons en charge la préparation complète de vos déclarations de revenus (personnelles et sociétés). Nous analysons votre situation pour maximiser vos retours et nous assurer que vous profitiez de tous les crédits d'impôt auxquels vous avez droit.",
        descriptionEn:
            "We handle the complete preparation of your tax returns (personal and corporate). We analyze your situation to maximize your returns and ensure you take advantage of all the tax credits you are entitled to.",
    },
    {
        slug: "fiscalite",
        title: "Optimisation fiscale",
        titleEn: "Tax Optimization",
        img: "/images/projet2.webp",
        description:
            "Notre équipe vous aide à structurer vos finances pour réduire votre charge fiscale légalement. Que vous soyez un particulier ou une entreprise, nous élaborons des stratégies sur mesure pour préserver votre patrimoine.",
        descriptionEn:
            "Our team helps you structure your finances to legally reduce your tax burden. Whether you are an individual or a business, we develop tailored strategies to preserve your wealth.",
    },
    {
        slug: "comptabilite",
        title: "Gestion de livres (PME)",
        titleEn: "Bookkeeping (SME)",
        img: "/images/projet3.webp",
        description:
            "Confiez-nous la tenue de vos livres comptables. Nous assurons un suivi rigoureux de vos revenus et dépenses, la conciliation bancaire et la production de rapports financiers périodiques pour vous aider à prendre des décisions éclairées.",
        descriptionEn:
            "Entrust us with your bookkeeping. We ensure rigorous tracking of your income and expenses, bank reconciliation, and the production of periodic financial reports to help you make informed decisions.",
    },
    {
        slug: "demarrage",
        title: "Démarrage d'entreprise",
        titleEn: "Business Start-up",
        img: "/images/projet4.webp",
        description:
            "Vous lancez votre entreprise ? Nous vous accompagnons dans le choix de la forme juridique, l'inscription aux fichiers de taxes (TPS/TVQ) et la mise en place de votre structure comptable initiale.",
        descriptionEn:
            "Starting your business? We assist you in choosing the legal form, registering for tax files (GST/QST), and setting up your initial accounting structure.",
    },
];
