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
    /** Uploaded document links — used in enrollment notification to admin only */
    documents?: { fileName: string; label?: string; downloadUrl?: string }[];
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
    replyTo,
    attachments,
}: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
    attachments?: Array<{ filename: string; content: string }>; // base64 content
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
            replyTo,
            ...(attachments && attachments.length > 0 ? { attachments } : {}),
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
    const subject = `New Tax Enrollment: ${data.personal.lastName?.toUpperCase()}, ${data.personal.firstName}`;
    const incomeSourcesList = data.incomeSources ? data.incomeSources.join(', ') : 'None';

    // Build documents section
    const documentsBlock = data.documents && data.documents.length > 0
        ? `<h2 style="color:#4f46e5;">📎 Uploaded Documents (${data.documents.length})</h2>
           <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:16px;">
               <thead>
                   <tr style="background:#f8fafc;">
                       <th style="padding:8px 12px;font-size:12px;font-weight:700;color:#64748b;text-align:left;text-transform:uppercase;">File</th>
                       <th style="padding:8px 12px;font-size:12px;font-weight:700;color:#64748b;text-align:center;text-transform:uppercase;">Download</th>
                   </tr>
               </thead>
               <tbody>
                   ${data.documents.map(f => `
                       <tr>
                           <td style="padding:10px 12px;font-size:13px;color:#0f172a;border-bottom:1px solid #f1f5f9;">
                               ${f.fileName}
                               ${f.label ? `<br/><span style="font-size:11px;color:#64748b;">${f.label}</span>` : ''}
                           </td>
                           <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">
                               ${f.downloadUrl
                                   ? `<a href="${f.downloadUrl}" style="display:inline-block;padding:6px 16px;background:#4f46e5;color:#fff;font-size:12px;font-weight:700;text-decoration:none;border-radius:8px;">⬇ Download</a>`
                                   : '<span style="font-size:12px;color:#94a3b8;">—</span>'
                               }
                           </td>
                       </tr>`).join('')}
               </tbody>
           </table>
           <p style="font-size:12px;color:#94a3b8;">🔒 Download links expire in 90 days. Files are stored securely in Supabase Storage.</p>`
        : `<h2 style="color:#94a3b8;">📎 Documents</h2><p style="color:#94a3b8;font-size:13px;">No documents uploaded by this client.</p>`;

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

        ${documentsBlock}
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

