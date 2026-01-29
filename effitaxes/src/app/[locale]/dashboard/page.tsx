
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/auth";

import { dictionary } from "@/lib/dictionary";
import type { Language } from "@/lib/dictionary";
import TaxProfileView from "@/components/dashboard/TaxProfileView";

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
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
                {t.auth.welcome} {profile?.first_name || ""}!
            </h1>

            <div className="mt-8 w-full">
                <TaxProfileView profile={profile} t={t} />
            </div>

            <form action={signOut} className="mt-8">
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                    {t.auth.signOut}
                </button>
            </form>
        </div>
    );
}
