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
            // Code exchange failed — most likely because an email security scanner
            // (Microsoft Safe Links, Outlook, Gmail) pre-fetched the confirmation URL
            // and consumed the one-time code before the user clicked.
            // The email IS already confirmed on Supabase's side (the scanner did it).
            // Note: getUser() won't help here — scanner cookies live in a separate HTTP
            // context and are never shared with the user's browser.
            if (type === "recovery") {
                return NextResponse.redirect(
                    `${origin}/fr/forgot-password?message=resetLinkInvalid`
                );
            }
            // For signup: show the accurate "email confirmed, please sign in" banner
            // instead of a scary red error. The account is valid and ready to use.
            return NextResponse.redirect(
                `${origin}/fr/login?success=verified`
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
