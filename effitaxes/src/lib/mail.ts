"use server";

import { Resend } from "resend";

// Initialize Resend with API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuration Constants
const EMAILS = {
    ADMIN: "effitaxes@gmail.com", // Main admin email
    SENDER_NO_REPLY: "Effitaxes <no-reply@effitaxes.com>",
    SENDER_SUPPORT: "Effitaxes Support <support@effitaxes.com>",
    SENDER_ONBOARDING: "Effitaxes Enrollment <onboarding@effitaxes.com>" // Or use no-reply if domain not verified
};

import { HouseholdMember } from "@/lib/householdTypes";

// --- Types ---

interface PersonalInfo {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

interface EnrollmentData {
    personal: PersonalInfo;
    incomeSources: string[];
    selfEmployed?: Record<string, unknown>;
    car?: Record<string, unknown>;
    rental?: Record<string, unknown>;
    workFromHome?: Record<string, unknown>;
    household?: HouseholdMember[];
}

interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    message: string;
}

// --- Helpers ---

/**
 * Send an email using Resend
 */
async function sendEmail({
    to,
    subject,
    html,
    from = EMAILS.SENDER_NO_REPLY,
    replyTo
}: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is missing. Email not sent.");
        return { success: false, error: "Missing API Key" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html,
            replyTo
        });

        if (error) {
            console.error("Resend API Error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Unexpected Email Error:", error);
        return { success: false, error: "Unexpected error" };
    }
}

// --- Admin Notifications ---

export async function sendEnrollmentNotification(data: EnrollmentData) {
    const subject = `New Tax Enrollment: ${data.personal.firstName} ${data.personal.lastName}`;
    const incomeSourcesList = data.incomeSources ? data.incomeSources.join(', ') : 'None';

    const html = `
        <h1>New Enrollment Received</h1>
        <h2>Personal Info</h2>
        <pre>${JSON.stringify(data.personal, null, 2)}</pre>
        
        <h2>Income Sources</h2>
        <p>${incomeSourcesList}</p>
        
        ${data.selfEmployed ? `<h2>Self-Employed</h2><pre>${JSON.stringify(data.selfEmployed, null, 2)}</pre>` : ''}
        ${data.car ? `<h2>Car Expenses</h2><pre>${JSON.stringify(data.car, null, 2)}</pre>` : ''}
        ${data.rental ? `<h2>Rental Income</h2><pre>${JSON.stringify(data.rental, null, 2)}</pre>` : ''}
        ${data.workFromHome ? `<h2>Work From Home</h2><pre>${JSON.stringify(data.workFromHome, null, 2)}</pre>` : ''}
        
        <h2>Household Members</h2>
        ${data.household && data.household.length > 0 ?
            `<ul>
                ${data.household.map(m => `
                    <li>
                        <strong>${m.first_name} ${m.last_name}</strong> (${m.relationship})<br/>
                        DOB: ${m.date_of_birth || 'N/A'}<br/>
                        Notes: <pre>${JSON.stringify(m.tax_data, null, 2)}</pre>
                    </li>
                `).join('')}
            </ul>`
            : '<p>No household members added.</p>'}
    `;

    return sendEmail({
        to: EMAILS.ADMIN,
        subject,
        html,
        from: EMAILS.SENDER_ONBOARDING
    });
}

export async function sendContactFormNotification(data: ContactFormData) {
    const subject = `Nouveau message de ${data.name}`;

    const html = `
        <h1>Nouveau message reçu via le site web Effitaxes</h1>
        <p><strong>Nom:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Téléphone:</strong> ${data.phone || "Non fourni"}</p>
        <hr />
        <h2>Message:</h2>
        <p style="white-space: pre-wrap;">${data.message}</p>
    `;

    return sendEmail({
        to: EMAILS.ADMIN,
        subject,
        html,
        replyTo: data.email,
        from: EMAILS.SENDER_SUPPORT
    });
}

export async function sendProfileUpdateNotification(data: Partial<EnrollmentData>) {
    const firstName = data.personal?.firstName || "Unknown";
    const lastName = data.personal?.lastName || "Client";
    const subject = `Updated Tax Profile: ${firstName} ${lastName}`;

    const html = `
        <h1>Tax Profile Updated</h1>
        <p>The client <strong>${firstName} ${lastName}</strong> has updated their tax profile.</p>
        
        <h2>New Data</h2>
        <pre>${JSON.stringify(data, null, 2)}</pre>

        <h2>Household Members</h2>
        ${data.household && data.household.length > 0 ?
            `<ul>
                ${data.household.map(m => `
                    <li>
                        <strong>${m.first_name} ${m.last_name}</strong> (${m.relationship})<br/>
                        DOB: ${m.date_of_birth || 'N/A'}<br/>
                        Notes: <pre>${JSON.stringify(m.tax_data, null, 2)}</pre>
                    </li>
                `).join('')}
            </ul>`
            : '<p>No household members added.</p>'}
    `;

    return sendEmail({
        to: EMAILS.ADMIN,
        subject,
        html,
        from: EMAILS.SENDER_SUPPORT
    });
}

// --- Customer Receipts ---

export async function sendEnrollmentReceipt(email: string, firstName: string) {
    const subject = "Confirmation: Nous avons reçu votre dossier fiscal";

    const html = `
        <h1>Bonjour ${firstName},</h1>
        <p>Nous confirmons la réception de votre dossier d'inscription pour l'année fiscale en cours.</p>
        <p>Notre équipe va examiner vos informations et vous contactera si des documents supplémentaires sont nécessaires.</p>
        <p>Vous pouvez à tout moment vous connecter à votre <a href="https://effitaxes.com/dashboard">Dashboard</a> pour mettre à jour vos informations.</p>
        <br />
        <p>Cordialement,</p>
        <p><strong>L'équipe Effitaxes</strong></p>
    `;

    return sendEmail({
        to: email,
        subject,
        html,
        from: EMAILS.SENDER_SUPPORT
    });
}

export async function sendContactFormReceipt(email: string, name: string) {
    const subject = "Confirmation de réception - Effitaxes";

    const html = `
        <h1>Bonjour ${name},</h1>
        <p>Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.</p>
        <p>Un membre de notre équipe vous répondra dans les plus brefs délais.</p>
        <br />
        <p>Cordialement,</p>
        <p><strong>L'équipe Effitaxes</strong></p>
    `;

    return sendEmail({
        to: email,
        subject,
        html,
        from: EMAILS.SENDER_SUPPORT
    });
}
