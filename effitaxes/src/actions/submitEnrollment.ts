"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitEnrollment(data: any): Promise<{ success: boolean; error?: string }> {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error("Missing RESEND_API_KEY");
            return { success: false, error: "Configuration Error: Missing API Key" };
        }

        const subject = `New Tax Enrollment: ${data.personal.firstName} ${data.personal.lastName}`;

        // Simple HTML construction
        const htmlBody = `
            <h1>Tax Enrollment Form 2025</h1>
            <h2>Personal Info</h2>
            <pre>${JSON.stringify(data.personal, null, 2)}</pre>
            
            <h2>Income Sources</h2>
            <p>${data.incomeSources.join(', ')}</p>
            
            ${data.selfEmployed ? `<h2>Self-Employed</h2><pre>${JSON.stringify(data.selfEmployed, null, 2)}</pre>` : ''}
            ${data.car ? `<h2>Car Expenses</h2><pre>${JSON.stringify(data.car, null, 2)}</pre>` : ''}
            ${data.rental ? `<h2>Rental Income</h2><pre>${JSON.stringify(data.rental, null, 2)}</pre>` : ''}
        `;

        const { data: emailData, error } = await resend.emails.send({
            from: "Effitaxes Enrollment <onboarding@resend.dev>",
            to: ["yberjman@gmail.com"], // Hardcoded for now per user context or general default? I'll use a placeholder variable.
            // keeping it simple for dev. Ideally process.env.CONTACT_EMAIL
            subject: subject,
            html: htmlBody,
        });

        if (error) {
            console.error("Resend API Failed:", error);
            return { success: false, error: error.message };
        }

        console.log("Email sent successfully. ID:", emailData?.id);
        return { success: true };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: "Failed to send email" };
    }
}
