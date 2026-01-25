import { notFound } from "next/navigation";
import { getLandingPageBySlug, type Language } from "@/lib/landingPages";
import LandingPageSchema from "@/components/LandingPageSchema";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    const lang: Language = locale === "en" ? "en" : "fr";
    const page = getLandingPageBySlug(slug);

    if (!page) {
        return {
            title: "Page Not Found",
        };
    }

    return {
        metadataBase: new URL("https://www.effitaxes.com"),
        title: page.metadata.title[lang],
        description: page.metadata.description[lang],
        keywords: page.metadata.keywords[lang],
        openGraph: {
            title: page.metadata.title[lang],
            description: page.metadata.description[lang],
            url: `https://www.effitaxes.com/${locale}/${slug}`,
            siteName: "Effitaxes",
            locale: lang === "en" ? "en_CA" : "fr_CA",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: page.metadata.title[lang],
            description: page.metadata.description[lang],
        },
        alternates: {
            canonical: "./",
            languages: {
                en: `/en/${slug}`,
                fr: `/fr/${slug}`,
            },
        },
    };
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    const lang: Language = locale === "en" ? "en" : "fr";
    const page = getLandingPageBySlug(slug);

    if (!page) {
        notFound();
    }

    return (
        <>
            <LandingPageSchema page={page} locale={lang} />
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl mb-6">
                        {page.hero.title[lang]}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        {page.hero.subtitle[lang]}
                    </p>
                </div>

                {/* Content Sections */}
                <div className="max-w-4xl mx-auto space-y-12 mb-16">
                    {page.sections.map((section, index) => (
                        <div key={index} className="prose dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                {section.title[lang]}
                            </h2>
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                {section.content[lang].map((paragraph, pIndex) => (
                                    <p key={pIndex} className="text-lg leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                {page.faq.length > 0 && (
                    <div className="max-w-4xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
                            {lang === "en" ? "Frequently Asked Questions" : "Questions Fréquemment Posées"}
                        </h2>
                        <div className="space-y-6">
                            {page.faq.map((faq, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                        {faq.question[lang]}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {faq.answer[lang]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto text-center bg-indigo-600 dark:bg-indigo-700 rounded-lg shadow-xl p-12">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        {page.cta.title[lang]}
                    </h2>
                    <a
                        href={page.cta.buttonLink}
                        className="inline-block bg-white text-indigo-600 dark:bg-gray-100 dark:text-indigo-700 font-semibold px-8 py-4 rounded-lg text-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors shadow-lg"
                    >
                        {page.cta.buttonText[lang]}
                    </a>
                </div>
            </div>
        </>
    );
}
