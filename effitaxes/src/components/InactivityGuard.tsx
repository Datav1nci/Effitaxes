"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// Auto-logout after 30 minutes of inactivity (recommended for financial apps)
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];

const AUTH_PAGES = ["/login", "/forgot-password", "/reset-password", "/inscription"];

export default function InactivityGuard() {
    const router = useRouter();
    const pathname = usePathname();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Don't run on public auth pages
        if (AUTH_PAGES.some(p => pathname?.includes(p))) return;

        const supabase = createClient();

        const signOutDueToInactivity = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return; // Already signed out
            await supabase.auth.signOut();
            router.push("/fr/login?message=Session expired due to inactivity.");
        };

        const resetTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(signOutDueToInactivity, INACTIVITY_TIMEOUT_MS);
        };

        // Start the timer on mount
        resetTimer();

        // Reset on user activity
        ACTIVITY_EVENTS.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            ACTIVITY_EVENTS.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [pathname, router]);

    return null; // No UI — purely behavioural
}
