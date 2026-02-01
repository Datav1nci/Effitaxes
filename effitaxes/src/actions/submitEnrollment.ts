"use server";

import { sendEnrollmentNotification, sendEnrollmentReceipt } from "@/lib/mail";
import { createClient } from "@/utils/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitEnrollment(data: any): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error: dbError } = await supabase
                .from("profiles")
                .update({
                    tax_data: data,
                    enrollment_status: "completed",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (dbError) {
                console.error("Failed to save to database:", dbError);
                return { success: false, error: `Failed to save profile data: ${dbError.message}` };
            }
        }

        // 1. Notify Admin
        const { success: adminSuccess, error: adminError } = await sendEnrollmentNotification(data);
        if (!adminSuccess) {
            console.error("Failed to send admin notification:", adminError);
            // We can decide to just log this, or return error. 
            // Usually valid submission + db save is success for the user, even if admin email fails (rare).
        }

        // 2. Receipt to Customer
        if (data.personal?.email && data.personal?.firstName) {
            await sendEnrollmentReceipt(data.personal.email, data.personal.firstName);
        }

        console.log("Enrollment submitted successfully.");
        return { success: true };
    } catch (error) {
        console.error("Failed to submit enrollment:", error);
        return { success: false, error: "Failed to submit enrollment" };
    }
}
