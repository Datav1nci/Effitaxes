
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/auth";

import { dictionary } from "@/lib/dictionary";
import type { Language } from "@/lib/dictionary";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default async function DashboardPage(props: {
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;
    const { locale } = params;
    const t = dictionary[locale as Language] || dictionary.fr;

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="flex flex-col items-center justify-center p-24">
            <p className="text-xl mb-4">
                {t.auth.welcome} {profile?.first_name ? profile.first_name : user.email}!
            </p>

            <ProfileForm user={user} profile={profile} />

            <div className="mt-8">
                <a
                    href={`/${locale}/dashboard/tax-profile`}
                    className="block w-full max-w-lg mx-auto text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    {t.auth.updateTaxProfile}
                </a>
            </div>

            <form action={signOut} className="mt-8">
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                    {t.auth.signOut}
                </button>
            </form>
        </div>
    );
}
