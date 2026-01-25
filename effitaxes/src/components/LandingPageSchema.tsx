import type { LandingPage, Language } from "@/lib/landingPages";

type Props = {
    page: LandingPage;
    locale: Language;
};

export default function LandingPageSchema({ page, locale }: Props) {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Effitaxes",
        "description": locale === "en"
            ? "Professional accounting and tax services in Quebec. Specialized in T1, TP1, self-employed, and corporate tax filing."
            : "Services professionnels de comptabilité et de fiscalité au Québec. Spécialisés en déclarations T1, TP1, travailleurs autonomes et impôts des sociétés.",
        "url": "https://www.effitaxes.com",
        "logo": "https://www.effitaxes.com/images/logo.png",
        "image": "https://www.effitaxes.com/images/og-image.jpg",
        "telephone": "+1-514-XXX-XXXX",
        "email": "youssef@effitaxes.com",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Montreal",
            "addressRegion": "QC",
            "addressCountry": "CA"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "45.5017",
            "longitude": "-73.5673"
        },
        "areaServed": {
            "@type": "State",
            "name": "Quebec"
        },
        "priceRange": "$$",
        "sameAs": [
            "https://www.facebook.com/effitaxes",
            "https://www.linkedin.com/company/effitaxes"
        ]
    };

    const faqSchema = page.faq.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": page.faq.map(faq => ({
            "@type": "Question",
            "name": faq.question[locale],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer[locale]
            }
        }))
    } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
        </>
    );
}
