"use client";

import { signInWithProvider } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function SignInButtons() {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col gap-4 w-full">
            <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => signInWithProvider("google")}
            >
                <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                >
                    <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                </svg>
                {t.auth.signInGoogle}
            </Button>

            <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => signInWithProvider("facebook")}
            >
                <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Facebook</title>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                {t.auth.signInFacebook}
            </Button>
        </div>
    );
}
