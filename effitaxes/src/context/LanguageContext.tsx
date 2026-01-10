"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionary, Language } from "@/lib/dictionary";
import { usePathname, useRouter } from "next/navigation";

type LanguageContextType = {
    language: Language;
    t: typeof dictionary.fr;
    toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLocale = "fr" }: { children: React.ReactNode; initialLocale?: Language }) {
    const [language, setLanguage] = useState<Language>(initialLocale);

    // Synchro state with prop if it changes (e.g. navigation)
    useEffect(() => {
        setLanguage(initialLocale);
    }, [initialLocale]);

    const pathname = usePathname();
    const router = useRouter();

    const toggleLanguage = () => {
        const newLang = language === "fr" ? "en" : "fr";
        // setLanguage(newLang); // Let navigation update it via useEffect
        // localStorage.setItem("language", newLang); // Optional, maybe middleware handles default?

        // Redirect: Replace current locale in path
        // pathname is like "/fr/about" or "/fr"
        const segments = pathname.split('/');
        // segments[0] is empty, segments[1] is locale
        if (segments[1] === 'fr' || segments[1] === 'en') {
            segments[1] = newLang;
            const newPath = segments.join('/');
            router.push(newPath);
        } else {
            // Fallback if no locale in path (should not happen with middleware)
            router.push(`/${newLang}${pathname}`);
        }
    };

    const t = dictionary[language];

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
