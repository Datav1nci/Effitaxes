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

            // Email confirmation flow — keep session and go to enrollment
            if (type === "signup") {
                return NextResponse.redirect(`${origin}/fr/inscription`);
            }

            // OAuth (Google, etc.) or session exchange — check enrollment status
            // The dashboard page already guards unenrolled users, so this is safe.
            return NextResponse.redirect(`${origin}/dashboard`);

        } else {
            // Code exchange failed. Before showing an error, check if a valid session
            // already exists — this happens when email security scanners (e.g. Microsoft
            // Safe Links, Outlook, Gmail) pre-fetch the confirmation URL and consume the
            // one-time code before the user actually clicks the link.
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Session is valid (created by the pre-fetcher). Redirect normally.
                if (type === "recovery") {
                    return NextResponse.redirect(`${origin}${next || "/fr/reset-password"}`);
                }
                if (type === "signup") {
                    return NextResponse.redirect(`${origin}/fr/inscription`);
                }
                return NextResponse.redirect(`${origin}/dashboard`);
            }

            // No session — code exchange genuinely failed (truly expired / reused link).
            // IMPORTANT: never send signup failures to the forgot-password page.
            if (type === "recovery") {
                return NextResponse.redirect(
                    `${origin}/fr/forgot-password?message=resetLinkInvalid`
                );
            }
            return NextResponse.redirect(
                `${origin}/fr/login?message=emailVerificationFailed`
            );
        }
    }

    // No ?code= in URL — handle token-hash flows where Supabase sets the session directly.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        // Keep session; send new signups straight to enrollment
        if (type === "signup") {
            return NextResponse.redirect(`${origin}/fr/inscription`);
        }
        // Recovery or other — let the dashboard guard handle it
        return NextResponse.redirect(`${origin}/dashboard`);
    }

    // Final fallback — no code, no session. Show the right error for the right flow.
    if (type === "recovery") {
        return NextResponse.redirect(
            `${origin}/fr/forgot-password?message=resetLinkInvalid`
        );
    }
    return NextResponse.redirect(
        `${origin}/fr/login?message=verificationLinkInvalid`
    );
}
