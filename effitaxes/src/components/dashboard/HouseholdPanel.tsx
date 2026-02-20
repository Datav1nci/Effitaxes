
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
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function HouseholdPanel({ household, members: initialMembers = [], t }: HouseholdPanelProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
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

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure?")) {
            setIsDeleting(id);
            await removeHouseholdMember(id);
            await fetchMembers(); // Refresh local state
            setIsDeleting(null);
        }
    };

    const handleMembersAdded = (newMembers: HouseholdMember[]) => {
        setClientMembers(current => [...current, ...newMembers]);
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

            <div className="space-y-4">
                {(!clientMembers || clientMembers.length === 0) ? (
                    <div className="text-gray-500 italic">{t.household.noMembers}</div>
                ) : (
                    clientMembers.map(member => (
                        <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
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
                                {/* <button className="text-xs text-gray-500 hover:text-indigo-600">Edit</button> */}
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    disabled={isDeleting === member.id}
                                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                                >
                                    {isDeleting === member.id ? "..." : "Remove"}
                                </button>
                            </div>
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
