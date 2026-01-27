"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateTaxData(data: any): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        const { error: dbError } = await supabase
            .from("profiles")
            .update({
                tax_data: data,
                updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

        if (dbError) {
            console.error("Failed to update tax data:", dbError);
            return { success: false, error: "Failed to save profile data" };
        }

        revalidatePath("/[locale]/dashboard", "page");
        revalidatePath("/[locale]/dashboard/tax-profile", "page");

        return { success: true };
    } catch (error) {
        console.error("Failed to update tax data:", error);
        return { success: false, error: "Failed to update tax data" };
    }
}
