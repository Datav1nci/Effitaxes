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

export async function recordDocuments(
    files: DocumentMetadataInput[]
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Verify each storage path belongs to this user
        for (const file of files) {
            if (!file.storagePath.startsWith(user.id + "/")) {
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

        const { error: dbError } = await supabase.from("user_documents").insert(rows);

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

        // Notify admin (no file content — just names and labels)
        await sendDocumentUploadNotification({
            firstName: profile?.first_name || "Unknown",
            lastName: profile?.last_name || "Client",
            email: profile?.email || "",
            files: files.map(f => ({ fileName: f.fileName, label: f.label })),
        });

        revalidatePath("/[locale]/dashboard", "page");

        return { success: true };
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