export async function sendDocumentUploadNotification(data: {
    firstName: string;
    lastName: string;
    email: string;
    files: { fileName: string; label?: string; downloadUrl?: string }[];
}) {
    const subject = `New Document Upload: ${data.firstName} ${data.lastName}`;
    const timestamp = new Date().toLocaleDateString('en-CA', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const fileRows = data.files.map(f =>
        `<tr>
            <td style="padding:10px 12px;font-size:13px;color:#0f172a;border-bottom:1px solid #f1f5f9;">
                ${f.fileName}
                ${f.label ? `<br/><span style="font-size:11px;color:#64748b;">${f.label}</span>` : ''}
            </td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">
                ${f.downloadUrl
            ? `<a href="${f.downloadUrl}" style="display:inline-block;padding:6px 16px;background:#4f46e5;color:#fff;font-size:12px;font-weight:700;text-decoration:none;border-radius:8px;">⬇ Download</a>`
            : '<span style="font-size:12px;color:#94a3b8;">—</span>'
        }
            </td>
        </tr>`
    ).join('');

    const html = `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"/></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:28px 32px;">
                <h1 style="margin:0;font-size:22px;color:#fff;font-weight:700;">📎 New Document Upload</h1>
                <p style="margin:6px 0 0;font-size:14px;color:#c7d2fe;">
                    ${data.firstName} ${data.lastName} &mdash; ${timestamp}
                </p>
            </div>
            <!-- Body -->
            <div style="padding:28px 32px;">
                <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
                    <p style="margin:0;font-size:14px;font-weight:700;color:#166534;">
                        ✅ &nbsp;${data.files.length} file${data.files.length !== 1 ? 's' : ''} uploaded by ${data.firstName} ${data.lastName}
                    </p>
                    ${data.email ? `<p style="margin:4px 0 0;font-size:13px;color:#15803d;">${data.email}</p>` : ''}
                </div>

                <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                    <thead>
                        <tr style="background:#f8fafc;">
                            <th style="padding:8px 12px;font-size:12px;font-weight:700;color:#64748b;text-align:left;text-transform:uppercase;letter-spacing:0.05em;">File</th>
                            <th style="padding:8px 12px;font-size:12px;font-weight:700;color:#64748b;text-align:center;text-transform:uppercase;letter-spacing:0.05em;">Download</th>
                        </tr>
                    </thead>
                    <tbody>${fileRows}</tbody>
                </table>

                <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;">🔒 Download links expire in 7 days. Files are stored securely in Supabase Storage.</p>
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
        from: EMAILS.SENDER_SUPPORT,
    });
}

// --- Customer Receipts ---

export async function sendEnrollmentReceipt(email: string, firstName: string, language: "fr" | "en" = "fr") {
    const isFr = language === "fr";

    const copy = {
        subject: isFr
            ? "Confirmation d'inscription — Effitaxes"
            : "Enrollment Confirmation — Effitaxes",
        greeting: isFr ? `Bonjour ${firstName},` : `Hello ${firstName},`,
        confirmed: isFr ? "Dossier reçu avec succès ✓" : "Application Successfully Received ✓",
        p1: isFr
            ? "Nous confirmons la réception de votre dossier d'inscription pour l'année fiscale <strong>2025</strong>. Notre équipe va examiner vos informations dans les plus brefs délais."
            : "We have successfully received your tax enrollment application for the <strong>2025</strong> fiscal year. Our team will review your information shortly.",
        p2: isFr
            ? "Si des documents supplémentaires sont requis, nous vous contacterons directement."
            : "If any additional documents are required, we will contact you directly.",
        docsTitle: isFr ? "📎 Téléverser des documents" : "📎 Upload Documents",
        docsBody: isFr
            ? "Vous pouvez téléverser vos documents fiscaux (T4, relevés, reçus, etc.) directement depuis votre tableau de bord en tout temps."
            : "You can upload your tax documents (T4 slips, statements, receipts, etc.) directly from your dashboard at any time.",
        ctaLabel: isFr ? "Accéder à mon tableau de bord" : "Go to my Dashboard",
        closing: isFr ? "Cordialement," : "Best regards,",
        team: isFr ? "L'équipe Effitaxes" : "The Effitaxes Team",
        footer: isFr
            ? "Ce courriel a été envoyé automatiquement. Merci de ne pas y répondre directement."
            : "This email was sent automatically. Please do not reply directly to this message.",
    };

    const dashboardUrl = `https://www.effitaxes.com/${language}/dashboard`;

    const html = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${copy.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f4f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(160deg,#071525 0%,#0a2040 100%);padding:36px 40px;text-align:center;">
            <!-- Logo wordmark — matches website BrandName.tsx exactly -->
            <div style="display:inline-block;font-size:30px;font-weight:700;letter-spacing:0.12em;font-family:Arial,Helvetica,sans-serif;">
              <span style="color:#3FBDED;">EFF</span><span style="color:#0274A9;">ITAXES</span>
            </div>
            <p style="margin:10px 0 0;font-size:11px;color:#5a8aaa;letter-spacing:0.18em;text-transform:uppercase;">
              ${isFr ? "Services fiscaux professionnels" : "Professional Tax Services"}
            </p>
          </td>
        </tr>

        <!-- Green confirmation banner -->
        <tr>
          <td style="background:#ecfdf5;border-bottom:2px solid #6ee7b7;padding:20px 40px;text-align:center;">
            <span style="display:inline-block;font-size:15px;font-weight:700;color:#065f46;letter-spacing:0.02em;">
              ${copy.confirmed}
            </span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 24px;font-size:22px;font-weight:700;color:#0f172a;">${copy.greeting}</p>

            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">${copy.p1}</p>
            <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#334155;">${copy.p2}</p>

            <!-- Document upload section -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:32px;">
              <tr>
                <td style="padding:24px 28px;">
                  <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#0f172a;">${copy.docsTitle}</p>
                  <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">${copy.docsBody}</p>
                  <a href="${dashboardUrl}" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#06b6d4);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;letter-spacing:0.02em;">
                    ${copy.ctaLabel} →
                  </a>
                </td>
              </tr>
            </table>

            <!-- Closing -->
            <p style="margin:0 0 4px;font-size:14px;color:#64748b;">${copy.closing}</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#0f172a;">${copy.team}</p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="height:1px;background:#e2e8f0;"></td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">${copy.footer}</p>
            <p style="margin:0;font-size:12px;color:#cbd5e1;">
              © ${new Date().getFullYear()} Effitaxes &nbsp;|&nbsp;
              <a href="https://www.effitaxes.com" style="color:#0ea5e9;text-decoration:none;">www.effitaxes.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    return sendEmail({
        to: email,
        subject: copy.subject,
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
