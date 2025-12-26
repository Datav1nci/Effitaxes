"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Project } from "@/lib/projects";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectDetails({ project }: { project: Project }) {
    const { t, language } = useLanguage();
    const title = language === "en" ? project.titleEn : project.title;
    const description = language === "en" ? project.descriptionEn : project.description;

    return (
        <article className="mx-auto max-w-4xl py-12 px-4 selection:bg-blue-100 dark:selection:bg-blue-900">
            <div className="mb-8">
                <Link
                    href="/#projets"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span suppressHydrationWarning>{t.projects.back}</span>
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/10">
                <div className="relative aspect-video w-full">
                    <Image
                        src={project.img}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        suppressHydrationWarning
                    />
                </div>

                <div className="p-8 sm:p-12">
                    <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white" suppressHydrationWarning>
                        {title}
                    </h1>

                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-lg leading-relaxed text-slate-600 dark:text-gray-300" suppressHydrationWarning>
                            {description}
                        </p>
                        {/* If there was more content, it would go here. For now we only have description. */}
                    </div>
                </div>
            </div>

            {/* Contact Section reused or linked if needed */}
        </article>
    );
}
