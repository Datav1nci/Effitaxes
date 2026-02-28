import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const locales = ["fr", "en"];
const defaultLocale = "fr";

export async function middleware(request: NextRequest) {
    const { pathname, searchParams, origin } = request.nextUrl;

    // Skip localization for API routes
    if (pathname.startsWith('/api')) {
        return await updateSession(request);
    }

    // Safety net: if Supabase falls back to the site URL (e.g. https://effitaxes.com?code=XXX)
    // because the redirectTo URL was rejected by the allowlist, intercept the code here
    // and forward it to /auth/callback with the correct type and next params.
    const code = searchParams.get("code");
    const type = searchParams.get("type");
    if (code && !pathname.startsWith("/auth/callback")) {
        const callbackUrl = new URL(`${origin}/auth/callback`);
        callbackUrl.searchParams.set("code", code);
        // Preserve type if present, otherwise assume recovery (OAuth codes land at /auth/callback directly)
        callbackUrl.searchParams.set("type", type ?? "recovery");
        callbackUrl.searchParams.set("next", `/${defaultLocale}/reset-password`);
        return NextResponse.redirect(callbackUrl.toString());
    }

    // 1. Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        // Redirect if there is no locale
        const locale = defaultLocale;
        request.nextUrl.pathname = `/${locale}${pathname}`;
        // If we redirect, we let the next request handle the session update
        return NextResponse.redirect(request.nextUrl);
    }

    // 2. If locale is present, update Supabase session
    return await updateSession(request);
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        // Skip all static files (images, favicon, etc)
        // Removed 'api' from exclusion so auth runs on API routes too
        '/((?!_next/static|_next/image|images|fonts|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
