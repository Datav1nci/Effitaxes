import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectsSection />
      </Suspense>
      <AboutSection />
      <ContactSection />
    </>
  );
}