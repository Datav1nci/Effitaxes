"use client";

import { Wrench, Building, HardHat } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { useLanguage } from "@/context/LanguageContext";

export default function ServicesSection() {
  const { t } = useLanguage();
  return (
    <section
      id="services"
      className="bg-background text-foreground py-20"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" suppressHydrationWarning>
            {t.services.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-gray-300" suppressHydrationWarning>
            {t.services.subtitle}
          </p>
        </div>

        {/* Soft surface behind the cards for consistent contrast */}
        <div className="rounded-2xl bg-gray-50 p-6 sm:p-8 dark:bg-gray-950/40">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.items.map((item, index) => {
              // We need icons. The original data had icons.
              // We can map index to icon or keep a separate array of icons.
              // Let's assume icons order matches dictionary order.
              const icons = [<Building size={32} key="b" />, <Wrench size={32} key="w" />, <HardHat size={32} key="h" />];
              return (
                <ServiceCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  icon={icons[index]}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
