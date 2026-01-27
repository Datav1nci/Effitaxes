"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEnrollmentSchema, EnrollmentFormData } from "@/lib/enrollmentSchema";
import { ZodType } from "zod";
import { Dictionary } from "@/lib/dictionary";
import { updateTaxData } from "@/actions/updateTaxData";
import { StepPersonal } from "@/components/enrollment/StepPersonal";
import { StepIncomeSelection } from "@/components/enrollment/StepIncomeSelection";
import { StepSelfEmployed } from "@/components/enrollment/StepSelfEmployed";
import { StepCarExpenses } from "@/components/enrollment/StepCarExpenses";
import { StepRental } from "@/components/enrollment/StepRental";
import { StepWorkFromHome } from "@/components/enrollment/StepWorkFromHome";
import { useRouter } from "next/navigation";

type TaxProfileViewProps = {
    profile: { tax_data: EnrollmentFormData };
    t: Dictionary;
};

const Section = ({ title, children, onEdit, isEmpty = false }: { title: string; children: React.ReactNode; onEdit: () => void, isEmpty?: boolean }) => (
    <div className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6 border ${isEmpty ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'}`}>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            <button
                onClick={onEdit}
                className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
            >
                Edit
            </button>
        </div>
        <div>
            {isEmpty ? (
                <div className="text-amber-600 dark:text-amber-400 font-medium">Information missing. Please click Edit to complete this section.</div>
            ) : (
                children
            )}
        </div>
    </div>
);

interface SectionEditorProps {
    title: string;
    component: React.ComponentType<{ t: Dictionary }>;
    defaultValues: Partial<EnrollmentFormData>;
    t: Dictionary;
    onCancel: () => void;
    onSave: (data: EnrollmentFormData) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: ZodType<any, any, any>;
    fieldNames: string[] | string;
}

const SectionEditor = ({
    title,
    component: Component,
    defaultValues,
    t,
    onCancel,
    onSave,
    schema,
    fieldNames
}: SectionEditorProps) => {
    const methods = useForm<EnrollmentFormData>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues,
        mode: "onChange"
    });

    const { handleSubmit, trigger } = methods;
    const [isSaving, setIsSaving] = useState(false);

    const onSubmit = async (data: EnrollmentFormData) => {
        setIsSaving(true);
        // Validate specific fields for this section
        const fields = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
        // @ts-expect-error - trigger accepts array of strings
        const isValid = await trigger(fields);

        if (isValid) {
            await onSave(data);
        }
        setIsSaving(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6 border border-blue-200 dark:border-blue-900 ring-2 ring-blue-500 ring-opacity-50">
            <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Editing: {title}</h3>
            </div>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Component t={t} />
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default function TaxProfileView({ profile, t }: TaxProfileViewProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [data, setData] = useState(profile?.tax_data || {});

    const schema = createEnrollmentSchema(t);

    const handleSave = async (newData: EnrollmentFormData) => {
        const result = await updateTaxData(newData);
        if (result.success) {
            setData(newData);
            setIsEditing(null);
            router.refresh(); // Refresh server components
        } else {
            alert("Failed to save changes. Please try again.");
        }
    };

    const incomeSources = (data.incomeSources as string[]) || [];

    // Helper to check if a section has data (naive check)
    const hasData = (obj: Record<string, unknown> | undefined | null) => obj && Object.keys(obj).length > 0;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Tax Profile</h2>

            {/* Personal Section */}
            {isEditing === 'personal' ? (
                <SectionEditor
                    title={t.enrollment.steps.personal}
                    component={StepPersonal}
                    defaultValues={data}
                    t={t}
                    onCancel={() => setIsEditing(null)}
                    onSave={handleSave}
                    schema={schema}
                    fieldNames={['personal']}
                />
            ) : (
                <Section title={t.enrollment.steps.personal} onEdit={() => setIsEditing('personal')} isEmpty={!hasData(data.personal)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">First Name:</span> {data.personal?.firstName}</div>
                        <div><span className="text-gray-500">Last Name:</span> {data.personal?.lastName}</div>
                        <div><span className="text-gray-500">Email:</span> {data.personal?.email}</div>
                        <div><span className="text-gray-500">Phone:</span> {data.personal?.phone}</div>
                        <div className="col-span-1 sm:col-span-2"><span className="text-gray-500">Address:</span> {data.personal?.addressNumber} {data.personal?.addressName}, {data.personal?.addressCity}</div>
                    </div>
                </Section>
            )}

            {/* Income Selection */}
            {isEditing === 'selection' ? (
                <SectionEditor
                    title={t.enrollment.steps.selection}
                    component={StepIncomeSelection}
                    defaultValues={data}
                    t={t}
                    onCancel={() => setIsEditing(null)}
                    onSave={handleSave}
                    schema={schema}
                    fieldNames={['incomeSources']}
                />
            ) : (
                <Section title={t.enrollment.steps.selection} onEdit={() => setIsEditing('selection')} isEmpty={!incomeSources.length}>
                    <div className="flex flex-wrap gap-2">
                        {incomeSources.map((source: string) => (
                            <span key={source} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {t.enrollment.selection[source as keyof typeof t.enrollment.selection] || source}
                            </span>
                        ))}
                    </div>
                </Section>
            )}

            {/* Conditional Sections */}

            {/* Self Employed */}
            {incomeSources.includes("selfEmployed") && (
                isEditing === 'selfEmployed' ? (
                    <SectionEditor
                        title={t.enrollment.steps.selfEmployed}
                        component={StepSelfEmployed}
                        defaultValues={data}
                        t={t}
                        onCancel={() => setIsEditing(null)}
                        onSave={handleSave}
                        schema={schema}
                        fieldNames={['selfEmployed']}
                    />
                ) : (
                    <Section title={t.enrollment.steps.selfEmployed} onEdit={() => setIsEditing('selfEmployed')} isEmpty={!hasData(data.selfEmployed)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-500">Business Name:</span> {data.selfEmployed?.businessName}</div>
                            <div><span className="text-gray-500">GST/HST:</span> {data.selfEmployed?.gstHstNumber || "N/A"}</div>
                        </div>
                    </Section>
                )
            )}

            {/* Car Expenses */}
            {(incomeSources.includes("carExpenses") || incomeSources.includes("studentCarExpenses") || incomeSources.includes("selfEmployedCarExpenses") || incomeSources.includes("employeeCarExpenses") || data.car) && (
                isEditing === 'car' ? (
                    <SectionEditor
                        title={t.enrollment.steps.car}
                        component={StepCarExpenses}
                        defaultValues={data}
                        t={t}
                        onCancel={() => setIsEditing(null)}
                        onSave={handleSave}
                        schema={schema}
                        fieldNames={['car']}
                    />
                ) : (
                    <Section title={t.enrollment.steps.car} onEdit={() => setIsEditing('car')} isEmpty={!hasData(data.car)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-500">Make/Model:</span> {data.car?.makeModel}</div>
                            <div><span className="text-gray-500">Total KM:</span> {data.car?.totalKm}</div>
                        </div>
                    </Section>
                )
            )}

            {/* Rental */}
            {incomeSources.includes("rental") && (
                isEditing === 'rental' ? (
                    <SectionEditor
                        title={t.enrollment.steps.rental}
                        component={StepRental}
                        defaultValues={data}
                        t={t}
                        onCancel={() => setIsEditing(null)}
                        onSave={handleSave}
                        schema={schema}
                        fieldNames={['rental']}
                    />
                ) : (
                    <Section title={t.enrollment.steps.rental} onEdit={() => setIsEditing('rental')} isEmpty={!hasData(data.rental)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-500">Address:</span> {data.rental?.address}</div>
                            <div><span className="text-gray-500">Gross Income:</span> {data.rental?.grossIncome}</div>
                        </div>
                    </Section>
                )
            )}

            {/* Work From Home */}
            {incomeSources.includes("workFromHome") && (
                isEditing === 'workFromHome' ? (
                    <SectionEditor
                        title={t.enrollment.workFromHome.title}
                        component={StepWorkFromHome}
                        defaultValues={data}
                        t={t}
                        onCancel={() => setIsEditing(null)}
                        onSave={handleSave}
                        schema={schema}
                        fieldNames={['workFromHome']}
                    />
                ) : (
                    <Section title={t.enrollment.workFromHome.title} onEdit={() => setIsEditing('workFromHome')} isEmpty={!hasData(data.workFromHome)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-500">Method:</span> {data.workFromHome?.method}</div>
                        </div>
                    </Section>
                )
            )}

        </div>
    );
}
