"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { MemberFormData } from "@/lib/householdSchema";
import { sendProfileUpdateNotification } from "@/lib/mail";
import { HouseholdMember } from "@/lib/householdTypes";

export async function getHousehold() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    // Get or Create Household
    const { data: initialHousehold, error } = await supabase
        .from("households")
        .select("*")
        .eq("primary_person_id", user.id)
        .single();

    let household = initialHousehold;

    if (!household && !error) {
        // If no household exists, create one
        const { data: newHousehold, error: createError } = await supabase
            .from("households")
            .insert({ primary_person_id: user.id })
            .select()
            .single();

        if (createError) {
            console.error("Error creating household:", createError);
            return { success: false, error: "Failed to create household" };
        }
        household = newHousehold;
    } else if (error && error.code !== 'PGRST116') {
        console.error("Error fetching household:", error);
        return { success: false, error: "Failed to fetch household" };
    }

    // Get Members
    const { data: members, error: membersError } = await supabase
        .from("household_members")
        .select("*")
        .eq("household_id", household.id);

    if (membersError) {
        console.error("Error fetching members:", membersError);
        return { success: false, error: "Failed to fetch members" };
    }

    return { success: true, household, members };
}

export async function addHouseholdMember(data: MemberFormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    // Ensure household exists
    const { data: initialHousehold, error: householdError } = await supabase
        .from("households")
        .select("id")
        .eq("primary_person_id", user.id)
        .single();

    let household = initialHousehold;

    if (!household) {
        // Create household if not exists
        const { data: newHousehold, error: createError } = await supabase
            .from("households")
            .insert({ primary_person_id: user.id })
            .select("id")
            .single();

        if (createError || !newHousehold) {
            console.error("Error creating household:", createError);
            return { success: false, error: "Failed to create household" };
        }
        household = newHousehold;
    } else if (householdError && householdError.code !== 'PGRST116') {
        return { success: false, error: "Error fetching household" };
    }

    const { error } = await supabase
        .from("household_members")
        .insert({
            household_id: household.id,
            first_name: data.firstName,
            last_name: data.lastName,
            relationship: data.relationship,
            date_of_birth: data.dateOfBirth || null,
            lives_with_primary: data.livesWithPrimary,
            is_dependent: data.isDependent,
            tax_data: data.dependencyDetails || {},
        });

    if (error) {
        console.error("Error adding member:", error);
        return { success: false, error: "Failed to add member" };
    }

    await notifyAdminOfHouseholdChange(user.id);

    revalidatePath("/[locale]/dashboard/tax-profile", "page");
    return { success: true };
}

export async function addHouseholdMembers(members: MemberFormData[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    // Ensure household exists
    const { data: initialHousehold, error: householdError } = await supabase
        .from("households")
        .select("id")
        .eq("primary_person_id", user.id)
        .single();

    let household = initialHousehold;

    if (!household) {
        // Create household if not exists
        const { data: newHousehold, error: createError } = await supabase
            .from("households")
            .insert({ primary_person_id: user.id })
            .select("id")
            .single();

        if (createError || !newHousehold) {
            console.error("Error creating household:", createError);
            return { success: false, error: "Failed to create household" };
        }
        household = newHousehold;
    } else if (householdError && householdError.code !== 'PGRST116') {
        return { success: false, error: "Error fetching household" };
    }

    const records = members.map(data => ({
        household_id: household.id,
        first_name: data.firstName,
        last_name: data.lastName,
        relationship: data.relationship,
        date_of_birth: data.dateOfBirth || null,
        lives_with_primary: data.livesWithPrimary,
        is_dependent: data.isDependent,
        tax_data: data.dependencyDetails || {},
    }));

    const { data: insertedMembers, error } = await supabase
        .from("household_members")
        .insert(records)
        .select();

    if (error) {
        console.error("Error adding members:", error);
        return { success: false, error: "Failed to add members" };
    }

    console.log(`Successfully added ${insertedMembers.length} members to household ${household.id}`);

    await notifyAdminOfHouseholdChange(user.id);

    revalidatePath("/[locale]/dashboard/tax-profile", "page");
    revalidatePath("/[locale]/dashboard", "layout");
    return { success: true, members: insertedMembers };
}

export async function removeHouseholdMember(memberId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    // Verify ownership via policy, but extra check is good
    const { error } = await supabase
        .from("household_members")
        .delete()
        .eq("id", memberId);

    if (error) {
        console.error("Error removing member:", error);
        return { success: false, error: "Failed to remove member" };
    }

    await notifyAdminOfHouseholdChange(user.id);

    revalidatePath("/[locale]/dashboard/tax-profile", "page");
    revalidatePath("/[locale]/dashboard", "layout");
    return { success: true };
}

async function notifyAdminOfHouseholdChange(userId: string) {
    const supabase = await createClient();

    // 1. Fetch Profile for Name/Email
    const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, email")
        .eq("id", userId)
        .single();

    if (!profile) return;

    // 2. Fetch Household & Members
    const { data: household } = await supabase
        .from("households")
        .select("id")
        .eq("primary_person_id", userId)
        .single();

    let householdMembers: HouseholdMember[] = [];
    if (household) {
        const { data: members } = await supabase
            .from("household_members")
            .select("*")
            .eq("household_id", household.id);

        if (members) householdMembers = members;
    }

    // 3. Send Notification
    await sendProfileUpdateNotification({
        personal: {
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email
        },
        household: householdMembers
    });
}