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
            // Backward-compat: if an old recovery link encoded type=recovery, honor it.
            if (type === "recovery") {
                return NextResponse.redirect(`${origin}${next || "/fr/reset-password"}`);
            }

            // For email confirmation flows (type === "signup"), sign out immediately
            // to force the user to log in manually with their new credentials.
            if (type === "signup") {
                await supabase.auth.signOut();
                return NextResponse.redirect(`${origin}/login?success=verified`);
            }

            // For OAuth flows (Google, Facebook, etc.) — go straight to dashboard.
            return NextResponse.redirect(`${origin}/dashboard`);
        }
    }

    // Handle token-verified flows (e.g. email confirmation via PKCE token):
    // Supabase verifies the token server-side and sets a session cookie — no ?code= in the URL.
    // We detect this by checking if a valid session already exists.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/fr/login?success=verified`);
    }

    // return the user to the forgot-password page with an error message
    return NextResponse.redirect(`${origin}/fr/forgot-password?message=Reset link is invalid or has expired. Please request a new one.`);
}
