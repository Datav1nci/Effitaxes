
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { MemberFormData } from "@/lib/householdSchema";

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

    const { error } = await supabase
        .from("household_members")
        .insert(records);

    if (error) {
        console.error("Error adding members:", error);
        return { success: false, error: "Failed to add members" };
    }

    revalidatePath("/[locale]/dashboard/tax-profile", "page");
    return { success: true };
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

    revalidatePath("/[locale]/dashboard/tax-profile", "page");
    return { success: true };
}
