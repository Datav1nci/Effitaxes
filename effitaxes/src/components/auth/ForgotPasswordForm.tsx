"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordForm() {
    const { t, language } = useLanguage();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        const supabase = createClient();
        const origin = window.location.origin;

        // Use a bare callback URL (no query params with slashes) to avoid
        // Supabase allowlist matching issues. The callback route always
        // redirects to reset-password after a successful code exchange.
        const redirectTo = `${origin}/auth/callback`;
        console.log("[ForgotPasswordForm] redirectTo:", redirectTo);

        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

        if (error) {
            console.error("[ForgotPasswordForm] error:", error);
            setErrorMsg(error.message || "Could not send reset link. Please try again.");
            setStatus("error");
        } else {
            setStatus("sent");
        }
    };

    if (status === "sent") {
        return (
            <div className="space-y-6">
                <div className="rounded-md bg-green-50 p-4 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 text-center">
                        {t.auth.checkEmail}
                    </p>
                </div>
                <div className="text-center">
                    <a
                        href={`/${language}/login`}
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                        {t.auth.backToSignIn}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {errorMsg && (
                <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                    <p className="text-sm text-red-700 dark:text-red-200 text-center">{errorMsg}</p>
                </div>
            )}
            <div>
                <label htmlFor="email" className="sr-only">{t.auth.email}</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder={t.auth.email}
                />
            </div>
            <div>
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {status === "loading" ? "Sending…" : t.auth.sendResetLink}
                </button>
            </div>
            <div className="text-center">
                <a
                    href={`/${language}/login`}
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                    {t.auth.backToSignIn}
                </a>
            </div>
        </form>
    );
}
