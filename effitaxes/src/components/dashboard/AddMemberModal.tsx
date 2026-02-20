
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMemberSchema, MemberFormData } from "@/lib/householdSchema";
import { addHouseholdMember } from "@/actions/household";
import { Dictionary } from "@/lib/dictionary";

type AddMemberModalProps = {
    isOpen: boolean;
    onClose: () => void;
    t: Dictionary;
};

export default function AddMemberModal({ isOpen, onClose, t }: AddMemberModalProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const schema = createMemberSchema(t);

    // We need to use 'any' or partial here because we are building the form step by step
    // and validating step-by-step or at the end. 
    // Ideally we should use a multi-step form library or logic, but for simplicity:
    const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm<MemberFormData>({
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

    const nextStep = async () => {
        let valid = false;
        if (step === 1) {
            valid = await trigger("relationship");
        } else if (step === 2) {
            // If child/dependant, check if we need step 3
            if (["CHILD", "DEPENDANT"].includes(relationship) || isDependent) {
                valid = await trigger(["firstName", "lastName", "dateOfBirth", "livesWithPrimary"]);
            } else {
                // Final step for non-dependants
                valid = await trigger(["firstName", "lastName", "dateOfBirth", "livesWithPrimary"]);
                if (valid) onSubmit(watch());
                return;
            }
        }

        if (valid) {
            setStep(s => s + 1);
        }
    };

    const prevStep = () => setStep(s => s - 1);

    const onSubmit = async (data: MemberFormData) => {
        setIsSubmitting(true);
        const res = await addHouseholdMember(data);
        setIsSubmitting(false);
        if (res.success) {
            onClose();
            setStep(1); // Reset
        } else {
            alert(res.error || t.auth.errorUpdate);
        }
    };

    // Render Steps
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t.household.addMember}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">&times;</button>
                </div>

                <div className="px-6 py-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Step 1: Relationship */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t.household.form.relationship}
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {(["SPOUSE", "PARTNER", "CHILD", "DEPENDANT", "OTHER"] as const).map((rel) => (
                                        <label key={rel} className={`flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${relationship === rel ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                            <input
                                                type="radio"
                                                value={rel}
                                                {...register("relationship")}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="ml-3 text-gray-900 dark:text-gray-100">
                                                {t.household.relationships[rel]}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.relationship && <p className="text-sm text-red-600">{errors.relationship.message}</p>}
                            </div>
                        )}

                        {/* Step 2: Basic Info */}
                        {step === 2 && (
                            <div className="space-y-4">
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
                                <div className="flex items-center">
                                    <input type="checkbox" {...register("isDependent")} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                    <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t.household.form.isDependent}</label>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Dependant Details */}
                        {step === 3 && (
                            <div className="space-y-4">
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
                                    <textarea {...register("dependencyDetails.notes")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2 border" />
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-between">
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                    {t.enrollment.buttons.prev}
                                </button>
                            ) : <div></div>}

                            {step < 3 && !((step === 2 && !["CHILD", "DEPENDANT"].includes(relationship) && !isDependent)) ? (
                                <button type="button" onClick={nextStep} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                                    {t.enrollment.buttons.next}
                                </button>
                            ) : (
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50">
                                    {isSubmitting ? "Saving..." : t.auth.save}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
