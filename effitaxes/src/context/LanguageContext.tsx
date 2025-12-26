"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionary, Language } from "@/lib/dictionary";

type LanguageContextType = {
    language: Language;
    t: typeof dictionary.fr;
    toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("fr");

    useEffect(() => {
        // Optional: Load from local storage
        const stored = localStorage.getItem("language") as Language;
        if (stored === "en" || stored === "fr") {
            setLanguage(stored);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === "fr" ? "en" : "fr";
        setLanguage(newLang);
        localStorage.setItem("language", newLang);
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
