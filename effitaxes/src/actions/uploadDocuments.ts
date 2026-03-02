"use server";

import { createClient } from "@/utils/supabase/server";
import { sendDocumentUploadNotification } from "@/lib/mail";
import { revalidatePath } from "next/cache";

const BUCKET = "user-documents";

const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/heic",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

export interface UploadedDocumentInput {
    fileName: string;
    mimeType: string;
    fileSize: number;
    label?: string;
    base64: string; // base64-encoded file content
}

export async function uploadDocuments(
    files: UploadedDocumentInput[]
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Validate all files before uploading any
        for (const file of files) {
            if (!ALLOWED_MIME_TYPES.includes(file.mimeType)) {
                return { success: false, error: `Invalid file type: ${file.mimeType}` };
            }
            if (file.fileSize > MAX_FILE_SIZE) {
                return { success: false, error: `File too large: ${file.fileName}` };
            }
        }

        const uploadedFiles: { fileName: string; label?: string }[] = [];

        for (const file of files) {
            // Decode base64 to binary
            const buffer = Buffer.from(file.base64, "base64");

            // Unique storage path per user
            const timestamp = Date.now();
            const sanitizedName = file.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
            const storagePath = `${user.id}/${timestamp}_${sanitizedName}`;

            // Upload to Supabase Storage
            const { error: storageError } = await supabase.storage
                .from(BUCKET)
                .upload(storagePath, buffer, {
                    contentType: file.mimeType,
                    upsert: false,
                });

            if (storageError) {
                console.error("Storage upload error:", storageError);
                return { success: false, error: `Failed to upload ${file.fileName}: ${storageError.message}` };
            }

            // Insert metadata into user_documents
            const { error: dbError } = await supabase.from("user_documents").insert({
                user_id: user.id,
                file_name: file.fileName,
                storage_path: storagePath,
                file_size: file.fileSize,
                mime_type: file.mimeType,
                label: file.label || null,
            });

            if (dbError) {
                console.error("DB insert error:", dbError);
                // Attempt cleanup of uploaded file
                await supabase.storage.from(BUCKET).remove([storagePath]);
                return { success: false, error: `Failed to record ${file.fileName}: ${dbError.message}` };
            }

            uploadedFiles.push({ fileName: file.fileName, label: file.label });
        }

        // Fetch user profile for notification
        const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name, email")
            .eq("id", user.id)
            .single();

        // Notify admin
        await sendDocumentUploadNotification({
            firstName: profile?.first_name || "Unknown",
            lastName: profile?.last_name || "Client",
            email: profile?.email || "",
            files: uploadedFiles,
        });

        revalidatePath("/[locale]/dashboard", "page");

        return { success: true };
    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, error: "An unexpected error occurred during upload." };
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
            .from(BUCKET)
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
