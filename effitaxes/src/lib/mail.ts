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
    updatedSections?: string[];
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

    // Section display name map
    const sectionLabels: Record<string, string> = {
        personal: "Personal Information",
        selection: "Income Sources",
        selfEmployed: "Self-Employed",
        car: "Car Expenses",
        rental: "Rental Income",
        workFromHome: "Work From Home",
        household: "Household Members",
    };

    const changedSections = data.updatedSections ?? [];

    const changedBanner = changedSections.length > 0
        ? `
        <div style="background-color:#f0fdf4;border:2px solid #86efac;border-radius:10px;padding:18px 22px;margin-bottom:28px;">
            <p style="margin:0 0 10px 0;font-size:15px;font-weight:700;color:#166534;">
                ✅ &nbsp;Sections Updated This Session:
            </p>
            <ul style="margin:0;padding-left:20px;">
                ${changedSections.map(s =>
            `<li style="font-size:14px;color:#15803d;font-weight:600;margin-bottom:4px;">${sectionLabels[s] ?? s}</li>`
        ).join('')}
            </ul>
        </div>`
        : `<div style="background-color:#fefce8;border:1px solid #fde047;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
            <p style="margin:0;font-size:13px;color:#854d0e;">⚠️ &nbsp;No specific sections were tracked — showing full profile below.</p>
        </div>`;

    // Helper to render a key-value data block
    const renderDataBlock = (obj: Record<string, unknown> | undefined, label: string) => {
        if (!obj || Object.keys(obj).length === 0) return '';
        const rows = Object.entries(obj)
            .filter(([, v]) => v !== null && v !== undefined && v !== '')
            .map(([k, v]) => {
                const displayKey = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                const displayVal = typeof v === 'object' ? `<pre style="margin:0;font-size:12px;background:#f8fafc;padding:6px 8px;border-radius:4px;overflow:auto;">${JSON.stringify(v, null, 2)}</pre>` : String(v);
                return `<tr>
                    <td style="padding:6px 10px;font-size:13px;color:#64748b;font-weight:500;white-space:nowrap;vertical-align:top;width:40%;">${displayKey}</td>
                    <td style="padding:6px 10px;font-size:13px;color:#0f172a;vertical-align:top;">${displayVal}</td>
                </tr>`;
            }).join('');
        if (!rows) return '';
        return `
        <div style="margin-bottom:24px;">
            <h3 style="margin:0 0 8px 0;font-size:14px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e0e7ff;padding-bottom:6px;">${label}</h3>
            <table style="width:100%;border-collapse:collapse;">${rows}</table>
        </div>`;
    };

    // Personal Info rows (cherry-pick for readability)
    const p = data.personal || {};
    const personalRows = [
        ['First Name', p.firstName], ['Last Name', p.lastName],
        ['Email', p.email], ['Phone', p.phone],
    ].filter(([, v]) => v).map(([k, v]) =>
        `<tr><td style="padding:6px 10px;font-size:13px;color:#64748b;font-weight:500;width:40%;">${k}</td>
         <td style="padding:6px 10px;font-size:13px;color:#0f172a;">${v}</td></tr>`
    ).join('');

    const personalBlock = personalRows ? `
    <div style="margin-bottom:24px;">
        <h3 style="margin:0 0 8px 0;font-size:14px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e0e7ff;padding-bottom:6px;">Personal Information</h3>
        <table style="width:100%;border-collapse:collapse;">${personalRows}</table>
    </div>` : '';

    const incomeSources = (data.incomeSources || []).join(', ');

    const householdBlock = data.household && data.household.length > 0
        ? `<div style="margin-bottom:24px;">
            <h3 style="margin:0 0 8px 0;font-size:14px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e0e7ff;padding-bottom:6px;">Household Members</h3>
            ${data.household.map((m, i) => `
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px 14px;margin-bottom:10px;">
                    <p style="margin:0 0 4px 0;font-size:14px;font-weight:700;color:#1e293b;">${i + 1}. ${m.first_name} ${m.last_name}</p>
                    <p style="margin:0;font-size:13px;color:#64748b;">Relationship: ${m.relationship} &nbsp;|&nbsp; DOB: ${m.date_of_birth || 'N/A'} &nbsp;|&nbsp; Dependent: ${m.is_dependent ? 'Yes' : 'No'}</p>
                    ${m.tax_data && Object.keys(m.tax_data).length > 0
                ? `<pre style="margin:6px 0 0;font-size:12px;background:#fff;border:1px solid #e2e8f0;padding:8px;border-radius:4px;overflow:auto;">${JSON.stringify(m.tax_data, null, 2)}</pre>`
                : ''}
                </div>`).join('')}
        </div>`
        : `<div style="margin-bottom:24px;">
            <h3 style="margin:0 0 8px 0;font-size:14px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e0e7ff;padding-bottom:6px;">Household Members</h3>
            <p style="font-size:13px;color:#94a3b8;">No household members added.</p>
        </div>`;

    const html = `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"/></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:24px;">
        <div style="max-width:680px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

            <!-- Header -->
            <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:28px 32px;">
                <h1 style="margin:0;font-size:22px;color:#fff;font-weight:700;">📋 Tax Profile Updated</h1>
                <p style="margin:6px 0 0;font-size:14px;color:#c7d2fe;">${firstName} ${lastName} &mdash; ${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            <!-- Body -->
            <div style="padding:28px 32px;">
                ${changedBanner}

                ${personalBlock}

                ${incomeSources ? `<div style="margin-bottom:24px;">
                    <h3 style="margin:0 0 8px 0;font-size:14px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e0e7ff;padding-bottom:6px;">Income Sources</h3>
                    <p style="margin:0;font-size:13px;color:#0f172a;">${incomeSources}</p>
                </div>` : ''}

                ${renderDataBlock(data.selfEmployed as Record<string, unknown>, 'Self-Employed')}
                ${renderDataBlock(data.car as Record<string, unknown>, 'Car Expenses')}
                ${renderDataBlock(data.rental as Record<string, unknown>, 'Rental Income')}
                ${renderDataBlock(data.workFromHome as Record<string, unknown>, 'Work From Home')}

                ${householdBlock}

                <!-- Raw JSON Data -->
                <div style="margin-top:32px;border-top:2px dashed #e2e8f0;padding-top:24px;">
                    <h3 style="margin:0 0 10px 0;font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">📎 Raw Data (JSON — for processing)</h3>
                    <pre style="margin:0;font-size:11.5px;line-height:1.6;background:#0f172a;color:#e2e8f0;padding:16px;border-radius:8px;overflow:auto;white-space:pre-wrap;word-break:break-word;">${JSON.stringify({ ...data, updatedSections: undefined }, null, 2)}</pre>
                </div>
            </div>

            <!-- Footer -->
            <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">This email was generated automatically by Effitaxes. Do not reply.</p>
            </div>
        </div>
    </body></html>
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
