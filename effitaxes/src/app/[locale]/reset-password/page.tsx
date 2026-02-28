"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

export default function ResetPasswordPage() {
    const { t, language } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState<"loading" | "ready" | "error" | "success">("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const code = searchParams.get("code");

        if (!code) {
            // No code — check if user already has a recovery session (e.g. arrived via direct link)
            const supabase = createClient();
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) {
                    setStatus("ready");
                } else {
                    setErrorMsg("No reset code found. Please request a new password reset link.");
                    setStatus("error");
                }
            });
            return;
        }

        // Exchange the PKCE code client-side (the browser has the verifier)
        const supabase = createClient();
        supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
            if (error) {
                console.error("Code exchange failed:", error.message);
                setErrorMsg("This reset link has expired or already been used. Please request a new one.");
                setStatus("error");
            } else {
                setStatus("ready");
            }
        });
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }

        setSubmitting(true);
        setErrorMsg("");

        const supabase = createClient();

        // Clear any login lock via API route if needed
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setErrorMsg(error.message);
            setSubmitting(false);
            return;
        }

        // Clear login lock server-side (fire and forget)
        if (user?.email) {
            await fetch("/api/auth/clear-lock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email }),
            }).catch(() => { }); // non-critical
        }

        await supabase.auth.signOut();
        setStatus("success");

        setTimeout(() => {
            router.push(`/${language}/login?message=Password updated successfully. Please sign in.`);
        }, 2000);
    };

    return (
        <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 px-4">
            <div className="w-full max-w-md space-y-8">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {t.auth.resetPassword}
                </h2>

                {/* Loading */}
                {status === "loading" && (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <p>Verifying reset link…</p>
                    </div>
                )}

                {/* Error */}
                {status === "error" && (
                    <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20 space-y-3">
                        <p className="text-sm text-red-700 dark:text-red-200 text-center">{errorMsg}</p>
                        <div className="text-center">
                            <a
                                href={`/${language}/forgot-password`}
                                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 text-sm font-medium"
                            >
                                Request a new reset link
                            </a>
                        </div>
                    </div>
                )}

                {/* Success */}
                {status === "success" && (
                    <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                        <p className="text-sm text-green-700 dark:text-green-200 text-center">
                            Password updated! Redirecting to login…
                        </p>
                    </div>
                )}

                {/* Form */}
                {status === "ready" && (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {errorMsg && (
                            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                                <p className="text-sm text-red-700 dark:text-red-200 text-center">{errorMsg}</p>
                            </div>
                        )}
                        <div>
                            <label htmlFor="password" className="sr-only">{t.auth.newPassword}</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder={t.auth.newPassword}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">{t.auth.confirmPassword}</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="relative block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder={t.auth.confirmPassword}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Updating…" : t.auth.updatePassword}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
