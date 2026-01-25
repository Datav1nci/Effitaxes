import { dictionary } from '@/lib/dictionary';
import React from 'react';
import ReactMarkdown from 'react-markdown';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const lang = locale === "en" ? "en" : "fr";
    const t = dictionary[lang].privacy;

    return {
        title: t.title,
        description: t.intro.substring(0, 160) + "...",
    };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const lang = locale === "en" ? "en" : "fr";
    const t = dictionary[lang].privacy;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                        {t.title}
                    </h1>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {t.lastUpdated}
                    </p>
                    <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                        {t.intro}
                    </p>
                </div>

                <div className="space-y-8">
                    {t.sections.map((section, index) => (
                        <div key={index} className="prose dark:prose-invert max-w-none">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                {section.title}
                            </h2>
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                {section.content.map((paragraph, pIndex) => (
                                    <div key={pIndex}>
                                        <ReactMarkdown
                                            components={{
                                                a: ({ node, ...props }) => <a {...props} className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline" />
                                            }}
                                        >
                                            {paragraph}
                                        </ReactMarkdown>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
