import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EnrollmentWizard from "@/components/enrollment/EnrollmentWizard";

export default async function InscriptionPage(props: {
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;
    const { locale } = params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect(`/${locale}/login?message=Please sign in to start enrollment`);
    }

    // Fetch profile to pre-fill
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <EnrollmentWizard user={user} profile={profile} />
        </div>
    );
}

