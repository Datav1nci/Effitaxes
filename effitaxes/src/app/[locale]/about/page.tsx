import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection"; // CTA
import { dictionary } from "@/lib/dictionary";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "fr";
  const t = dictionary[lang];

  return (
    <main>
      <AboutSection t={t} isTeaser={false} />
      <ContactSection t={t} />
    </main>
  );
}
