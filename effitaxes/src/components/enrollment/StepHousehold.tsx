"use client";

import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { EnrollmentFormData } from "@/lib/enrollmentSchema";
import { dictionary } from "@/lib/dictionary";

type Dictionary = typeof dictionary.en;

type Relationship = "SPOUSE" | "PARTNER" | "CHILD" | "DEPENDANT" | "OTHER";

const RELATIONSHIPS: Relationship[] = ["SPOUSE", "PARTNER", "CHILD", "DEPENDANT", "OTHER"];

export const StepHousehold = ({ t }: { t: Dictionary }) => {
    const { control, register, formState: { errors } } = useFormContext<EnrollmentFormData>();
    const { fields, append, remove } = useFieldArray({ control, name: "household" });

    const hh = t.enrollment.personal.household;

    const addMember = () => {
        append({
            firstName: "",
            lastName: "",
            relationship: "CHILD",
            dateOfBirth: "",
            livesWithPrimary: true,
            isDependent: false,
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold">{hh.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{hh.subtitle}</p>
            </div>

            {/* Empty state */}
            {fields.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center">
                    <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
                    <p className="text-sm text-gray-400 dark:text-gray-500">{hh.noMembers}</p>
                </div>
            )}

            {/* Member cards */}
            <div className="space-y-4">
                {fields.map((field, index) => {
                    const memberErrors = (errors.household as Record<string, unknown>)?.[index];
                    return (
                        <div
                            key={field.id}
                            className="relative p-5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300"
                        >
                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                aria-label={hh.removeMember}
                                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-lg leading-none"
                            >
                                &times;
                            </button>

                            {/* Name row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{hh.firstName}</label>
                                    <input
                                        {...register(`household.${index}.firstName`)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {(memberErrors as { firstName?: { message?: string } })?.firstName && (
                                        <p className="text-xs text-red-500 mt-1">{(memberErrors as { firstName?: { message?: string } }).firstName?.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{hh.lastName}</label>
                                    <input
                                        {...register(`household.${index}.lastName`)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {(memberErrors as { lastName?: { message?: string } })?.lastName && (
                                        <p className="text-xs text-red-500 mt-1">{(memberErrors as { lastName?: { message?: string } }).lastName?.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Relationship + DOB row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{hh.relationship}</label>
                                    <select
                                        {...register(`household.${index}.relationship`)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {RELATIONSHIPS.map(r => (
                                            <option key={r} value={r}>{hh.relationships[r]}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{hh.dob}</label>
                                    <input
                                        type="date"
                                        {...register(`household.${index}.dateOfBirth`)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Checkboxes row */}
                            <div className="flex flex-wrap gap-6 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <Controller
                                        control={control}
                                        name={`household.${index}.livesWithPrimary`}
                                        render={({ field: f }) => (
                                            <input
                                                type="checkbox"
                                                checked={!!f.value}
                                                onChange={f.onChange}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        )}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{hh.livesWithPrimary}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <Controller
                                        control={control}
                                        name={`household.${index}.isDependent`}
                                        render={({ field: f }) => (
                                            <input
                                                type="checkbox"
                                                checked={!!f.value}
                                                onChange={f.onChange}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        )}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{hh.isDependent}</span>
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add member button */}
            <button
                type="button"
                onClick={addMember}
                className="w-full py-3 px-4 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 transition-all duration-200 focus:outline-none"
            >
                {hh.addMember}
            </button>
        </div>
    );
};
