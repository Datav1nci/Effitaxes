import AuthForm from "@/components/auth/AuthForm";
// The layout.tsx uses dictionary.ts. This page is a Server Component by default?
// But it uses context? No, if I make it server component I can use dictionary directly if I get lang params.
// Let's make it a server component for the actions, but if we want interactivity (like switching tabs between login/signup) we need "use client" or separate components.
// For simplicity, let's use a server component for the page structure and client components for forms if needed, or just server actions.

// Actually, let's stick to Server Actions with simple forms.
// I need valid params handling.



import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { dictionary } from "@/lib/dictionary";
import type { Language } from "@/lib/dictionary";

export default async function LoginPage(props: {
    searchParams: Promise<{ message?: string; success?: string }>;
    params: Promise<{ locale: string }>;
}) {
    const searchParams = await props.searchParams;
    const { message, success } = searchParams;
    const params = await props.params;
    const { locale } = params;

    // We access dictionary here to display localized messages based on codes
    const t = dictionary[locale as Language] || dictionary.fr;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        return redirect(`/${locale}/dashboard`);
    }

    return (
        <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {t.auth.signIn} / {t.auth.signUp}
                </h2>
                {success === 'check_email' && (
                    <div className="mt-4 rounded-md bg-green-50 p-4 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    {t.auth.checkEmail}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {message && (
                    <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                        <p className="text-center text-sm text-red-800 dark:text-red-200">{message}</p>
                    </div>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <AuthForm />
            </div>
        </div>
    );
}
