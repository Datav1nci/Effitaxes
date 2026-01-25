"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { X } from "lucide-react";

export default function ConsentBanner() {
    const { t, language } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("effitaxes-consent");
        if (!consent) {
            // Delay slightly to show animation
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("effitaxes-consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("effitaxes-consent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-500">
            <div className="mx-auto max-w-7xl bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 p-6 md:p-4 md:flex md:items-center md:justify-between gap-4">
                <div className="flex-1 mb-4 md:mb-0">
                    <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                        {t.consent.text}{" "}
                        <Link
                            href="/privacy"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium whitespace-nowrap"
                        >
                            {t.consent.learnMore}
                        </Link>
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleDecline}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        {t.consent.decline}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                    >
                        {t.consent.accept}
                    </button>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-500 md:hidden"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
