import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const locales = ["fr", "en"];
const defaultLocale = "fr";

export async function middleware(request: NextRequest) {
    const { pathname, searchParams, origin } = request.nextUrl;
    const host = request.headers.get('host') || '';

    // Normalize non-www to www so the PKCE verifier cookie (stored on www.effitaxes.com)
    // is always accessible during the code exchange on the reset-password page.
    if (host === 'effitaxes.com') {
        const wwwUrl = new URL(request.url);
        wwwUrl.host = 'www.effitaxes.com';
        return NextResponse.redirect(wwwUrl.toString(), { status: 301 });
    }

    // Skip localization for API and auth routes
    if (pathname.startsWith('/api') || pathname.startsWith('/auth')) {
        return await updateSession(request);
    }

    // Safety net: if Supabase falls back to the site URL (e.g. https://effitaxes.com?code=XXX)
    // because the redirectTo URL was rejected by the allowlist, intercept the code here and
    // route it directly to the reset-password page. The client-side component on that page
    // will exchange the PKCE code in the browser (where the verifier is stored).
    const code = searchParams.get("code");
    const type = searchParams.get("type");
    const isOnResetPage = pathname.includes("/reset-password");
    if (code && (type === "recovery" || !pathname.startsWith("/auth/callback")) && !isOnResetPage) {
        const locale = locales.find(l => pathname.startsWith(`/${l}`)) ?? defaultLocale;
        const resetUrl = new URL(`${origin}/${locale}/reset-password`);
        resetUrl.searchParams.set("code", code);
        return NextResponse.redirect(resetUrl.toString());
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
