/**
 * Landing Pages Content - Server Only
 * 
 * This file contains all landing page content and should NEVER be imported
 * by client components to avoid bloating the bundle.
 * 
 * Each page has unique, substantial content to avoid "doorway page" penalties.
 */

export type Language = "fr" | "en";

export type LandingPage = {
    slug: string;
    metadata: {
        title: {
            en: string;
            fr: string;
        };
        description: {
            en: string;
            fr: string;
        };
        keywords: {
            en: string[];
            fr: string[];
        };
    };
    hero: {
        title: {
            en: string;
            fr: string;
        };
        subtitle: {
            en: string;
            fr: string;
        };
    };
    sections: {
        title: {
            en: string;
            fr: string;
        };
        content: {
            en: string[];
            fr: string[];
        };
    }[];
    faq: {
        question: {
            en: string;
            fr: string;
        };
        answer: {
            en: string;
            fr: string;
        };
    }[];
    cta: {
        title: {
            en: string;
            fr: string;
        };
        buttonText: {
            en: string;
            fr: string;
        };
        buttonLink: string;
    };
};

export const landingPages: LandingPage[] = [
    {
        slug: "t1-tax-return-quebec",
        metadata: {
            title: {
                en: "T1 Tax Return Quebec — Expert Federal Tax Filing | Effitaxes",
                fr: "Déclaration T1 Québec — Service de fiscalité fédérale expert | Effitaxes"
            },
            description: {
                en: "Professional T1 federal tax return filing in Quebec. Maximize deductions, ensure CRA compliance, and get your refund faster. Trusted by Quebec residents.",
                fr: "Déclaration d'impôt fédérale T1 professionnelle au Québec. Maximisez vos déductions, assurez la conformité ARC, et obtenez votre remboursement plus rapidement."
            },
            keywords: {
                en: ["T1 tax return", "federal tax Quebec", "CRA tax filing", "Quebec T1", "federal tax return Canada"],
                fr: ["déclaration T1", "impôt fédéral Québec", "déclaration ARC", "T1 Québec", "impôt fédéral Canada"]
            }
        },
        hero: {
            title: {
                en: "Expert T1 Federal Tax Return Filing in Quebec",
                fr: "Service expert de déclaration d'impôt fédérale T1 au Québec"
            },
            subtitle: {
                en: "Maximize your federal tax refund with our CRA-certified accountants. Fast, secure, and accurate T1 filing for Quebec residents.",
                fr: "Maximisez votre remboursement d'impôt fédéral avec nos comptables certifiés ARC. Service T1 rapide, sécurisé et précis pour les résidents du Québec."
            }
        },
        sections: [
            {
                title: {
                    en: "Why Choose Effitaxes for Your T1 Tax Return?",
                    fr: "Pourquoi choisir Effitaxes pour votre déclaration T1?"
                },
                content: {
                    en: [
                        "Filing your T1 federal tax return correctly is essential to maximize your refund and avoid CRA penalties. At Effitaxes, our Quebec-based tax professionals specialize in federal tax compliance for individuals, families, and workers across Montreal and the South Shore.",
                        "We stay current with all CRA regulations and Quebec-specific considerations to ensure your T1 return captures every eligible deduction and credit. Whether you're a salaried employee, self-employed, or have complex income sources, we handle it all."
                    ],
                    fr: [
                        "Produire correctement votre déclaration d'impôt fédérale T1 est essentiel pour maximiser votre remboursement et éviter les pénalités de l'ARC. Chez Effitaxes, nos professionnels fiscaux basés au Québec se spécialisent dans la conformité fiscale fédérale pour les particuliers, les familles et les travailleurs de Montréal et de la Rive-Sud.",
                        "Nous restons à jour avec toutes les réglementations de l'ARC et les considérations spécifiques au Québec pour garantir que votre déclaration T1 capture chaque déduction et crédit admissible. Que vous soyez salarié, travailleur autonome ou ayez des sources de revenus complexes, nous gérons tout."
                    ]
                }
            },
            {
                title: {
                    en: "What's Included in Our T1 Tax Filing Service",
                    fr: "Ce qui est inclus dans notre service de déclaration T1"
                },
                content: {
                    en: [
                        "**Complete T1 Review**: We review all your income sources (employment, investments, benefits) and ensure accurate reporting to the CRA.",
                        "**Deduction Optimization**: We identify all eligible deductions including RRSP contributions, childcare expenses, medical expenses, and moving costs.",
                        "**Tax Credit Maximization**: We apply all federal credits you qualify for, including the Basic Personal Amount, Canada Employment Amount, and disability tax credits.",
                        "**E-filing & Direct Deposit**: Fast electronic filing with the CRA and setup for direct deposit to receive your refund quickly."
                    ],
                    fr: [
                        "**Révision complète T1** : Nous examinons toutes vos sources de revenus (emploi, investissements, prestations) et assurons une déclaration précise à l'ARC.",
                        "**Optimisation des déductions** : Nous identifions toutes les déductions admissibles, y compris les cotisations REER, les frais de garde d'enfants, les frais médicaux et les frais de déménagement.",
                        "**Maximisation des crédits d'impôt** : Nous appliquons tous les crédits fédéraux auxquels vous êtes admissible, y compris le montant personnel de base, le montant canadien pour emploi et les crédits d'impôt pour personnes handicapées.",
                        "**Télétransmission et dépôt direct** : Télétransmission rapide avec l'ARC et configuration du dépôt direct pour recevoir votre remboursement rapidement."
                    ]
                }
            }
        ],
        faq: [
            {
                question: {
                    en: "What documents do I need for my T1 tax return?",
                    fr: "Quels documents ai-je besoin pour ma déclaration T1?"
                },
                answer: {
                    en: "You'll need your T4 slips (employment income), T5 slips (investment income), RRSP contribution receipts, medical expense receipts, and any other income or deduction documentation. We provide a complete checklist when you sign up.",
                    fr: "Vous aurez besoin de vos feuillets T4 (revenus d'emploi), feuillets T5 (revenus de placements), reçus de cotisations REER, reçus de frais médicaux et toute autre documentation de revenus ou déductions. Nous fournissons une liste complète lors de votre inscription."
                }
            },
            {
                question: {
                    en: "How long does T1 filing take?",
                    fr: "Combien de temps prend la déclaration T1?"
                },
                answer: {
                    en: "Most T1 returns are completed within 2-3 business days. We e-file directly with the CRA, and you typically receive your refund via direct deposit within 8-14 days.",
                    fr: "La plupart des déclarations T1 sont complétées en 2-3 jours ouvrables. Nous télétransmettons directement à l'ARC, et vous recevez généralement votre remboursement par dépôt direct dans les 8-14 jours."
                }
            },
            {
                question: {
                    en: "Do I need to file T1 if I also file TP1 in Quebec?",
                    fr: "Dois-je produire T1 si je produis aussi TP1 au Québec?"
                },
                answer: {
                    en: "Yes. In Quebec, you must file both a federal T1 return and a provincial TP1 return. We handle both filings together to ensure consistency and maximize your combined refund.",
                    fr: "Oui. Au Québec, vous devez produire à la fois une déclaration fédérale T1 et une déclaration provinciale TP1. Nous gérons les deux déclarations ensemble pour assurer la cohérence et maximiser votre remboursement combiné."
                }
            }
        ],
        cta: {
            title: {
                en: "Ready to File Your T1 Tax Return?",
                fr: "Prêt à produire votre déclaration T1?"
            },
            buttonText: {
                en: "Get Started →",
                fr: "Commencer →"
            },
            buttonLink: "/inscription"
        }
    },
    {
        slug: "tp1-quebec-tax",
        metadata: {
            title: {
                en: "TP1 Quebec Tax Return — Provincial Tax Filing | Effitaxes",
                fr: "Déclaration TP1 Québec — Service de fiscalité provinciale | Effitaxes"
            },
            description: {
                en: "Expert TP1 provincial tax filing for Quebec residents. Maximize Revenu Québec credits, deductions, and ensure compliance. Fast and secure service.",
                fr: "Service expert de déclaration d'impôt provinciale TP1 pour les résidents du Québec. Maximisez vos crédits Revenu Québec, déductions, et assurez la conformité."
            },
            keywords: {
                en: ["TP1 Quebec", "Quebec provincial tax", "Revenu Quebec", "TP1 tax return", "Quebec tax filing"],
                fr: ["TP1 Québec", "impôt provincial Québec", "Revenu Québec", "déclaration TP1", "fiscalité Québec"]
            }
        },
        hero: {
            title: {
                en: "TP1 Quebec Provincial Tax Return Services",
                fr: "Services de déclaration d'impôt provincial TP1 Québec"
            },
            subtitle: {
                en: "Expert TP1 filing for Quebec residents. Maximize your provincial credits and deductions with Revenu Québec-certified professionals.",
                fr: "Service expert de déclaration TP1 pour résidents du Québec. Maximisez vos crédits et déductions provinciales avec des professionnels certifiés Revenu Québec."
            }
        },
        sections: [
            {
                title: {
                    en: "Quebec TP1 Tax Filing Experts",
                    fr: "Experts en déclaration d'impôt TP1 Québec"
                },
                content: {
                    en: [
                        "Quebec's provincial tax system is unique in Canada. The TP1 return requires specific knowledge of Revenu Québec regulations, provincial credits, and Quebec-only deductions that differ from federal rules.",
                        "Our Effitaxes team specializes in Quebec tax law and stays current with annual changes to ensure you receive every provincial benefit you're entitled to, from the solidarity tax credit to childcare expense deductions."
                    ],
                    fr: [
                        "Le système fiscal provincial du Québec est unique au Canada. La déclaration TP1 nécessite une connaissance spécifique des réglementations de Revenu Québec, des crédits provinciaux et des déductions exclusives au Québec qui diffèrent des règles fédérales.",
                        "Notre équipe Effitaxes se spécialise en droit fiscal québécois et reste à jour avec les changements annuels pour garantir que vous receviez tous les avantages provinciaux auxquels vous avez droit, du crédit d'impôt pour solidarité aux déductions de frais de garde d'enfants."
                    ]
                }
            }
        ],
        faq: [
            {
                question: {
                    en: "What's the difference between T1 and TP1?",
                    fr: "Quelle est la différence entre T1 et TP1?"
                },
                answer: {
                    en: "T1 is your federal tax return filed with the Canada Revenue Agency (CRA). TP1 is your Quebec provincial return filed with Revenu Québec. Quebec is the only province that requires a separate provincial return. We file both for you.",
                    fr: "T1 est votre déclaration d'impôt fédérale produite auprès de l'Agence du revenu du Canada (ARC). TP1 est votre déclaration provinciale québécoise produite auprès de Revenu Québec. Le Québec est la seule province qui exige une déclaration provinciale séparée. Nous produisons les deux pour vous."
                }
            }
        ],
        cta: {
            title: {
                en: "File Your TP1 Quebec Tax Return Today",
                fr: "Produisez votre déclaration TP1 Québec aujourd'hui"
            },
            buttonText: {
                en: "Get Started →",
                fr: "Commencer →"
            },
            buttonLink: "/inscription"
        }
    },
    {
        slug: "self-employed-tax-quebec",
        metadata: {
            title: {
                en: "Self-Employed Tax Quebec — T2125 Filing & Deductions | Effitaxes",
                fr: "Impôt Travailleur Autonome Québec — T2125 et déductions | Effitaxes"
            },
            description: {
                en: "Self-employed tax filing in Quebec. Maximize business deductions, handle T2125, and minimize tax liability. Expert support for freelancers and contractors.",
                fr: "Déclaration d'impôt pour travailleur autonome au Québec. Maximisez vos déductions d'entreprise, gérez T2125 et minimisez votre charge fiscale."
            },
            keywords: {
                en: ["self-employed tax Quebec", "T2125", "freelancer taxes", "business deductions Quebec", "contractor tax"],
                fr: ["impôt travailleur autonome Québec", "T2125", "impôt pigiste", "déductions entreprise Québec", "impôt contractuel"]
            }
        },
        hero: {
            title: {
                en: "Self-Employed Tax Services in Quebec",
                fr: "Services fiscaux pour travailleurs autonomes au Québec"
            },
            subtitle: {
                en: "Specialized tax filing for freelancers, contractors, and self-employed professionals in Quebec. Maximize deductions and minimize tax liability.",
                fr: "Déclaration d'impôt spécialisée pour pigistes, contractuels et travailleurs autonomes au Québec. Maximisez les déductions et minimisez votre charge fiscale."
            }
        },
        sections: [
            {
                title: {
                    en: "Self-Employment Tax Expertise",
                    fr: "Expertise en fiscalité pour travailleurs autonomes"
                },
                content: {
                    en: [
                        "As a self-employed individual in Quebec, you face unique tax challenges: tracking business expenses, understanding CCA depreciation, managing GST/QST registration, and optimizing income splitting strategies.",
                        "Effitaxes specializes in self-employment taxation. We help you complete T2125 (Statement of Business Activities) accurately, claim all eligible business expenses, and structure your finances to minimize tax while staying compliant with CRA and Revenu Québec."
                    ],
                    fr: [
                        "En tant que travailleur autonome au Québec, vous faites face à des défis fiscaux uniques : suivi des dépenses d'entreprise, compréhension de l'amortissement DPA, gestion de l'inscription TPS/TVQ, et optimisation des stratégies de fractionnement du revenu.",
                        "Effitaxes se spécialise en fiscalité pour travailleurs autonomes. Nous vous aidons à compléter T2125 (État des résultats d'entreprise) avec précision, à réclamer toutes les dépenses d'entreprise admissibles, et à structurer vos finances pour minimiser l'impôt tout en restant conforme à l'ARC et Revenu Québec."
                    ]
                }
            }
        ],
        faq: [
            {
                question: {
                    en: "What business expenses can I deduct as self-employed?",
                    fr: "Quelles dépenses d'entreprise puis-je déduire en tant que travailleur autonome?"
                },
                answer: {
                    en: "You can deduct home office expenses, vehicle costs (business portion), supplies, professional fees, advertising, insurance, and more. We provide a comprehensive guide and help you maximize all eligible deductions.",
                    fr: "Vous pouvez déduire les dépenses de bureau à domicile, les coûts de véhicule (portion affaires), les fournitures, les honoraires professionnels, la publicité, l'assurance, et plus. Nous fournissons un guide complet et vous aidons à maximiser toutes les déductions admissibles."
                }
            }
        ],
        cta: {
            title: {
                en: "Optimize Your Self-Employment Taxes",
                fr: "Optimisez vos impôts de travailleur autonome"
            },
            buttonText: {
                en: "Get Started →",
                fr: "Commencer →"
            },
            buttonLink: "/inscription"
        }
    },
    // Placeholder structure for remaining pages (user will provide full content)
    {
        slug: "small-business-bookkeeping",
        metadata: {
            title: {
                en: "Small Business Bookkeeping Quebec — Professional Services | Effitaxes",
                fr: "Tenue de livres PME Québec — Services professionnels | Effitaxes"
            },
            description: {
                en: "Professional bookkeeping services for small businesses in Quebec. Accurate financial records, tax-ready statements, and compliance support.",
                fr: "Services professionnels de tenue de livres pour PME au Québec. Dossiers financiers précis, états prêts pour impôts, et soutien à la conformité."
            },
            keywords: {
                en: ["bookkeeping Quebec", "small business accounting", "financial records", "Quebec SME"],
                fr: ["tenue de livres Québec", "comptabilité PME", "dossiers financiers", "PME Québec"]
            }
        },
        hero: {
            title: {
                en: "Small Business Bookkeeping Services",
                fr: "Services de tenue de livres pour PME"
            },
            subtitle: {
                en: "Keep your small business finances organized and tax-ready. Professional bookkeeping services in Quebec.",
                fr: "Gardez les finances de votre PME organisées et prêtes pour les impôts. Services de tenue de livres professionnels au Québec."
            }
        },
        sections: [],
        faq: [],
        cta: {
            title: {
                en: "Get Professional Bookkeeping Support",
                fr: "Obtenez un soutien professionnel en tenue de livres"
            },
            buttonText: {
                en: "Contact Us →",
                fr: "Contactez-nous →"
            },
            buttonLink: "/contact"
        }
    },
    {
        slug: "incorporation-tax-quebec",
        metadata: {
            title: {
                en: "Corporation Tax Quebec — T2 Filing & Incorporation | Effitaxes",
                fr: "Impôt des sociétés Québec — T2 et incorporation | Effitaxes"
            },
            description: {
                en: "Corporate tax filing and incorporation services in Quebec. T2 returns, tax planning, and business structure optimization.",
                fr: "Services de déclaration d'impôt des sociétés et d'incorporation au Québec. Déclarations T2, planification fiscale, et optimisation de structure d'entreprise."
            },
            keywords: {
                en: ["corporation tax Quebec", "T2 filing", "incorporation Quebec", "corporate tax return"],
                fr: ["impôt société Québec", "déclaration T2", "incorporation Québec", "déclaration impôt société"]
            }
        },
        hero: {
            title: {
                en: "Corporate Tax & Incorporation Services",
                fr: "Services d'impôt des sociétés et d'incorporation"
            },
            subtitle: {
                en: "Expert T2 corporate tax filing and incorporation support for Quebec businesses.",
                fr: "Service expert de déclaration d'impôt des sociétés T2 et soutien à l'incorporation pour entreprises québécoises."
            }
        },
        sections: [],
        faq: [],
        cta: {
            title: {
                en: "Optimize Your Corporate Taxes",
                fr: "Optimisez vos impôts de société"
            },
            buttonText: {
                en: "Get Started →",
                fr: "Commencer →"
            },
            buttonLink: "/inscription"
        }
    },
    {
        slug: "crypto-tax-canada",
        metadata: {
            title: {
                en: "Crypto Tax Canada — Bitcoin, Ethereum & DeFi Taxes | Effitaxes",
                fr: "Impôt Crypto Canada — Bitcoin, Ethereum et fiscalité DeFi | Effitaxes"
            },
            description: {
                en: "Cryptocurrency tax filing for Canadian residents. Expert handling of Bitcoin, Ethereum, DeFi, and NFT transactions. CRA-compliant crypto tax reporting.",
                fr: "Déclaration d'impôt sur les cryptomonnaies pour résidents canadiens. Gestion experte de Bitcoin, Ethereum, DeFi et transactions NFT. Déclaration conforme ARC."
            },
            keywords: {
                en: ["crypto tax Canada", "Bitcoin tax", "cryptocurrency CRA", "DeFi taxes", "NFT tax Canada"],
                fr: ["impôt crypto Canada", "impôt Bitcoin", "cryptomonnaie ARC", "impôt DeFi", "impôt NFT Canada"]
            }
        },
        hero: {
            title: {
                en: "Cryptocurrency Tax Services in Canada",
                fr: "Services fiscaux pour cryptomonnaies au Canada"
            },
            subtitle: {
                en: "Expert crypto tax filing for Bitcoin, Ethereum, DeFi, and NFT transactions. CRA-compliant reporting.",
                fr: "Déclaration d'impôt crypto experte pour Bitcoin, Ethereum, DeFi et transactions NFT. Déclaration conforme ARC."
            }
        },
        sections: [],
        faq: [],
        cta: {
            title: {
                en: "Get Crypto Tax Help",
                fr: "Obtenez de l'aide fiscale crypto"
            },
            buttonText: {
                en: "Contact Us →",
                fr: "Contactez-nous →"
            },
            buttonLink: "/contact"
        }
    },
    {
        slug: "foreign-income-canada",
        metadata: {
            title: {
                en: "Foreign Income Tax Canada — T1135 & International Income | Effitaxes",
                fr: "Impôt revenu étranger Canada — T1135 et revenus internationaux | Effitaxes"
            },
            description: {
                en: "Foreign income tax filing for Canadian residents. T1135 foreign property reporting, US income, and international tax compliance.",
                fr: "Déclaration d'impôt sur revenus étrangers pour résidents canadiens. Déclaration T1135, revenus américains, et conformité fiscale internationale."
            },
            keywords: {
                en: ["foreign income Canada", "T1135", "international tax", "US income Canada", "foreign property"],
                fr: ["revenu étranger Canada", "T1135", "impôt international", "revenu américain Canada", "propriété étrangère"]
            }
        },
        hero: {
            title: {
                en: "Foreign Income & International Tax Services",
                fr: "Services fiscaux pour revenus étrangers et internationaux"
            },
            subtitle: {
                en: "Expert handling of foreign income, T1135 reporting, and international tax compliance for Canadian residents.",
                fr: "Gestion experte de revenus étrangers, déclaration T1135, et conformité fiscale internationale pour résidents canadiens."
            }
        },
        sections: [],
        faq: [],
        cta: {
            title: {
                en: "Navigate Foreign Income Taxes",
                fr: "Naviguez les impôts sur revenus étrangers"
            },
            buttonText: {
                en: "Get Started →",
                fr: "Commencer →"
            },
            buttonLink: "/inscription"
        }
    },
    {
        slug: "rental-income-tax-quebec",
        metadata: {
            title: {
                en: "Rental Income Tax Quebec — Property Tax Filing | Effitaxes",
                fr: "Impôt revenu locatif Québec — Déclaration fiscale immobilier | Effitaxes"
            },
            description: {
                en: "Rental property tax filing in Quebec. Maximize deductions on rental income, track expenses, and optimize your investment property taxes.",
                fr: "Déclaration d'impôt sur revenus locatifs au Québec. Maximisez les déductions, suivez vos dépenses, et optimisez vos impôts sur propriétés de placement."
            },
            keywords: {
                en: ["rental income tax Quebec", "property tax filing", "rental deductions", "landlord taxes Quebec"],
                fr: ["impôt revenu locatif Québec", "déclaration impôt immobilier", "déductions locatives", "impôt propriétaire Québec"]
            }
        },
        hero: {
            title: {
                en: "Rental Income Tax Services in Quebec",
                fr: "Services fiscaux pour revenus locatifs au Québec"
            },
            subtitle: {
                en: "Maximize deductions and minimize tax on your rental properties. Expert rental income tax filing for Quebec landlords.",
                fr: "Maximisez les déductions et minimisez l'impôt sur vos propriétés locatives. Déclaration d'impôt experte pour propriétaires québécois."
            }
        },
        sections: [],
        faq: [],
        cta: {
            title: {
                en: "Optimize Your Rental Property Taxes",
                fr: "Optimisez vos impôts sur propriétés locatives"
            },
            buttonText: {
                en: "Get Started →",
                fr: "Commencer →"
            },
            buttonLink: "/inscription"
        }
    }
];

// Helper function to get landing page by slug
export function getLandingPageBySlug(slug: string): LandingPage | undefined {
    return landingPages.find(page => page.slug === slug);
}

// Get all slugs for sitemap generation
export function getAllLandingPageSlugs(): string[] {
    return landingPages.map(page => page.slug);
}
