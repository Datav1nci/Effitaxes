import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * Dedicated callback handler for password recovery (reset password) flows.
 * The ForgotPasswordForm sets `redirectTo` to this URL so that Supabase
 * redirects here after verifying the PKCE token — no need to inspect AMR claims.
 *
 * NOTE: This URL must be listed in your Supabase project's
 *       "Redirect URLs" allowlist:
 *         https://www.effitaxes.com/auth/callback/recovery
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Session is live — send the user to the reset-password page.
            // The page detects the active session and shows the new-password form.
            return NextResponse.redirect(`${origin}/fr/reset-password`);
        }
    }

    // Code missing or exchange failed — tell the user to request a new link.
    return NextResponse.redirect(
        `${origin}/fr/forgot-password?message=Reset link is invalid or has expired. Please request a new one.`
    );
}
