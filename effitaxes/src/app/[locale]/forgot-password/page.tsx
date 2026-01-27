
import { forgotPassword } from "@/actions/auth";
import { dictionary } from "@/lib/dictionary";
import type { Language } from "@/lib/dictionary";

// Simple UI for Forgot Password
export default async function ForgotPasswordPage(props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ message?: string; success?: string }>;
}) {
    const params = await props.params;
    const { locale } = params;
    const searchParams = await props.searchParams;
    const { message, success } = searchParams;
    const t = dictionary[locale as Language] || dictionary.fr;

    return (
        <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 px-4">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        {t.auth.forgotPassword}
                    </h2>
                    {!success && (
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            {t.auth.enterEmailReset}
                        </p>
                    )}
                </div>

                {success && (
                    <div className="space-y-6">
                        <div className="rounded-md bg-green-50 p-4 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200 text-center">
                                {t.auth.checkEmail}
                            </p>
                        </div>
                        <div className="text-center">
                            <a href={`/${locale}/login`} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                {t.auth.backToSignIn}
                            </a>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                        <p className="text-sm text-red-700 dark:text-red-200 text-center">{message}</p>
                    </div>
                )}

                {!success && (
                    <form className="mt-8 space-y-6" action={forgotPassword}>
                        <input type="hidden" name="locale" value={locale} />
                        <div>
                            <label htmlFor="email" className="sr-only">{t.auth.email}</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="relative block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder={t.auth.email}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {t.auth.sendResetLink}
                            </button>
                        </div>
                        <div className="text-center">
                            <a href={`/${locale}/login`} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                {t.auth.backToSignIn}
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
