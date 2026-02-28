"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { User } from "@supabase/supabase-js";

interface Profile {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    email?: string | null;
}

interface ProfileFormProps {
    user: User;
    profile: Profile | null;
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Fallback to empty string to avoid "uncontrolled to controlled" warning
    const [firstName, setFirstName] = useState(profile?.first_name || "");
    const [lastName, setLastName] = useState(profile?.last_name || "");
    const [phone, setPhone] = useState(profile?.phone || "");

    async function handleSave(formData: FormData) {
        setIsSaving(true);
        setSaveError(null);
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            setSaveError(t.auth.errorUpdate);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="w-full max-w-lg p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <div className="flex items-center justify-end mb-6 min-h-[40px]">
                {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        {t.auth.editProfile}
                    </Button>
                )}
            </div>

            {isEditing ? (
                <form action={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.auth.firstName}
                            </label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.auth.lastName}
                            </label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.auth.email}
                            </label>
                            <div className="mt-1 px-3 py-2 bg-gray-100 rounded-md text-gray-500 border border-transparent dark:bg-gray-800 dark:text-gray-400">
                                {user.email}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.auth.phone}
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        {saveError && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-700 dark:text-red-300">{saveError}</p>
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => { setIsEditing(false); setSaveError(null); }}>
                                {t.auth.cancel}
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "..." : t.auth.save}
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <span className="font-medium text-gray-500">{t.auth.firstName}</span>
                        <span className="col-span-2 text-gray-900 dark:text-gray-100">{profile?.first_name || "-"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <span className="font-medium text-gray-500">{t.auth.lastName}</span>
                        <span className="col-span-2 text-gray-900 dark:text-gray-100">{profile?.last_name || "-"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <span className="font-medium text-gray-500">{t.auth.email}</span>
                        <span className="col-span-2 text-gray-900 dark:text-gray-100">{profile?.email || user.email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <span className="font-medium text-gray-500">{t.auth.phone}</span>
                        <span className="col-span-2 text-gray-900 dark:text-gray-100">{profile?.phone || "-"}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
