import ContactSection from "@/components/ContactSection";
import { dictionary } from "@/lib/dictionary";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "fr";
  const t = dictionary[lang];

  return (
    <main>
      <ContactSection t={t} isTeaser={false} />
    </main>
  );
}
