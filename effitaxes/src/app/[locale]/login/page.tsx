import { login, signup } from "@/actions/auth";
import { SignInButtons } from "@/components/auth/SignInButtons";
// The layout.tsx uses dictionary.ts. This page is a Server Component by default?
// But it uses context? No, if I make it server component I can use dictionary directly if I get lang params.
// Let's make it a server component for the actions, but if we want interactivity (like switching tabs between login/signup) we need "use client" or separate components.
// For simplicity, let's use a server component for the page structure and client components for forms if needed, or just server actions.

// Actually, let's stick to Server Actions with simple forms.
// I need valid params handling.

import AuthForm from "@/components/auth/AuthForm";

export default async function LoginPage(props: {
    searchParams: Promise<{ message: string }>;
}) {
    const searchParams = await props.searchParams;
    const { message } = searchParams;

    // Use dictionary directly if needed in future, currently unused
    // const t = dictionary[locale as Language] || dictionary.fr; 


    return (
        <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Sign in or Create an Account
                </h2>
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
