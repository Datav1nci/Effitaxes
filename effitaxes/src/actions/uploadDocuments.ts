"use server";

import { createClient } from "@/utils/supabase/server";
import { sendDocumentUploadNotification } from "@/lib/mail";
import { revalidatePath } from "next/cache";

/**
 * Lightweight server action: records metadata in user_documents table + notifies admin.
 * File upload is handled client-side directly to Supabase Storage (bypasses Vercel payload limits).
 */

export interface DocumentMetadataInput {
    fileName: string;
    mimeType: string;
    fileSize: number;
    storagePath: string; // already uploaded by the client
    label?: string;
}

export interface DocumentRow {
    id: string;
    file_name: string;
    storage_path: string;
    file_size: number | null;
    mime_type: string | null;
    label: string | null;
    created_at: string;
}

export async function recordDocuments(
    files: DocumentMetadataInput[]
): Promise<{ success: boolean; error?: string; documents?: DocumentRow[] }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Verify each storage path contains this user's ID (supporting Name_uuid/ format)
        for (const file of files) {
            const folder = file.storagePath.split("/")[0];
            if (!folder.includes(user.id)) {
                return { success: false, error: "Invalid storage path" };
            }
        }

        // Insert metadata rows
        const rows = files.map(f => ({
            user_id: user.id,
            file_name: f.fileName,
            storage_path: f.storagePath,
            file_size: f.fileSize,
            mime_type: f.mimeType,
            label: f.label || null,
        }));

        const { data: insertedDocs, error: dbError } = await supabase
            .from("user_documents")
            .insert(rows)
            .select();

        if (dbError) {
            console.error("DB insert error:", dbError);
            return { success: false, error: `Failed to record documents: ${dbError.message}` };
        }

        // Fetch user profile for notification
        const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name, email")
            .eq("id", user.id)
            .single();

        // Generate signed download URLs (expire in 90 days)
        const NINETY_DAYS = 90 * 24 * 60 * 60;
        const filesWithUrls = await Promise.all(
            files.map(async f => {
                const { data: signedData } = await supabase.storage
                    .from("user-documents")
                    .createSignedUrl(f.storagePath, NINETY_DAYS);
                return {
                    fileName: f.fileName,
                    label: f.label,
                    downloadUrl: signedData?.signedUrl || undefined,
                };
            })
        );

        // Notify admin with download links
        const firstName = profile?.first_name || user.user_metadata?.first_name || user.email?.split("@")[0] || "Unknown";
        const lastName = profile?.last_name || user.user_metadata?.last_name || "";

        await sendDocumentUploadNotification({
            firstName,
            lastName: lastName || "Client",
            email: profile?.email || user.email || "",
            files: filesWithUrls,
        });

        revalidatePath("/[locale]/dashboard", "page");

        return { success: true, documents: insertedDocs || [] };
    } catch (error) {
        console.error("Record documents error:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function deleteDocument(
    documentId: string,
    storagePath: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return { success: false, error: "Unauthorized" };

        // Remove from storage
        const { error: storageError } = await supabase.storage
            .from("user-documents")
            .remove([storagePath]);

        if (storageError) {
            console.error("Storage delete error:", storageError);
        }

        // Remove from DB
        const { error: dbError } = await supabase
            .from("user_documents")
            .delete()
            .eq("id", documentId)
            .eq("user_id", user.id);

        if (dbError) {
            return { success: false, error: dbError.message };
        }

        revalidatePath("/[locale]/dashboard", "page");
        return { success: true };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, error: "Failed to delete document." };
    }
}
