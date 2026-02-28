
"use client";

import React, { useState } from "react";
import { Dictionary } from "@/lib/dictionary";
import AddMemberModal from "./AddMemberModal";
import { removeHouseholdMember } from "@/actions/household";

import { Household, HouseholdMember } from "@/lib/householdTypes";

// Define a type for the household and members since we don't have a shared type file yet
// Ideally this should come from generated Supabase types
// type Member = { ... } // Replaced by import

type HouseholdPanelProps = {
    household?: Household | null;
    members?: HouseholdMember[] | null;
    t: Dictionary;
    onUpdate?: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function HouseholdPanel({ household, members: initialMembers = [], t, onUpdate }: HouseholdPanelProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
    const [clientMembers, setClientMembers] = useState<HouseholdMember[]>(initialMembers || []);

    // Sync initialMembers if they change (e.g. after revalidatePath)
    React.useEffect(() => {
        if (initialMembers && initialMembers.length > 0) {
            setClientMembers(initialMembers);
        } else {
            // If server returns empty, try fetching client side to verify
            fetchMembers();
        }
    }, [initialMembers]);

    const fetchMembers = async () => {
        // We need a client-side supabase client, but for now we can rely on a server action or just re-trigger
        // Actually, let's use the browser client if available or just a simple fetch to an API route? 
        // We don't have API routes set up for this, but we can use the server action 'getHousehold' we created!

        // Wait, 'getHousehold' is a server action. We can call it directly.
        const { getHousehold } = await import("@/actions/household");
        const res = await getHousehold();
        if (res.success && res.members) {
            setClientMembers(res.members);
            console.log("Client-side fetch members:", res.members);
        }
    };

    const handleDeleteConfirmed = async (id: string) => {
        setConfirmingDeleteId(null);
        setIsDeleting(id);
        await removeHouseholdMember(id);
        await fetchMembers(); // Refresh local state
        setIsDeleting(null);
        if (onUpdate) onUpdate();
    };

    const handleMembersAdded = (newMembers: HouseholdMember[]) => {
        setClientMembers(current => [...current, ...newMembers]);
        if (onUpdate) onUpdate();
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t.household.title}</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                >
                    + {t.household.addMember}
                </button>
            </div>

            <div className="space-y-3">
                {(!clientMembers || clientMembers.length === 0) ? (
                    <div className="text-gray-500 italic">{t.household.noMembers}</div>
                ) : (
                    clientMembers.map(member => (
                        <div key={member.id}>
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {member.first_name} {member.last_name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {t.household.relationships[member.relationship]}
                                        {member.date_of_birth && ` • ${member.date_of_birth}`}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {isDeleting === member.id ? (
                                        <span className="text-xs text-gray-400 animate-pulse">
                                            {t.common.saving || "Removing..."}
                                        </span>
                                    ) : confirmingDeleteId === member.id ? (
                                        // Show Cancel in the card while the confirmation panel is open
                                        <button
                                            onClick={() => setConfirmingDeleteId(null)}
                                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1 rounded border border-gray-300 dark:border-gray-600"
                                        >
                                            {t.common.cancel || "Cancel"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmingDeleteId(member.id)}
                                            className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                        >
                                            {t.household.remove}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Inline confirmation panel — slides in below the card */}
                            {confirmingDeleteId === member.id && (
                                <div className="mt-1 mx-1 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center justify-between gap-4">
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        {t.household.confirmDelete || `Remove ${member.first_name} ${member.last_name}?`}
                                    </p>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => setConfirmingDeleteId(null)}
                                            className="text-xs px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {t.common.cancel || "Cancel"}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteConfirmed(member.id)}
                                            className="text-xs px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                                        >
                                            {t.household.remove}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <AddMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                t={t}
                existingMembers={clientMembers}
                onMembersAdded={handleMembersAdded}
            />
        </div>
    );
}
