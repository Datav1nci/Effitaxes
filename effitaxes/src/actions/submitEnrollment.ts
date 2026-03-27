"use server";

import { sendEnrollmentNotification, sendEnrollmentReceipt } from "@/lib/mail";
import { createClient } from "@/utils/supabase/server";
import { HouseholdMember } from "@/lib/householdTypes";

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

        // ── Bug Fix: Sync enrollment household[] into household_members table ──
        if (user && Array.isArray(data.household) && data.household.length > 0) {
            try {
                // 1. Get or create the households row
                const { data: existingHousehold, error: hhError } = await supabase
                    .from("households")
                    .select("id")
                    .eq("primary_person_id", user.id)
                    .single();

                let householdId: string | null = existingHousehold?.id ?? null;

                if (!householdId && hhError?.code === "PGRST116") {
                    // No household yet — create one
                    const { data: newHousehold, error: createError } = await supabase
                        .from("households")
                        .insert({ primary_person_id: user.id })
                        .select("id")
                        .single();

                    if (createError || !newHousehold) {
                        console.error("Failed to create household during enrollment sync:", createError);
                    } else {
                        householdId = newHousehold.id;
                    }
                } else if (hhError && hhError.code !== "PGRST116") {
                    console.error("Error fetching household during enrollment sync:", hhError);
                }

                if (householdId) {
                    // 2. Delete existing members (re-submission should reflect current form state)
                    await supabase
                        .from("household_members")
                        .delete()
                        .eq("household_id", householdId);

                    // 3. Bulk-insert all members from the enrollment form
                    const records = data.household.map((member: {
                        firstName: string;
                        lastName: string;
                        relationship: string;
                        dateOfBirth?: string;
                        livesWithPrimary?: boolean;
                        isDependent?: boolean;
                    }) => ({
                        household_id: householdId,
                        first_name: member.firstName,
                        last_name: member.lastName,
                        relationship: member.relationship,
                        date_of_birth: member.dateOfBirth || null,
                        lives_with_primary: member.livesWithPrimary ?? true,
                        is_dependent: member.isDependent ?? false,
                        tax_data: {},
                    }));

                    const { error: insertError } = await supabase
                        .from("household_members")
                        .insert(records);

                    if (insertError) {
                        console.error("Failed to sync household members from enrollment:", insertError);
                        // Non-fatal: enrollment itself succeeded; log and continue
                    } else {
                        console.log(`Synced ${records.length} household member(s) from enrollment form.`);
                    }
                }
            } catch (err) {
                console.error("Unexpected error syncing household members:", err);
                // Non-fatal — enrollment DB save already succeeded
            }
        }
        // ── End Bug Fix ──

        // 1. Fetch Household Members (for admin notification email)
        let householdMembers: HouseholdMember[] = [];
        if (user) {
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
        }

        // 2. Fetch uploaded documents and generate signed URLs for admin email
        const NINETY_DAYS = 90 * 24 * 60 * 60;
        let enrollmentDocuments: { fileName: string; label?: string; downloadUrl?: string }[] = [];

        if (user) {
            try {
                const { data: docRows } = await supabase
                    .from("user_documents")
                    .select("file_name, storage_path, label")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: true });

                if (docRows && docRows.length > 0) {
                    enrollmentDocuments = await Promise.all(
                        docRows.map(async (doc) => {
                            const { data: signedData } = await supabase.storage
                                .from("user-documents")
                                .createSignedUrl(doc.storage_path, NINETY_DAYS);
                            return {
                                fileName: doc.file_name,
                                label: doc.label ?? undefined,
                                downloadUrl: signedData?.signedUrl ?? undefined,
                            };
                        })
                    );
                }
            } catch (err) {
                console.error("Error fetching documents for enrollment notification:", err);
            }
        }

        // 3. Notify Admin (with enrollment data + document links)
        const { success: adminSuccess, error: adminError } = await sendEnrollmentNotification({
            ...data,
            household: householdMembers,
            documents: enrollmentDocuments,
        });
        if (!adminSuccess) {
            console.error("Failed to send admin notification:", adminError);
            // Log only — a failed admin email shouldn't block the user's success
        }

        // 4. Receipt to Customer (no document links — private)
        if (data.personal?.email && data.personal?.firstName) {
            const lang: "fr" | "en" = data.language === "en" ? "en" : "fr";
            await sendEnrollmentReceipt(data.personal.email, data.personal.firstName, lang);
        }

        console.log("Enrollment submitted successfully.");
        return { success: true };
    } catch (error) {
        console.error("Failed to submit enrollment:", error);
        return { success: false, error: "Failed to submit enrollment" };
    }
}
