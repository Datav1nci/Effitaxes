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
        // Derive current language strictly from the URL to handle any state desync
        const segments = pathname.split('/');
        // segments[0] is empty, segments[1] is locale
        const currentUrlLocale = segments[1];

        let newLang: Language;

        // If the URL starts with 'en' or 'fr', switch to the other one
        if (currentUrlLocale === 'fr') {
            newLang = 'en';
        } else if (currentUrlLocale === 'en') {
            newLang = 'fr';
        } else {
            // Default fallback if no locale in path (e.g. root), toggle based on current state or default to 'fr' -> 'en'
            newLang = language === 'fr' ? 'en' : 'fr';
        }

        if (currentUrlLocale === 'fr' || currentUrlLocale === 'en') {
            segments[1] = newLang;
            const newPath = segments.join('/');
            router.push(newPath);
        } else {
            // Fallback: prepend new locale to current path
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
