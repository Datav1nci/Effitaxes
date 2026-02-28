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
            // For password recovery flows, keep the session alive so the user
            // can update their password on the reset-password page.
            if (type === "recovery" && next) {
                return NextResponse.redirect(`${origin}${next}`);
            }

            // For all other flows (e.g., email confirmation): sign out immediately
            // to force the user to log in manually with their new credentials.
            await supabase.auth.signOut();
            return NextResponse.redirect(`${origin}/login?success=verified`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
