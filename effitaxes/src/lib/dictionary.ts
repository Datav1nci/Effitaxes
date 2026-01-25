export type Language = "fr" | "en";

export const dictionary = {
    fr: {
        nav: {
            home: "Accueil",
            services: "Services",
            projects: "Projets",
            about: "À propos",
            contact: "Contact",
        },
        hero: {
            subtitle: "Dédié à l’excellence en services comptables et financiers",
            description: "Des solutions personnalisées et sur mesure pour les particuliers, les entreprises et travailleurs autonomes",
            cta: "Commencer ici -->",
        },
        services: {
            title: "Nos Services",
            subtitle: "Des solutions claires, conformes et adaptées à votre réalité.",
            items: [
                {
                    title: "Experts comptables",
                    description: "Tenue de livres, analyse financière et optimisation fiscale pour assurer une gestion comptable solide.",
                },
                {
                    title: "Gestion de la paie",
                    description: "Planification et exécution précises des paies et déclarations pour respecter les obligations légales.",
                },
                {
                    title: "Consultation",
                    description: "Accompagnement et conseils stratégiques pour les particuliers et les PME.",
                },
            ],
        },
        projects: {
            title: "Un aperçu de nos services et accompagnements.",
            more: "En savoir plus",
            back: "Retour aux projets",
        },
        about: {
            title: "À propos de",
            p1: "Basée sur la rive-sud de Montréal, Effitaxes est un cabinet comptable dédié à l’excellence en services financiers. Notre mission : soutenir nos clients dans la gestion comptable et fiscale avec professionnalisme et fiabilité.",
            p2: "Grâce à une approche personnalisée, nous offrons des solutions sur mesure incluant la tenue de livres, les déclarations d’impôts, la gestion de paie et la planification financière pour les particuliers, les entreprises et travailleurs autonomes.",
            more: "En savoir plus",
        },
        contact: {
            title: "Contactez-nous",
            phoneMtl: "Téléphone Montréal",
            phoneRs: "Téléphone Rive-Sud",
            email: "Courriel",
            address: "Adresse",
            form: {
                name: "Nom",
                namePlaceholder: "Votre nom",
                email: "Email",
                emailPlaceholder: "votre@email.com",
                phone: "Téléphone",
                phonePlaceholder: "(514) 123-4567",
                message: "Message",
                messagePlaceholder: "Comment pouvons-nous vous aider ?",
                submit: "Envoyer le message",
                sending: "Envoi en cours...",
                successTitle: "Message envoyé !",
                successMessage: "Merci ! Votre message a été envoyé avec succès.",
                sendAnother: "Envoyer un autre message",
            },
        },
        footer: {
            rights: "Tous droits réservés.",
        },
        common: {
            yes: "Oui",
            no: "Non",
        },
        auth: {
            signIn: "Se connecter",
            signUp: "S'inscrire",
            signOut: "Se déconnecter",
            email: "Courriel",
            password: "Mot de passe",
            firstName: "Prénom",
            lastName: "Nom",
            phone: "Téléphone",
            needAccount: "Besoin d'un compte ? S'inscrire",
            haveAccount: "Déjà un compte ? Se connecter",
            orContinueWith: "Ou continuer avec",
            dashboard: "Tableau de bord",
            yourProfile: "Votre Profil",
            welcome: "Salut",
            yourAccount: "Votre Compte",
            signInGoogle: "Se connecter avec Google",
            signInFacebook: "Se connecter avec Facebook",
            errorAuth: "Impossible d'authentifier l'utilisateur",
            checkEmail: "Vérifiez votre courriel pour continuer",
            userExists: "Utilisateur déjà enregistré. Veuillez vous connecter.",
            editProfile: "Modifier le profil",
            save: "Enregistrer",
            cancel: "Annuler",
            successUpdate: "Profil mis à jour !",
            errorUpdate: "Erreur lors de la mise à jour.",
            updateTaxProfile: "Modifier vos infos fiscales",
            backDashboard: "Retour au tableau de bord",
        },
        enrollment: {
            title: "Inscription Impôts 2025",
            steps: {
                personal: "Infos Personnelles",
                selection: "Sources de Revenus",
                selfEmployed: "Travailleur Autonome",
                car: "Dépenses Auto",
                rental: "Revenus de Location",
                submit: "Réviser et Soumettre",
            },
            buttons: {
                next: "Suivant",
                prev: "Précédent",
                submit: "Soumettre la demande",
            },
            personal: {
                title: "Informations de Base",
                firstName: "Prénom",
                lastName: "Nom de famille",
                addressNumber: "Numéro civique",
                addressName: "Nom de la rue",
                addressCity: "Ville",
                addressApp: "App (opt)",
                phone: "Numéro de téléphone",
                dob: "Date de naissance",
                email: "Courriel",
                maritalStatus: "Statut civil",
                maritalStatusOptions: {
                    single: "Célibataire",
                    married: "Marié(e)",
                    commonLaw: "Conjoint de fait",
                    separated: "Séparé(e)",
                    divorced: "Divorcé(e)",
                    widowed: "Veuf/Veuve",
                },
                maritalChangeDate: "Date du changement (si changé en 2025)",
                province: "Province de résidence (au 31 déc)",
                ownerTenant: "Êtes-vous propriétaire ou locataire ?",
                ownerTenantOptions: {
                    owner: "Propriétaire",
                    tenant: "Locataire",
                },
                soldBuyHouse: "Avez-vous vendu ou acheté une maison en 2025 ?",
                incomeSource: "Source principale de revenus en 2025",
                privateDrugInsurance: "Aviez-vous une assurance médicaments privée ?",
                insuranceMonths: "Nombre de mois couverts (si partie de l'année)",
                additionalInfo: "Informations supplémentaires / Personnes à charge",
            },
            selection: {
                title: "Catégories de Revenus",
                subtitle: "Sélectionnez tout ce qui s'applique à votre situation en 2025",
                employee: "Employé",
                selfEmployed: "Travailleur Autonome / Entreprise",
                student: "Étudiant",
                retired: "Retraité",
                rental: "Revenus de Location",
                crypto: "Achat/Vente/Détention Crypto",
                carExpenses: "Dépenses Auto",
                workFromHome: "J'ai fait du télétravail cette année",
                declareHomeOffice: "Je déclare des dépenses de maison",
            },
            workFromHome: {
                title: "Dépenses de Télétravail",
                description: "Entrez vos dépenses liées à votre espace de bureau à domicile.",
                utilities: {
                    title: "Utilities & Home Costs",
                    electricity: "Électricité",
                    heating: "Chauffage",
                    water: "Eau",
                    internet: "Frais d’accès à l’Internet résidentiel",
                    rent: "Loyer",
                    propertyTaxes: "Taxes foncières",
                    insurance: "Assurance habitation",
                },
                maintenance: {
                    title: "Maintenance & Supplies",
                    maintenance: "Entretien (produits de nettoyage, ampoules, etc.)",
                    officeSupplies: "Fournitures de bureau (papier, encre, cartouches, frais postaux — work use only)",
                },
                communication: {
                    title: "Communication",
                    cellPhone: "Téléphone cellulaire",
                },
            },
            selfEmployed: {
                title: "Informations Travailleur Autonome",
                businessName: "Nom de votre entreprise",
                businessPhone: "Téléphone / NE",
                creationDate: "Date de création",
                isActive: "Votre entreprise est-elle toujours en cours ?",
                productType: "Quel type de produit ou service vous offrez ?",
                grossIncome: "Quel était votre revenu brut ?",
                expenses: {
                    title: "Dépenses d'Entreprise",
                    advertising: "Annonces",
                    insurance: "Assurance",
                    interest: "Intérêts payés",
                    taxesLicenses: "Taxes professionnelles, licences et affiliations",
                    officeExpenses: "Frais de bureau",
                    professionalFees: "Honoraires professionnels (juridiques et comptables)",
                    managementFees: "Frais de gestion et d'administration",
                    rent: "Frais de location (outils ou bureau)",
                    repairs: "Réparations et entretien",
                    salaries: "Salaires ou dépenses pour aidant occasionnel",
                    travel: "Frais de voyage",
                    delivery: "Frais de livraison",
                    other: "Autres dépenses (précisez)",
                },
                homeOffice: {
                    title: "Bureau à Domicile",
                    totalArea: "Superficie totale de la maison",
                    businessArea: "Superficie utilisée pour l'entreprise",
                    electricity: "Électricité annuelle totale",
                    heating: "Coût de chauffage annuel total",
                    insurance: "Assurance Habitation",
                    maintenance: "Entretien de la maison",
                    mortgageInterest: "Intérêts hypothécaires / Loyer annuel total",
                    propertyTaxes: "Impôts fonciers totaux (municipal et scolaire)",
                    other: "Autre (veuillez préciser)",
                },
            },
            car: {
                title: "Dépenses Automobiles",
                makeModel: "Description de votre voiture (Marque, modèle, année)",
                businessKm: "Km parcourus pour affaires",
                totalKm: "Km parcourus au total dans l'année fiscale",
                gas: "Total payé pour l'essence",
                insurance: "Assurance automobile",
                license: "Permis de conduire et immatriculation",
                maintenance: "Maintenance et réparations",
                purchaseLeaseDate: "Date début location/achat (si 2025)",
                leaseEndDate: "Date fin location/prêt (si 2025)",
                leasePayments: "Total payé pour la location (si loué)",
                notes: "Autres notes",
            },
            rental: {
                title: "Revenus de Location",
                address: "Adresse de la propriété locative",
                grossIncome: "Revenus bruts de location",
                ownershipPercentage: "Votre pourcentage de propriété",
                expenses: {
                    advertising: "Publicité",
                    insurance: "Assurances",
                    interest: "Intérêts hypothécaires",
                    taxes: "Impôts fonciers",
                    maintenance: "Entretien et réparations",
                    utilities: "Services publics (Hydro, etc.)",
                    managementFees: "Frais de gestion",
                    other: "Autres dépenses",
                },
            },
            errors: {
                required: "Ce champ est obligatoire",
                invalidEmail: "Adresse courriel invalide",
                invalidDate: "Date invalide",
                number: "Doit être un nombre",
                positive: "Doit être un nombre positif",
            },
            confirmation: "Je confirme que toutes les informations fournies sont exactes.",
        },
        metadata: {
            title: "Effitaxes — Déclaration d'impôts au Québec (T1, TP1, Travailleurs Autonomes)",
            description: "Service rapide et sécurisé de déclaration d'impôts au Québec. T1, TP1, travailleurs autonomes, impôts des sociétés et tenue de livres. Professionnels fiscaux locaux de confiance.",
            keywords: ["Fair fair mes impots", "comptabilité", "finance", "gestion", "Montréal", "effitaxes", "paies", "paie", "travailleurs autonomes", "déclarations fiscales", "impôts", "tenue de livres", "comptabilité d'entreprise", "consultation fiscale", "planification fiscale", "déductions d'impôt", "TPS", "TVQ", "rapports financiers", "audit", "conseils financiers", "gestion de paie", "comptabilité pour PME", "services comptables", "expertise comptable", "déclarations de revenus", "optimisation fiscale"],
            og: {
                siteName: "Effitaxes",
                locale: "fr_CA",
            }
        },
        privacy: {
            title: "Politique de Confidentialité",
            lastUpdated: "Dernière mise à jour : 24 Janvier 2026",
            intro: "Effitaxes (« nous », « notre », « nos ») respecte votre vie privée et s'engage à protéger vos informations personnelles et financières. Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos données lorsque vous utilisez notre site web et nos services.",
            sections: [
                {
                    title: "1. Informations que nous collectons",
                    content: [
                        "Nous pouvons collecter les types d'informations suivants :",
                        "**Informations Personnelles** : Nom, Adresse courriel, Numéro de téléphone, Détails de connexion au compte, Informations d'identité requises pour la déclaration d'impôts.",
                        "**Informations Financières et Fiscales** : Documents fiscaux et déclarations, Revenus, déductions et dossiers financiers connexes, Informations sur l'entreprise ou le travail indépendant (le cas échéant).",
                        "**Informations Techniques** : Adresse IP, Type d'appareil et de navigateur, Journaux d'utilisation et données analytiques, Données du fournisseur d'authentification (Google, Facebook)."
                    ]
                },
                {
                    title: "2. Comment nous utilisons vos informations",
                    content: [
                        "Nous utilisons vos informations pour :",
                        "Fournir des services de préparation d'impôts et financiers",
                        "Authentifier et gérer les comptes utilisateurs",
                        "Communiquer au sujet de votre compte ou de vos déclarations",
                        "Améliorer notre site web et nos services",
                        "Se conformer aux exigences légales et réglementaires",
                        "Prévenir la fraude et l'accès non autorisé"
                    ]
                },
                {
                    title: "3. Authentification et Fournisseurs Tiers",
                    content: [
                        "Nous utilisons des fournisseurs d'identité tiers tels que Google et Facebook pour permettre une connexion sécurisée.",
                        "Ces fournisseurs peuvent partager des informations de profil de base (telles que le nom et l'adresse courriel) conformément à leurs politiques de confidentialité.",
                        "Nous ne vendons ni n'échangeons vos données personnelles."
                    ]
                },
                {
                    title: "4. Stockage et Sécurité des Données",
                    content: [
                        "Nous mettons en œuvre des mesures de sécurité conformes aux normes de l'industrie, notamment :",
                        "Transmission de données cryptée (HTTPS)",
                        "Protocoles d'authentification sécurisés",
                        "Accès restreint aux dossiers sensibles",
                        "Infrastructure cloud sécurisée (ex: Supabase, Vercel)",
                        "Malgré tous nos efforts, aucun système en ligne ne peut garantir une sécurité absolue."
                    ]
                },
                {
                    title: "5. Conservation des Données",
                    content: [
                        "Nous ne conservons les informations personnelles et fiscales que le temps nécessaire :",
                        "Pour fournir les services",
                        "Pour se conformer aux exigences légales de conservation",
                        "Pour résoudre les litiges ou faire respecter les accords"
                    ]
                },
                {
                    title: "6. Vos Droits",
                    content: [
                        "Selon votre juridiction, vous pouvez avoir le droit de :",
                        "Accéder à vos données personnelles",
                        "Demander des corrections ou suppressions",
                        "Retirer votre consentement",
                        "Demander une copie de vos informations stockées",
                        "Les demandes peuvent être faites en nous contactant."
                    ]
                },
                {
                    title: "7. Cookies et Analytique",
                    content: [
                        "Nous pouvons utiliser des cookies et des outils d'analyse pour :",
                        "Maintenir les sessions de connexion",
                        "Comprendre l'utilisation du site",
                        "Améliorer les performances",
                        "Vous pouvez contrôler les cookies dans les paramètres de votre navigateur."
                    ]
                },
                {
                    title: "8. Conformité Légale",
                    content: [
                        "Nous nous conformons aux lois sur la protection de la vie privée applicables, notamment :",
                        "Lois canadiennes sur la protection de la vie privée (LPRPDE)",
                        "Loi 25 du Québec",
                        "RGPD (le cas échéant)",
                        "Autres réglementations pertinentes sur la protection des données"
                    ]
                },
                {
                    title: "9. Modifications de cette Politique",
                    content: [
                        "Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Les mises à jour seront publiées sur cette page."
                    ]
                },
                {
                    title: "10. Contactez-nous",
                    content: [
                        "Si vous avez des préoccupations concernant la confidentialité, contactez :",
                        "Effitaxes",
                        "Site web : [https://effitaxes.com](https://effitaxes.com)",
                        "Courriel : [youssef@effitaxes.com](mailto:youssef@effitaxes.com)"
                    ]
                }
            ]
        },
        terms: {
            title: "Conditions d'Utilisation",
            lastUpdated: "Dernière mise à jour : 24 Janvier 2026",
            intro: "Ces conditions régissent votre accès et votre utilisation du site web et des services d'Effitaxes. En utilisant nos services, vous acceptez ces conditions.",
            sections: [
                {
                    title: "1. Services Fournis",
                    content: [
                        "Effitaxes fournit des services de préparation d'impôts, de soutien financier et des services numériques connexes.",
                        "Nous ne garantissons pas de résultats fiscaux spécifiques ou de remboursements."
                    ]
                },
                {
                    title: "2. Responsabilités de l'Utilisateur",
                    content: [
                        "Vous acceptez de :",
                        "Fournir des informations exactes et véridiques",
                        "Garder vos identifiants de connexion sécurisés",
                        "Utiliser les services uniquement à des fins légales",
                        "Ne pas abuser ou tenter d'exploiter nos systèmes",
                        "Vous êtes responsable de l'exactitude des informations soumises pour les déclarations d'impôts."
                    ]
                },
                {
                    title: "3. Accès au Compte et Sécurité",
                    content: [
                        "Vous êtes responsable du maintien de la confidentialité de votre compte.",
                        "Nous pouvons suspendre ou résilier des comptes pour activité suspecte ou abusive."
                    ]
                },
                {
                    title: "4. Paiements et Remboursements (le cas échéant)",
                    content: [
                        "Les frais pour les services seront divulgués avant l'achat.",
                        "Les remboursements sont sujets à examen et au statut d'achèvement du service."
                    ]
                },
                {
                    title: "5. Limitation de Responsabilité",
                    content: [
                        "Effitaxes n'est pas responsable de :",
                        "Erreurs causées par des données incorrectes soumises par l'utilisateur",
                        "Retards des autorités fiscales ou de tiers",
                        "Pertes au-delà de la valeur des services payés",
                        "Les services sont fournis « tels quels »."
                    ]
                },
                {
                    title: "6. Données et Confidentialité",
                    content: [
                        "Votre utilisation de nos services est régie par notre Politique de Confidentialité.",
                        "En utilisant Effitaxes, vous consentez au traitement des données nécessaire pour fournir les services."
                    ]
                },
                {
                    title: "7. Propriété Intellectuelle",
                    content: [
                        "Tout le contenu du site web, la marque et les logiciels appartiennent à Effitaxes et ne peuvent être copiés sans permission."
                    ]
                },
                {
                    title: "8. Résiliation",
                    content: [
                        "Nous pouvons suspendre ou mettre fin à l'accès si ces conditions sont violées."
                    ]
                },
                {
                    title: "9. Loi Applicable",
                    content: [
                        "Ces conditions sont régies par les lois du Québec et du Canada."
                    ]
                },
                {
                    title: "10. Coordonnées",
                    content: [
                        "Effitaxes",
                        "Site web : [https://effitaxes.com](https://effitaxes.com)",
                        "Courriel : [youssef@effitaxes.com](mailto:youssef@effitaxes.com)"
                    ]
                }
            ]
        },
        consent: {
            text: "Nous utilisons des témoins (cookies) pour assurer le bon fonctionnement du site et analyser notre trafic.",
            accept: "Accepter",
            decline: "Refuser",
            learnMore: "En savoir plus",
        }
    },
    en: {
        nav: {
            home: "Home",
            services: "Services",
            projects: "Projects",
            about: "About",
            contact: "Contact",
        },
        hero: {
            subtitle: "Dedicated to excellence in accounting and financial services",
            description: "Personalized and tailored solutions for individuals, businesses, and self-employed workers",
            cta: "Start here -->",
        },
        services: {
            title: "Our Services",
            subtitle: "Clear, compliant solutions adapted to your reality.",
            items: [
                {
                    title: "Chartered Accountants",
                    description: "Bookkeeping, financial analysis, and tax optimization to ensure solid accounting management.",
                },
                {
                    title: "Payroll Management",
                    description: "Precise payroll planning and execution to meet legal obligations.",
                },
                {
                    title: "Consulting",
                    description: "Strategic support and advice for individuals and SMEs.",
                },
            ],
        },
        projects: {
            title: "An overview of our services and support.",
            more: "Learn more",
            back: "Back to projects",
        },
        about: {
            title: "About",
            p1: "Based on the South Shore of Montreal, Effitaxes is an accounting firm dedicated to excellence in financial services. Our mission: to support our clients in accounting and tax management with professionalism and reliability.",
            p2: "Thanks to a personalized approach, we offer tailored solutions including bookkeeping, tax returns, payroll management, and financial planning for individuals, businesses, and self-employed workers.",
            more: "Learn more",
        },
        contact: {
            title: "Contact Us",
            phoneMtl: "Montreal Phone",
            phoneRs: "South Shore Phone",
            email: "Email",
            address: "Address",
            form: {
                name: "Name",
                namePlaceholder: "Your name",
                email: "Email",
                emailPlaceholder: "your@email.com",
                phone: "Phone",
                phonePlaceholder: "(555) 555-5555",
                message: "Message",
                messagePlaceholder: "How can we help you?",
                submit: "Send message",
                sending: "Sending...",
                successTitle: "Message sent!",
                successMessage: "Thank you! Your message has been sent successfully.",
                sendAnother: "Send another message",
            },
        },
        footer: {
            rights: "All rights reserved.",
        },
        common: {
            yes: "Yes",
            no: "No",
        },
        auth: {
            signIn: "Sign In",
            signUp: "Sign Up",
            signOut: "Sign Out",
            email: "Email",
            password: "Password",
            firstName: "First Name",
            lastName: "Last Name",
            phone: "Phone",
            needAccount: "Need an account? Sign up",
            haveAccount: "Already have an account? Sign in",
            orContinueWith: "Or continue with",
            dashboard: "Dashboard",
            yourProfile: "Your Profile",
            welcome: "Welcome",
            yourAccount: "Your Account",
            signInGoogle: "Sign in with Google",
            signInFacebook: "Sign in with Facebook",
            errorAuth: "Could not authenticate user",
            checkEmail: "Check email to continue sign in process",
            userExists: "User already registered. Please sign in.",
            editProfile: "Edit Profile",
            save: "Save",
            cancel: "Cancel",
            successUpdate: "Profile updated!",
            errorUpdate: "Error updating profile.",
            updateTaxProfile: "Update Tax Profile",
            backDashboard: "Back to Dashboard",
        },
        enrollment: {
            title: "2025 Tax Enrollment",
            steps: {
                personal: "Personal Info",
                selection: "Income Sources",
                selfEmployed: "Self-Employed",
                car: "Car Expenses",
                rental: "Rental Income",
                submit: "Review & Submit",
            },
            buttons: {
                next: "Next",
                prev: "Previous",
                submit: "Submit Application",
            },
            personal: {
                title: "Basic Information",
                firstName: "First Name",
                lastName: "Last Name",
                addressNumber: "Civic Number",
                addressName: "Street Name",
                addressCity: "City",
                addressApp: "Apt (opt)",
                phone: "Phone Number",
                dob: "Date of Birth",
                email: "Email",
                maritalStatus: "Marital Status",
                maritalStatusOptions: {
                    single: "Single",
                    married: "Married",
                    commonLaw: "Common Law",
                    separated: "Separated",
                    divorced: "Divorced",
                    widowed: "Widowed",
                },
                maritalChangeDate: "Date of change (if status changed in 2025)",
                province: "Province of residence (Dec 31)",
                ownerTenant: "Are you an owner or tenant?",
                ownerTenantOptions: {
                    owner: "Owner",
                    tenant: "Tenant",
                },
                soldBuyHouse: "Did you sell or buy a house in 2025?",
                incomeSource: "Main source of income in 2025",
                privateDrugInsurance: "Did you have private drug insurance?",
                insuranceMonths: "Number of months covered (if partial year)",
                additionalInfo: "Additional Information / Dependents",
            },
            selection: {
                title: "Income Categories",
                subtitle: "Select all that apply to you in 2025",
                employee: "Employee",
                selfEmployed: "Self-Employed / Business",
                student: "Student",
                retired: "Retired",
                rental: "Rental Revenue",
                crypto: "Bought/Sold/Held Crypto",
                carExpenses: "Car Expenses",
                workFromHome: "I worked remotely",
                declareHomeOffice: "I declare home expenses",
            },
            workFromHome: {
                title: "Work from Home Expenses",
                description: "Enter your expenses related to your home office space.",
                utilities: {
                    title: "Utilities & Home Costs",
                    electricity: "Electricity",
                    heating: "Heating",
                    water: "Water",
                    internet: "Home Internet Access Fees",
                    rent: "Rent",
                    propertyTaxes: "Property Taxes",
                    insurance: "Home Insurance",
                },
                maintenance: {
                    title: "Maintenance & Supplies",
                    maintenance: "Maintenance (cleaning products, light bulbs, etc.)",
                    officeSupplies: "Office Supplies (paper, ink, cartridges, postage — work use only)",
                },
                communication: {
                    title: "Communication",
                    cellPhone: "Cell Phone",
                },
            },
            selfEmployed: {
                title: "Self-Employment Information",
                businessName: "Business Name",
                businessPhone: "Business Phone / BN",
                creationDate: "Creation Date",
                isActive: "Is the business still active?",
                productType: "Type of product or service",
                grossIncome: "Gross Income",
                expenses: {
                    title: "Business Expenses",
                    advertising: "Advertising",
                    insurance: "Insurance",
                    interest: "Interest Paid",
                    taxesLicenses: "Business taxes, licenses and memberships",
                    officeExpenses: "Office Expenses",
                    professionalFees: "Professional Fees (Legal & Accounting)",
                    managementFees: "Management & Administration Fees",
                    rent: "Rent (Machinery or Office)",
                    repairs: "Repairs & Maintenance",
                    salaries: "Salaries / Casual Help",
                    travel: "Travel Expenses",
                    delivery: "Delivery & Freight",
                    other: "Other Expenses (Specify)",
                },
                homeOffice: {
                    title: "Home Office Expenses",
                    totalArea: "Total area of home",
                    businessArea: "Area used for business",
                    electricity: "Total Electricity",
                    heating: "Total Heating",
                    insurance: "Home Insurance",
                    maintenance: "Home Maintenance",
                    mortgageInterest: "Mortgage Interest / Total Rent",
                    propertyTaxes: "Property Taxes",
                    other: "Other Home Expenses",
                },
            },
            car: {
                title: "Car Expenses",
                makeModel: "Car Description (Make, Model, Year)",
                businessKm: "Km driven for business",
                totalKm: "Total Km driven in fiscal year",
                gas: "Total Gas",
                insurance: "Car Insurance",
                license: "License & Registration",
                maintenance: "Maintenance & Repairs",
                purchaseLeaseDate: "Purchase/Lease Start Date (if in 2025)",
                leaseEndDate: "Lease End/Loan Payoff Date (if in 2025)",
                leasePayments: "Total Lease Payments",
                notes: "Other Notes",
            },
            rental: {
                title: "Rental Income",
                address: "Rental Property Address",
                grossIncome: "Gross Rents Collected",
                ownershipPercentage: "Your Ownership Percentage",
                expenses: {
                    advertising: "Advertising",
                    insurance: "Insurance",
                    interest: "Mortgage Interest",
                    taxes: "Property Taxes",
                    maintenance: "Maintenance & Repairs",
                    utilities: "Utilities",
                    managementFees: "Management Fees",
                    other: "Other Expenses",
                },
            },
            errors: {
                required: "This field is required",
                invalidEmail: "Invalid email address",
                invalidDate: "Invalid date",
                number: "Must be a number",
                positive: "Must be a positive number",
            },
            confirmation: "I confirm that all information provided is accurate.",
        },
        metadata: {
            title: "Effitaxes — Expert Tax Filing in Quebec (T1, TP1, Self-Employed)",
            description: "Fast and secure tax filing in Quebec. T1, TP1, self-employed, business taxes, and bookkeeping. Trusted local tax professionals.",
            keywords: ["do my tax", "accounting", "finance", "management", "Montreal", "effitaxes", "payroll", "self-employed", "tax returns", "taxes", "bookkeeping", "corporate accounting", "tax consulting", "financial planning", "tax deductions", "GST", "QST", "financial reports", "audit", "financial advice", "payroll management", "SME accounting", "accounting services", "CPA", "tax optimization"],
            og: {
                siteName: "Effitaxes",
                locale: "en_CA",
            }
        },
        privacy: {
            title: "Privacy Policy",
            lastUpdated: "Last updated: January 24, 2026",
            intro: "Effitaxes (“we”, “our”, “us”) respects your privacy and is committed to protecting your personal and financial information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website and services.",
            sections: [
                {
                    title: "1. Information We Collect",
                    content: [
                        "We may collect the following types of information:",
                        "**Personal Information**: Name, Email address, Phone number, Account login details, Identity information required for tax filing.",
                        "**Financial & Tax Information**: Tax documents and filings, Income, deductions, and related financial records, Business or self-employment information (if applicable).",
                        "**Technical Information**: IP address, Device and browser type, Usage logs and analytics data, Authentication provider data (Google, Facebook)."
                    ]
                },
                {
                    title: "2. How We Use Your Information",
                    content: [
                        "We use your information to:",
                        "Provide tax preparation and financial services",
                        "Authenticate and manage user accounts",
                        "Communicate about your account or filings",
                        "Improve our website and services",
                        "Comply with legal and regulatory requirements",
                        "Prevent fraud and unauthorized access"
                    ]
                },
                {
                    title: "3. Authentication & Third-Party Providers",
                    content: [
                        "We use third-party identity providers such as Google and Facebook to allow secure login.",
                        "These providers may share basic profile information (such as name and email) in accordance with their privacy policies.",
                        "We do not sell or trade your personal data."
                    ]
                },
                {
                    title: "4. Data Storage & Security",
                    content: [
                        "We implement industry-standard security measures, including:",
                        "Encrypted data transmission (HTTPS)",
                        "Secure authentication protocols",
                        "Restricted access to sensitive records",
                        "Secure cloud infrastructure (e.g., Supabase, Vercel)",
                        "Despite best efforts, no online system can guarantee absolute security."
                    ]
                },
                {
                    title: "5. Data Retention",
                    content: [
                        "We retain personal and tax information only as long as required:",
                        "To provide services",
                        "To comply with legal retention requirements",
                        "To resolve disputes or enforce agreements"
                    ]
                },
                {
                    title: "6. Your Rights",
                    content: [
                        "Depending on your jurisdiction, you may have the right to:",
                        "Access your personal data",
                        "Request corrections or deletions",
                        "Withdraw consent",
                        "Request a copy of your stored information",
                        "Requests can be made by contacting us."
                    ]
                },
                {
                    title: "7. Cookies & Analytics",
                    content: [
                        "We may use cookies and analytics tools to:",
                        "Maintain login sessions",
                        "Understand site usage",
                        "Improve performance",
                        "You can control cookies in your browser settings."
                    ]
                },
                {
                    title: "8. Legal Compliance",
                    content: [
                        "We comply with applicable privacy laws including:",
                        "Canadian privacy laws (PIPEDA)",
                        "Quebec Law 25",
                        "GDPR (if applicable)",
                        "Other relevant data protection regulations"
                    ]
                },
                {
                    title: "9. Changes to This Policy",
                    content: [
                        "We may update this Privacy Policy periodically. Updates will be posted on this page."
                    ]
                },
                {
                    title: "10. Contact Us",
                    content: [
                        "If you have privacy concerns, contact:",
                        "Effitaxes",
                        "Website: [https://effitaxes.com](https://effitaxes.com)",
                        "Email: [youssef@effitaxes.com](mailto:youssef@effitaxes.com)"
                    ]
                }
            ]
        },
        terms: {
            title: "Terms of Service",
            lastUpdated: "Last updated: January 24, 2026",
            intro: "These Terms govern your access to and use of Effitaxes’ website and services. By using our services, you agree to these Terms.",
            sections: [
                {
                    title: "1. Services Provided",
                    content: [
                        "Effitaxes provides tax preparation, financial support, and related digital services.",
                        "We do not guarantee specific tax outcomes or refunds."
                    ]
                },
                {
                    title: "2. User Responsibilities",
                    content: [
                        "You agree to:",
                        "Provide accurate and truthful information",
                        "Keep login credentials secure",
                        "Use services only for lawful purposes",
                        "Not misuse or attempt to exploit our systems",
                        "You are responsible for the accuracy of information submitted for tax filings."
                    ]
                },
                {
                    title: "3. Account Access & Security",
                    content: [
                        "You are responsible for maintaining account confidentiality.",
                        "We may suspend or terminate accounts for suspicious or abusive activity."
                    ]
                },
                {
                    title: "4. Payments & Refunds (if applicable)",
                    content: [
                        "Fees for services will be disclosed before purchase.",
                        "Refunds are subject to review and service completion status."
                    ]
                },
                {
                    title: "5. Limitation of Liability",
                    content: [
                        "Effitaxes is not liable for:",
                        "Errors caused by incorrect user-submitted data",
                        "Delays from tax authorities or third parties",
                        "Losses beyond the value of paid services",
                        "Services are provided “as is”."
                    ]
                },
                {
                    title: "6. Data & Privacy",
                    content: [
                        "Your use of our services is governed by our Privacy Policy.",
                        "By using Effitaxes, you consent to data processing required to deliver services."
                    ]
                },
                {
                    title: "7. Intellectual Property",
                    content: [
                        "All website content, branding, and software belong to Effitaxes and may not be copied without permission."
                    ]
                },
                {
                    title: "8. Termination",
                    content: [
                        "We may suspend or terminate access if these Terms are violated."
                    ]
                },
                {
                    title: "9. Governing Law",
                    content: [
                        "These Terms are governed by the laws of Quebec and Canada."
                    ]
                },
                {
                    title: "10. Contact Information",
                    content: [
                        "Effitaxes",
                        "Website: [https://effitaxes.com](https://effitaxes.com)",
                        "Email: [youssef@effitaxes.com](mailto:youssef@effitaxes.com)"
                    ]
                }
            ]
        },
        consent: {
            text: "We use cookies to ensure the proper functioning of the site and to analyze our traffic.",
            accept: "Accept",
            decline: "Decline",
            learnMore: "Learn more",
        }
    },
};

export type Dictionary = typeof dictionary.fr;
