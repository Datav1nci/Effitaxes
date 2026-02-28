import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendProfileUpdateNotification } from "@/lib/mail";
import { HouseholdMember } from "@/lib/householdTypes";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { batchId, updatedSections } = body;

        if (!batchId) {
            return NextResponse.json({ success: false, error: "Missing batchId" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // 1. Fetch user's profile to check idempotency guard
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
            console.error("Failed to fetch profile for email notification:", profileError);
            return NextResponse.json({ success: false, error: "Profile not found" }, { status: 500 });
        }

        // 2. Idempotency Check: Have we already sent this batch?
        if (profile.last_notified_batch_id === batchId) {
            console.log(`Batch ${batchId} already processed. Skipping email.`);
            return NextResponse.json({ success: true, message: "Already processed" }, { status: 200 });
        }

        // 3. Mark batch as processed
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ last_notified_batch_id: batchId })
            .eq("id", user.id);

        if (updateError) {
            console.error("Failed to update last_notified_batch_id:", updateError);
            return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
        }

        // 4. Fetch the entire truth from server 
        // We already have the profile data in `profile.tax_data` merging with `profile` core fields
        const taxDataPayload = profile.tax_data || {};
        const personalInfo = {
            ...taxDataPayload.personal,
            firstName: profile.first_name || taxDataPayload.personal?.firstName,
            lastName: profile.last_name || taxDataPayload.personal?.lastName,
            email: profile.email || taxDataPayload.personal?.email,
            phone: profile.phone || taxDataPayload.personal?.phone,
        };

        const finalPayload = {
            ...taxDataPayload,
            personal: personalInfo
        };

        // Fetch Household
        let householdMembers: HouseholdMember[] = [];
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

        // 5. Send Unified Email
        const { success: emailSuccess, error: emailError } = await sendProfileUpdateNotification({
            ...finalPayload,
            household: householdMembers,
            updatedSections: Array.isArray(updatedSections) ? updatedSections : [],
        });

        if (!emailSuccess) {
            console.error("Failed to send update email:", emailError);
            // Optionally rollback the batchId if email system is down completely
            await supabase
                .from("profiles")
                .update({ last_notified_batch_id: null })
                .eq("id", user.id);
            return NextResponse.json({ success: false, error: emailError }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("notify-admin route error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
