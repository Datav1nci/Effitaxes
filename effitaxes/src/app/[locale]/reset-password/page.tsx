
import { resetPassword } from "@/actions/auth";
import { dictionary } from "@/lib/dictionary";
import type { Language } from "@/lib/dictionary";

export default async function ResetPasswordPage(props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ message?: string; error?: string }>;
}) {
    const params = await props.params;
    const { locale } = params;
    const searchParams = await props.searchParams;
    const { message } = searchParams;
    const t = dictionary[locale as Language] || dictionary.fr;

    // Typically code is exchanged by middleware/callback for session, 
    // so user should be logged in or have a session when reaching here if the flow is 'magic link' or 'recovery'.
    // Supabase recovery link logs the user in automatically.
    // So we just need a form to update the password.

    return (
        <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 px-4">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        {t.auth.resetPassword}
                    </h2>
                </div>

                {message && (
                    <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                        <p className="text-sm text-red-700 dark:text-red-200 text-center">{message}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" action={resetPassword}>
                    <div>
                        <label htmlFor="password" className="sr-only">{t.auth.newPassword}</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
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
                            className="relative block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder={t.auth.confirmPassword}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {t.auth.updatePassword}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
