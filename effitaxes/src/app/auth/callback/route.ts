import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    // BUT for security hardening, we might want to force login after verification regardless of "next".
    // Let's default to login with a success message.
    const defaultNext = "/login?success=verified";
    const next = searchParams.get("next") ?? defaultNext;

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Hardening: Sign out immediately to force manual login with password
            await supabase.auth.signOut();

            // Force redirect to login page with verified message
            return NextResponse.redirect(`${origin}/login?success=verified`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
