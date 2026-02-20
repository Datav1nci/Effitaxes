
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
