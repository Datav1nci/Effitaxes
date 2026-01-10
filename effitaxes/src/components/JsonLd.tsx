export default function JsonLd({ locale }: { locale: string }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AccountingService",
        "name": "Effitaxes",
        "telephone": "+1-450-259-1829",
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": "+1-438-476-9456",
                "contactType": "customer service",
                "areaServed": "Montreal Island",
                "availableLanguage": ["French", "English"]
            },
            {
                "@type": "ContactPoint",
                "telephone": "+1-450-259-1829",
                "contactType": "customer service",
                "areaServed": "South Shore",
                "availableLanguage": ["French", "English"]
            }
        ],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "004-6955 Taschereau Blvd bureau",
            "addressLocality": "Brossard",
            "addressRegion": "QC",
            "postalCode": "J4Z 1A7",
            "addressCountry": "CA"
        },
        "areaServed": {
            "@type": "Place",
            "name": locale === 'fr' ? "Grand Montréal" : "Greater Montreal"
        },
        "url": "https://effitaxes.com",
        "priceRange": "$$"
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
