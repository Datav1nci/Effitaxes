"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendProfileUpdateNotification } from "@/lib/mail";
import { HouseholdMember } from "@/lib/householdTypes";

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
            return { success: false, error: `Failed to save profile data: ${dbError.message} ${dbError.details || ''}` };
        }

        // Sync Personal Info to Main Profile and Auth Metadata
        if (data.personal) {
            const { firstName, lastName, email, phone } = data.personal;

            // 1. Update Main Profile Table Columns
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    first_name: firstName,
                    last_name: lastName,
                    email: email, // Sync contact email
                    phone: phone,
                })
                .eq("id", user.id);

            if (profileError) {
                console.error("Failed to sync main profile:", profileError);
            }

            // 2. Update Auth Metadata (for Header/Nav)
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    // We don't update the auth email itself as that changes login credentials and requires verification
                }
            });

            if (authError) {
                console.error("Failed to sync auth metadata:", authError);
            }
        }

        // Fetch Household for Notification
        let householdMembers: HouseholdMember[] = [];
        try {
            const { data: household } = await supabase
                .from("households")
                .select("id")
                .eq("primary_person_id", user.id)
                .single();

            if (household) {
                const { data: members } = await supabase
                    .from("household_members")
                    .select("*")
                    .eq("household_id", household.id);

                if (members) householdMembers = members;
            }
        } catch (err) {
            console.error("Error fetching household for notification:", err);
        }

        // Send Email Notification
        const { error: emailError } = await sendProfileUpdateNotification({
            ...data,
            household: householdMembers
        });
        if (emailError) {
            console.error("Failed to send update email:", emailError);
            // Don't fail the request if email fails, but log it
        }

        revalidatePath("/[locale]/dashboard", "page");
        revalidatePath("/[locale]/dashboard/tax-profile", "page");

        return { success: true };
    } catch (error) {
        console.error("Failed to update tax data:", error);
        return { success: false, error: "Failed to update tax data" };
    }
}
