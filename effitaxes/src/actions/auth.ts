"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Provider } from "@supabase/supabase-js";

// Admin client for managing login attempts logic securely
const getAdminClient = () => {
    // In a real scenario, ensure this key is available serverside
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!url || !key) {
        console.error("Missing Supabase Service Role Key");
        return null; // Handle gracefully or throw
    }
    return createAdminClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();
    const adminSupabase = getAdminClient();

    // 1. Check for Lock (only if admin client is available)
    if (adminSupabase) {
        const { data: attempt } = await adminSupabase
            .from("login_attempts")
            .select("*")
            .eq("email", email)
            .single();

        if (attempt) {
            // Check if locked
            if (attempt.locked_until && new Date(attempt.locked_until) > new Date()) {
                return redirect("/login?message=Account locked. Contact 450-259-1829 or reset login.");
            }
        }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Login Check Error:", error.message);

        // 2. Increment Failed Attempts
        if (adminSupabase) {
            const { data: attempt } = await adminSupabase
                .from("login_attempts")
                .select("*")
                .eq("email", email)
                .single();

            const currentCount = (attempt?.count || 0) + 1;
            const updateData: { email: string; count: number; last_attempt: string; locked_until?: string } = {
                email,
                count: currentCount,
                last_attempt: new Date().toISOString(),
            };

            // Lock if > 5 attempts
            if (currentCount > 5) {
                // Lock for 30 minutes, or Indefinite? 
                // User asked: "get's lock and must contact ... or reset password"
                // So let's lock for a very long time (e.g. 24 hours) or until reset.
                const lockTime = new Date();
                lockTime.setHours(lockTime.getHours() + 24);
                updateData.locked_until = lockTime.toISOString();
            }

            await adminSupabase.from("login_attempts").upsert(updateData);

            if (currentCount > 5) {
                return redirect("/login?message=Account locked. Contact 450-259-1829.");
            }
        }

        return redirect("/login?message=Could not authenticate user");
    }

    // 3. Success - Clear Attempts
    if (adminSupabase) {
        await adminSupabase.from("login_attempts").delete().eq("email", email);
    }

    return redirect("/dashboard");
}

export async function signup(formData: FormData) {
    const origin = (await headers()).get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const phone = formData.get("phone") as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
            },
        },
    });

    if (error) {
        console.log(error);
        if (error.code === "user_already_exists" || error.message.includes("already registered")) {
            return redirect("/login?message=User already registered. Please sign in.");
        }
        return redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }

    return redirect("/login?success=check_email");
}

export async function signInWithProvider(provider: Provider) {
    const origin = (await headers()).get("origin");
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        return redirect("/login?message=Could not authenticate user");
    }

    if (data.url) {
        return redirect(data.url);
    }
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
}

export async function forgotPassword(formData: FormData) {
    const email = formData.get("email") as string;
    const locale = (formData.get("locale") as string) || "fr";
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    if (!email) {
        return redirect(`/${locale}/forgot-password?message=Email is required`);
    }

    // Unlock account if locked (Reset flow implicitly unlocks by proving ownership via email)
    // Or we rely on the fact that once they reset, they can login.
    // BUT our login check blocks them if "locked_until" is set. 
    // So we should clear the lock request HERE or upon successful reset?
    // Safer to clear it upon successful reset.

    // Actually, sending the email doesn't prove anything yet.
    // They need to click the link.

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?type=recovery&next=/${locale}/reset-password`,
    });

    if (error) {
        console.error("Forgot Password Error:", error);
        // Don't reveal if user exists or not for security, but Supabase might error.
        return redirect(`/${locale}/forgot-password?message=Could not send reset link. Try again.`);
    }

    return redirect(`/${locale}/forgot-password?success=true`);
}

export async function resetPassword(formData: FormData) {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
        return redirect("/reset-password?message=Passwords do not match");
    }

    const supabase = await createClient();
    const adminSupabase = getAdminClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login?message=Session expired. Please request a new reset link.");
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return redirect("/reset-password?message=Failed to update password");
    }

    // Clear any lock
    if (adminSupabase && user.email) {
        await adminSupabase.from("login_attempts").delete().eq("email", user.email);
    }

    return redirect("/login?message=Password updated successfully. Please sign in.");
}
