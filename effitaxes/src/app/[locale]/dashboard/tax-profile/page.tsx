
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EnrollmentWizard from "@/components/enrollment/EnrollmentWizard";
import TaxProfileView from "@/components/dashboard/TaxProfileView";
import { dictionary } from "@/lib/dictionary";
import type { Language } from "@/lib/dictionary";

export default async function TaxProfilePage(props: {
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;
    const { locale } = params;
    const t = dictionary[locale as Language] || dictionary.fr;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect(`/${locale}/login`);
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Fetch household data
    // We duplicate the fetch logic here or import the action. 
    // Since actions are for mutations usually, and we want data fetching in RSC, we can use supabase directly or the action.
    // Using the action helper might easier if we export the fetch logic, but let's just do it directly for efficiency/simplicity in RSC

    let household = null;
    let members = [];

    if (profile) {
        // console.log("Fetching household for user:", user.id);
        const { data: hh, error: hhError } = await supabase
            .from("households")
            .select("*")
            .eq("primary_person_id", user.id)
            .single();

        if (hhError && hhError.code !== 'PGRST116') {
            console.error("Error fetching household in page:", hhError);
        }

        household = hh;

        if (hh) {
            // console.log("Household found:", hh.id);
            const { data: mm, error: mmError } = await supabase
                .from("household_members")
                .select("*")
                .eq("household_id", hh.id);

            if (mmError) {
                console.error("Error fetching members in page:", mmError);
            }

            members = mm || [];
            // console.log("Members found:", members.length);
        } else {
            // console.log("No household found for user");
        }
    }

    const isEnrollmentCompleted = profile?.enrollment_status === "completed" || (profile?.tax_data && Object.keys(profile.tax_data).length > 0);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <a href={`/${locale}/dashboard`} className="text-blue-600 hover:text-blue-800">
                    &larr; {t.auth.backDashboard}
                </a>
            </div>

            {isEnrollmentCompleted ? (
                <TaxProfileView profile={profile} household={household} members={members} t={t} />
            ) : (
                <EnrollmentWizard user={user} profile={profile} />
            )}
        </div>
    );
}
