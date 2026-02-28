import { dictionary } from "@/lib/dictionary";
import type { Language } from "@/lib/dictionary";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default async function ForgotPasswordPage(props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ message?: string }>;
}) {
    const params = await props.params;
    const { locale } = params;
    const searchParams = await props.searchParams;
    const { message } = searchParams;
    const t = dictionary[locale as Language] || dictionary.fr;

    return (
        <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 px-4">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        {t.auth.forgotPassword}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        {t.auth.enterEmailReset}
                    </p>
                </div>

                {/* Error from callback (e.g. expired link) */}
                {message && (
                    <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                        <p className="text-sm text-red-700 dark:text-red-200 text-center">{message}</p>
                    </div>
                )}

                {/* Client-side form — calls resetPasswordForEmail from the browser
                    so the PKCE verifier is stored in accessible (non-httpOnly) cookies */}
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
