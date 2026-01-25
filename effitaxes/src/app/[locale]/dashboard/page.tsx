
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

    return (
        <div className="flex flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
            <p className="text-xl mb-4">Welcome, {user.email}!</p>
            <div className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-semibold mb-4">Your Account</h2>
                <div className="space-y-2">
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">User ID:</span> {user.id}</p>
                    <p><span className="font-medium">Last Sign In:</span> {new Date(user.last_sign_in_at || "").toLocaleString()}</p>
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
