"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

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

        // Send Email Notification
        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                const subject = `Updated Tax Profile: ${data.personal?.firstName} ${data.personal?.lastName}`;

                const htmlBody = `
                    <h1>Tax Profile Updated</h1>
                    <p>The client <strong>${data.personal?.firstName} ${data.personal?.lastName}</strong> has updated their tax profile.</p>
                    
                    <h2>Personal Info</h2>
                    <pre>${JSON.stringify(data.personal, null, 2)}</pre>
                    
                    <h2>Income Sources</h2>
                    <p>${Array.isArray(data.incomeSources) ? data.incomeSources.join(', ') : ''}</p>
                    
                    ${data.selfEmployed ? `<h2>Self-Employed</h2><pre>${JSON.stringify(data.selfEmployed, null, 2)}</pre>` : ''}
                    ${data.car ? `<h2>Car Expenses</h2><pre>${JSON.stringify(data.car, null, 2)}</pre>` : ''}
                    ${data.rental ? `<h2>Rental Income</h2><pre>${JSON.stringify(data.rental, null, 2)}</pre>` : ''}
                    ${data.workFromHome ? `<h2>Work From Home</h2><pre>${JSON.stringify(data.workFromHome, null, 2)}</pre>` : ''}
                `;

                await resend.emails.send({
                    from: "Effitaxes Update <onboarding@resend.dev>",
                    to: ["effitaxes@gmail.com"],
                    subject: subject,
                    html: htmlBody,
                });
            } catch (emailError) {
                console.error("Failed to send update email:", emailError);
                // Don't fail the request if email fails, but log it
            }
        }

        revalidatePath("/[locale]/dashboard", "page");
        revalidatePath("/[locale]/dashboard/tax-profile", "page");

        return { success: true };
    } catch (error) {
        console.error("Failed to update tax data:", error);
        return { success: false, error: "Failed to update tax data" };
    }
}
