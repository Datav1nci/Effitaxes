
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMemberSchema, MemberFormData } from "@/lib/householdSchema";
import { addHouseholdMembers } from "@/actions/household";
import { Dictionary } from "@/lib/dictionary";
import { HouseholdMember } from "@/lib/householdTypes";
import { useRouter } from "next/navigation";

type AddMemberModalProps = {
    isOpen: boolean;
    onClose: () => void;
    t: Dictionary;
    existingMembers?: HouseholdMember[] | null;
    onMembersAdded: (members: HouseholdMember[]) => void;
};

type BatchSelection = {
    addSpouse: boolean;
    childCount: number;
    dependantCount: number;
    otherCount: number;
    partnerType?: "SPOUSE" | "PARTNER";
};

export default function AddMemberModal({ isOpen, onClose, t, existingMembers = [], onMembersAdded }: AddMemberModalProps) {
    const router = useRouter();
    // Steps: 0 = Selection, 1+ = Member Details Loop
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Batch Selection State
    const [selection, setSelection] = useState<BatchSelection>({
        addSpouse: false,
        childCount: 0,
        dependantCount: 0,
        otherCount: 0,
        partnerType: "SPOUSE"
    });

    // Queue of members to process
    const [memberQueue, setMemberQueue] = useState<{ type: string, id: string, label: string }[]>([]);
    const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
    const [collectedData, setCollectedData] = useState<MemberFormData[]>([]);

    const schema = createMemberSchema(t);

    // Form for current member details
    const { register, handleSubmit, watch, trigger, formState: { errors }, reset, setValue } = useForm<MemberFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(schema) as any,
        defaultValues: {
            livesWithPrimary: true,
            isDependent: false,
        },
        mode: "onChange"
    });

    const relationship = watch("relationship");
    const isDependent = watch("isDependent");

    if (!isOpen) return null;

    const hasSpouse = existingMembers?.some(m => m.relationship === "SPOUSE" || m.relationship === "PARTNER");

    const handleStart = () => {
        const queue = [];
        if (selection.addSpouse) {
            queue.push({ type: selection.partnerType || "SPOUSE", id: "spouse", label: t.household.relationships[selection.partnerType || "SPOUSE"] });
        }
        for (let i = 0; i < selection.childCount; i++) {
            queue.push({ type: "CHILD", id: `child-${i}`, label: `${t.household.relationships.CHILD} ${i + 1}` });
        }
        for (let i = 0; i < selection.dependantCount; i++) {
            queue.push({ type: "DEPENDANT", id: `dep-${i}`, label: `${t.household.relationships.DEPENDANT} ${i + 1}` });
        }
        for (let i = 0; i < selection.otherCount; i++) {
            queue.push({ type: "OTHER", id: `other-${i}`, label: `${t.household.relationships.OTHER} ${i + 1}` });
        }

        if (queue.length === 0) return;

        setMemberQueue(queue);
        setCurrentMemberIndex(0);
        setCollectedData([]);
        setStep(1);

        // Initialize first form
        reset({
            relationship: queue[0].type as "SPOUSE" | "PARTNER" | "CHILD" | "DEPENDANT" | "OTHER",
            livesWithPrimary: true,
            isDependent: queue[0].type === "DEPENDANT"
        });
    };

    const handleNextMember = async (data: MemberFormData) => {
        const isValid = await trigger();
        if (!isValid) return;

        const updatedData = [...collectedData, data];
        setCollectedData(updatedData);

        if (currentMemberIndex < memberQueue.length - 1) {
            const nextIndex = currentMemberIndex + 1;
            const nextMember = memberQueue[nextIndex];
            setCurrentMemberIndex(nextIndex);

            // Allow animation/render cycle to clear form state visually if needed, 
            // but for now just reset with new default values
            reset({
                relationship: nextMember.type as "SPOUSE" | "PARTNER" | "CHILD" | "DEPENDANT" | "OTHER",
                firstName: "",
                lastName: "",
                dateOfBirth: "",
                livesWithPrimary: true,
                isDependent: nextMember.type === "DEPENDANT" || nextMember.type === "CHILD", // Auto-check for convenience? Maybe not for child.
                dependencyDetails: {}
            });
            // Manual set because reset sometimes lags with specific field watchers
            setValue("relationship", nextMember.type as "SPOUSE" | "PARTNER" | "CHILD" | "DEPENDANT" | "OTHER");
        } else {
            // Final submit
            await submitAll(updatedData);
        }
    };

    const submitAll = async (allData: MemberFormData[]) => {
        setIsSubmitting(true);
        setSubmitError(null);
        const res = await addHouseholdMembers(allData);
        setIsSubmitting(false);
        if (res.success) {
            router.refresh();
            onClose();
            setStep(0);
            setSelection({ addSpouse: false, childCount: 0, dependantCount: 0, otherCount: 0, partnerType: "SPOUSE" });

            if (res.members && res.members.length > 0) {
                console.log("Verified members inserted:", res.members);
                onMembersAdded(res.members);
            } else {
                console.warn("Success returned but no members in response. Possible RLS issue?");
            }
        } else {
            setSubmitError(res.error || t.auth.errorUpdate);
        }
    };

    const currentMember = memberQueue[currentMemberIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 z-10">&times;</button>

                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {step === 0 ? t.household.setup.title : t.household.form.stepTitle.replace("{role}", currentMember.label).replace("{current}", (currentMemberIndex + 1).toString()).replace("{total}", memberQueue.length.toString())}
                    </h3>
                </div>

                <div className="px-6 py-4">
                    {step === 0 ? (
                        <div className="space-y-6">
                            {/* Spouse Selection */}
                            <div className={`p-4 border rounded-lg ${selection.addSpouse ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.household.setup.spouseLabel}</label>
                                    <input
                                        type="checkbox"
                                        checked={selection.addSpouse}
                                        disabled={hasSpouse}
                                        onChange={(e) => setSelection(s => ({ ...s, addSpouse: e.target.checked }))}
                                        className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
                                    />
                                </div>
                                {hasSpouse && <p className="text-xs text-amber-600 mt-1">Spouse/Partner already added.</p>}
                                {selection.addSpouse && (
                                    <div className="mt-3 flex gap-4">
                                        <label className="flex items-center">
                                            <input type="radio" name="pType" checked={selection.partnerType === "SPOUSE"} onChange={() => setSelection(s => ({ ...s, partnerType: "SPOUSE" }))} className="mr-2" />
                                            <span className="text-sm dark:text-gray-300">{t.household.relationships.SPOUSE}</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="pType" checked={selection.partnerType === "PARTNER"} onChange={() => setSelection(s => ({ ...s, partnerType: "PARTNER" }))} className="mr-2" />
                                            <span className="text-sm dark:text-gray-300">{t.household.relationships.PARTNER}</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Counters */}
                            {[
                                { key: "childCount", label: t.household.setup.childCount },
                                { key: "dependantCount", label: t.household.setup.dependantCount },
                                { key: "otherCount", label: t.household.setup.otherCount }
                            ].map(item => (
                                <div key={item.key} className="flex items-center justify-between p-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setSelection(s => ({ ...s, [item.key]: Math.max(0, (s as unknown as Record<string, number>)[item.key] - 1) }))}
                                            className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400"
                                        >-</button>
                                        <span className="w-8 text-center font-medium dark:text-white">{(selection as unknown as Record<string, number>)[item.key]}</span>
                                        <button
                                            onClick={() => setSelection(s => ({ ...s, [item.key]: (s as unknown as Record<string, number>)[item.key] + 1 }))}
                                            className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400"
                                        >+</button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleStart}
                                disabled={!selection.addSpouse && !selection.childCount && !selection.dependantCount && !selection.otherCount}
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t.household.setup.start}
                            </button>
                        </div>
                    ) : (
                        <form id="member-form" onSubmit={handleSubmit(handleNextMember)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.household.form.firstName}</label>
                                <input type="text" {...register("firstName")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2 border" />
                                {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.household.form.lastName}</label>
                                <input type="text" {...register("lastName")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2 border" />
                                {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.household.form.dob}</label>
                                <input type="date" {...register("dateOfBirth")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2 border" />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" {...register("livesWithPrimary")} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t.household.form.livesWithPrimary}</label>
                            </div>

                            {(relationship === "CHILD" || relationship === "DEPENDANT" || relationship === "OTHER") && (
                                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center">
                                        <input type="checkbox" {...register("isDependent")} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                        <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t.household.form.isDependent}</label>
                                    </div>

                                    {(isDependent || relationship === "DEPENDANT") && (
                                        <div className="pl-6 space-y-3">
                                            <div className="flex items-center">
                                                <input type="checkbox" {...register("dependencyDetails.disability")} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                                <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t.household.form.disability}</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input type="checkbox" {...register("dependencyDetails.financialDependency")} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                                <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t.household.form.financialDependency}</label>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.household.form.notes}</label>
                                                <textarea {...register("dependencyDetails.notes")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2 border" rows={2} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-6 flex flex-col gap-3">
                                {submitError && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                        <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
                                    </div>
                                )}
                                <div className="flex justify-end">
                                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50">
                                        {isSubmitting ? "Saving..." : (currentMemberIndex === memberQueue.length - 1 ? t.household.form.saveAll : t.enrollment.buttons.next)}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
