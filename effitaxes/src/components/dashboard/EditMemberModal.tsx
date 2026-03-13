
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMemberSchema, MemberFormData } from "@/lib/householdSchema";
import { updateHouseholdMember } from "@/actions/household";
import { Dictionary } from "@/lib/dictionary";
import { HouseholdMember } from "@/lib/householdTypes";
import { useRouter } from "next/navigation";

type EditMemberModalProps = {
    member: HouseholdMember | null;
    isOpen: boolean;
    onClose: () => void;
    t: Dictionary;
    onMemberUpdated: (updated: HouseholdMember) => void;
};

export default function EditMemberModal({ member, isOpen, onClose, t, onMemberUpdated }: EditMemberModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const schema = createMemberSchema(t);

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<MemberFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(schema) as any,
        mode: "onChange",
    });

    const relationship = watch("relationship");
    const isDependent = watch("isDependent");

    // Populate form when member changes
    useEffect(() => {
        if (member) {
            reset({
                firstName: member.first_name,
                lastName: member.last_name,
                relationship: member.relationship,
                dateOfBirth: member.date_of_birth ?? "",
                livesWithPrimary: member.lives_with_primary,
                isDependent: member.is_dependent,
                dependencyDetails: {
                    disability: !!(member.tax_data?.disability),
                    financialDependency: !!(member.tax_data?.financialDependency),
                    notes: (member.tax_data?.notes as string) ?? "",
                },
            });
        }
    }, [member, reset]);

    if (!isOpen || !member) return null;

    const hh = t.household;

    const onSubmit = async (data: MemberFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);
        const res = await updateHouseholdMember(member.id, data);
        setIsSubmitting(false);

        if (res.success) {
            // Build an optimistic updated member object for immediate UI refresh
            const updated: HouseholdMember = {
                ...member,
                first_name: data.firstName,
                last_name: data.lastName,
                relationship: data.relationship,
                date_of_birth: data.dateOfBirth || null,
                lives_with_primary: data.livesWithPrimary,
                is_dependent: data.isDependent,
                tax_data: data.dependencyDetails ?? {},
            };
            onMemberUpdated(updated);
            router.refresh();
            onClose();
        } else {
            setSubmitError(res.error || t.auth.errorUpdate);
        }
    };

    const RELATIONSHIPS = ["SPOUSE", "PARTNER", "CHILD", "DEPENDANT", "OTHER"] as const;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 z-10 text-xl leading-none">&times;</button>

                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {hh.editMemberTitle}
                    </h3>
                </div>

                <div className="px-6 py-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{hh.form.firstName}</label>
                            <input
                                type="text"
                                {...register("firstName")}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                            />
                            {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{hh.form.lastName}</label>
                            <input
                                type="text"
                                {...register("lastName")}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                            />
                            {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>}
                        </div>

                        {/* Relationship */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{hh.form.relationship}</label>
                            <select
                                {...register("relationship")}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                            >
                                {RELATIONSHIPS.map(r => (
                                    <option key={r} value={r}>{hh.relationships[r]}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{hh.form.dob}</label>
                            <input
                                type="date"
                                {...register("dateOfBirth")}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                            />
                        </div>

                        {/* Lives with primary */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("livesWithPrimary")}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label className="text-sm text-gray-900 dark:text-gray-300">{hh.form.livesWithPrimary}</label>
                        </div>

                        {/* isDependent section (shown for CHILD, DEPENDANT, OTHER) */}
                        {(relationship === "CHILD" || relationship === "DEPENDANT" || relationship === "OTHER") && (
                            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        {...register("isDependent")}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label className="text-sm text-gray-900 dark:text-gray-300">{hh.form.isDependent}</label>
                                </div>

                                {(isDependent || relationship === "DEPENDANT") && (
                                    <div className="pl-6 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                {...register("dependencyDetails.disability")}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <label className="text-sm text-gray-900 dark:text-gray-300">{hh.form.disability}</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                {...register("dependencyDetails.financialDependency")}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <label className="text-sm text-gray-900 dark:text-gray-300">{hh.form.financialDependency}</label>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{hh.form.notes}</label>
                                            <textarea
                                                {...register("dependencyDetails.notes")}
                                                rows={2}
                                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error message */}
                        {submitError && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                {t.common.cancel}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? t.common.saving : t.common.saveChanges}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
