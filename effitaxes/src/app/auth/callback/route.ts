import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next");
    const type = searchParams.get("type");

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Password reset flow
            if (type === "recovery") {
                return NextResponse.redirect(`${origin}${next || "/fr/reset-password"}`);
            }

            // Email confirmation flow — sign out so the user logs in manually
            if (type === "signup") {
                await supabase.auth.signOut();
                return NextResponse.redirect(`${origin}/login?success=verified`);
            }

            // OAuth (Google, etc.) — go straight to dashboard
            return NextResponse.redirect(`${origin}/dashboard`);

        } else {
            // Code exchange failed — send to the right page based on what was attempted.
            // IMPORTANT: never send signup failures to the forgot-password page.
            if (type === "recovery") {
                return NextResponse.redirect(
                    `${origin}/fr/forgot-password?message=Reset link is invalid or has expired. Please request a new one.`
                );
            }
            // Signup verification failed (e.g. link already used, Safe Links pre-fetch, etc.)
            return NextResponse.redirect(
                `${origin}/fr/login?message=Email verification failed. Please try signing up again or contact support.`
            );
        }
    }

    // No ?code= in URL — handle PKCE token-verified flows where Supabase sets the session directly.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/fr/login?success=verified`);
    }

    // Final fallback — no code, no session. Show the right error for the right flow.
    if (type === "recovery") {
        return NextResponse.redirect(
            `${origin}/fr/forgot-password?message=Reset link is invalid or has expired. Please request a new one.`
        );
    }
    return NextResponse.redirect(
        `${origin}/fr/login?message=Verification link is invalid or has expired. Please try again.`
    );
}
