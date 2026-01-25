import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const locales = ["fr", "en"];
const defaultLocale = "fr";

export async function middleware(request: NextRequest) {
    // 1. Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl;
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
        '/((?!_next/static|_next/image|images|fonts|favicon.ico).*)',
    ],
};
