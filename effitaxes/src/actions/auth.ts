"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Provider } from "@supabase/supabase-js";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect("/login?message=Could not authenticate user");
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
        if (error.code === "user_already_exists" || error.message.includes("already registered")) {
            return redirect("/login?message=User already registered. Please sign in.");
        }
        return redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }

    // If no error, check if session is created (auto-confirm or existing session)
    // If we are here and no error, standard flow involves email confirmation usually
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
