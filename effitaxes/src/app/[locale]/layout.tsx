
import { Inter } from "next/font/google";
import "@/styles/globals.css";       // ⬅ placé dans src/styles
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";

import JsonLd from "@/components/JsonLd";
import { dictionary } from "@/lib/dictionary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "fr";
  const t = dictionary[lang];

  return {
    metadataBase: new URL("https://effitaxes.com"),
    title: t.metadata.title,
    description: t.metadata.description,
    keywords: t.metadata.keywords,
    openGraph: {
      title: t.metadata.title,
      description: t.metadata.description,
      url: `https://effitaxes.com/${lang}`,
      siteName: t.metadata.og.siteName,
      locale: t.metadata.og.locale,
      type: "website",
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        "fr": "/fr",
        "en": "/en",
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} scroll-smooth`}>
      <body className="antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <JsonLd locale={locale} />
        <ThemeProvider>
          <LanguageProvider initialLocale={locale === 'en' ? 'en' : 'fr'}>
            <Header />
            <main className="mx-auto max-w-7xl px-4">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

