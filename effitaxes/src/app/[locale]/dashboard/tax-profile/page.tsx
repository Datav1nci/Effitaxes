
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

    const isEnrollmentCompleted = profile?.enrollment_status === "completed" || (profile?.tax_data && Object.keys(profile.tax_data).length > 0);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <a href={`/${locale}/dashboard`} className="text-blue-600 hover:text-blue-800">
                    &larr; {t.auth.backDashboard}
                </a>
            </div>

            {isEnrollmentCompleted ? (
                <TaxProfileView profile={profile} t={t} />
            ) : (
                <EnrollmentWizard user={user} profile={profile} />
            )}
        </div>
    );
}
