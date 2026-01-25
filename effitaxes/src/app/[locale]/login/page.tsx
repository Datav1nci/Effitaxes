import { login, signup } from "@/actions/auth";
import { SignInButtons } from "@/components/auth/SignInButtons";
// The layout.tsx uses dictionary.ts. This page is a Server Component by default?
// But it uses context? No, if I make it server component I can use dictionary directly if I get lang params.
// Let's make it a server component for the actions, but if we want interactivity (like switching tabs between login/signup) we need "use client" or separate components.
// For simplicity, let's use a server component for the page structure and client components for forms if needed, or just server actions.

// Actually, let's stick to Server Actions with simple forms.
// I need valid params handling.

import { dictionary } from "@/lib/dictionary";

type Language = "en" | "fr"; // or import from dictionary if exported

export default async function LoginPage(props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ message: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const { locale } = params;
    const { message } = searchParams;

    // Use dictionary directly if needed in future, currently unused
    // const t = dictionary[locale as Language] || dictionary.fr; 


    return (
        <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Sign in to your account
                </h2>
                {message && (
                    <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                        <p className="text-center text-sm text-red-800 dark:text-red-200">{message}</p>
                    </div>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 dark:bg-gray-800">
                    <form className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                formAction={login}
                                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Sign in
                            </button>
                            <button
                                formAction={signup}
                                className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <SignInButtons />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
