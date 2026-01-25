"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Not authenticated");
    }

    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const phone = formData.get("phone") as string;

    // 1. Update the public profile table
    const { error } = await supabase
        .from("profiles")
        .update({
            first_name,
            last_name,
            phone,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        console.error("Profile update error:", error);
        throw new Error("Could not update profile");
    }

    // 2. Update the auth metadata (so Header initials/name update correctly)
    const { error: metaError } = await supabase.auth.updateUser({
        data: {
            first_name,
            last_name,
            phone,
        },
    });

    if (metaError) {
        console.error("Metadata update error:", metaError);
        // Non-critical, but good to know
    }

    // Revalidate the layout so Header and Dashboard update
    revalidatePath("/", "layout");

    return { success: true };
}
