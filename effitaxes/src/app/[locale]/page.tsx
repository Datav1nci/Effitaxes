import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import { Suspense } from "react";
import { dictionary } from "@/lib/dictionary";

import { createClient } from "@/utils/supabase/server";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "fr";
  const t = dictionary[lang];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Hero t={t} user={user} />
      <ServicesSection t={t} />
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectsSection t={t} lang={lang} isTeaser={true} />
      </Suspense>
      <AboutSection t={t} isTeaser={true} />
      <ContactSection t={t} />
    </>
  );
}