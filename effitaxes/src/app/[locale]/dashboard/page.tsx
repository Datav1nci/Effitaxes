
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/auth";

export default async function DashboardPage() {
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
            <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
            <p className="text-xl mb-4">Welcome, {profile?.first_name || user.email}!</p>

            <div className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800 w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <span className="font-medium text-gray-500">First Name</span>
                        <span className="col-span-2 text-gray-900 dark:text-gray-100">{profile?.first_name || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <span className="font-medium text-gray-500">Last Name</span>
                        <span className="col-span-2 text-gray-900 dark:text-gray-100">{profile?.last_name || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <span className="font-medium text-gray-500">Email</span>
                        <span className="col-span-2 text-gray-900 dark:text-gray-100">{user.email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <span className="font-medium text-gray-500">Phone</span>
                        <span className="col-span-2 text-gray-900 dark:text-gray-100">{profile?.phone || '-'}</span>
                    </div>
                </div>
            </div>

            <form action={signOut} className="mt-8">
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                    Sign Out
                </button>
            </form>
        </div>
    );
}
