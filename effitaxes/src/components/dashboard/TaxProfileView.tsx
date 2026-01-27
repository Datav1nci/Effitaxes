"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEnrollmentSchema, createDashboardSchema, EnrollmentFormData } from "@/lib/enrollmentSchema";
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

const Section = ({ title, children, onEdit, isEmpty = false, t }: { title: string; children: React.ReactNode; onEdit: () => void, isEmpty?: boolean, t: Dictionary }) => (
    <div className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6 border ${isEmpty ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'}`}>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            <button
                onClick={onEdit}
                className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
            >
                {t.common.edit}
            </button>
        </div>
        <div>
            {isEmpty ? (
                <div className="text-amber-600 dark:text-amber-400 font-medium">{t.common.missingInfo}</div>
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
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">{t.common.editSection} {title}</h3>
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

    const schema = createDashboardSchema(t);

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

    // Helper to check if a section has data
    const hasData = (obj: Record<string, unknown> | undefined | null) => obj && Object.keys(obj).length > 0;

    const FieldRow = ({ label, value }: { label: string, value: string | number | boolean | undefined | null }) => {
        if (value === undefined || value === null || value === "") return null;
        let displayValue = value;
        if (typeof value === "boolean") displayValue = value ? t.common.yes : t.common.no;
        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="font-medium text-gray-500 dark:text-gray-400">{label}</span>
                <span className="sm:col-span-2 text-gray-900 dark:text-gray-100 break-words">{String(displayValue)}</span>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{t.auth.yourProfile}</h2>

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
                <Section title={t.enrollment.steps.personal} onEdit={() => setIsEditing('personal')} isEmpty={!hasData(data.personal)} t={t}>
                    <div className="space-y-1">
                        <FieldRow label={t.enrollment.personal.firstName} value={data.personal?.firstName} />
                        <FieldRow label={t.enrollment.personal.lastName} value={data.personal?.lastName} />
                        <FieldRow label={t.enrollment.personal.email} value={data.personal?.email} />
                        <FieldRow label={t.enrollment.personal.phone} value={data.personal?.phone} />
                        <FieldRow label={t.enrollment.personal.dob} value={data.personal?.dob} />
                        <FieldRow label={t.enrollment.personal.maritalStatus} value={data.personal?.maritalStatus ? t.enrollment.personal.maritalStatusOptions[data.personal?.maritalStatus as keyof typeof t.enrollment.personal.maritalStatusOptions] : ""} />
                        <FieldRow label={t.enrollment.personal.maritalChangeDate} value={data.personal?.maritalChangeDate} />
                        <FieldRow label={t.enrollment.personal.province} value={data.personal?.province} />
                        <FieldRow label={t.enrollment.personal.ownerTenant} value={data.personal?.ownerTenant === "owner" ? t.enrollment.personal.ownerTenantOptions.owner : (data.personal?.ownerTenant === "tenant" ? t.enrollment.personal.ownerTenantOptions.tenant : "")} />
                        <FieldRow label={t.enrollment.personal.soldBuyHouse} value={data.personal?.soldBuyHouse} />
                        <FieldRow label={t.enrollment.personal.incomeSource} value={data.personal?.incomeSource} />
                        <FieldRow label={t.enrollment.personal.privateDrugInsurance} value={data.personal?.privateDrugInsurance === "yes" ? t.common.yes : (data.personal?.privateDrugInsurance === "no" ? t.common.no : "")} />
                        <FieldRow label={t.enrollment.personal.insuranceMonths} value={data.personal?.insuranceMonths} />
                        <FieldRow label={t.enrollment.personal.additionalInfo} value={data.personal?.additionalInfo} />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <span className="font-medium text-gray-500 dark:text-gray-400">{t.contact.address}</span>
                            <span className="sm:col-span-2 text-gray-900 dark:text-gray-100">
                                {data.personal?.addressNumber} {data.personal?.addressName}, {data.personal?.addressApp ? `#${data.personal.addressApp}, ` : ""}{data.personal?.addressCity}
                            </span>
                        </div>
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
                <Section title={t.enrollment.steps.selection} onEdit={() => setIsEditing('selection')} isEmpty={!incomeSources.length} t={t}>
                    <div className="flex flex-wrap gap-2">
                        {incomeSources.map((source: string) => (
                            <span key={source} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {t.enrollment.selection[source as keyof typeof t.enrollment.selection] || source}
                            </span>
                        ))}
                    </div>
                </Section>
            )}

            {/* Self Employed */}
            {(incomeSources.includes("selfEmployed") || hasData(data.selfEmployed)) && (
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
                    <Section title={t.enrollment.steps.selfEmployed} onEdit={() => setIsEditing('selfEmployed')} isEmpty={!hasData(data.selfEmployed)} t={t}>
                        <div className="space-y-1">
                            <h4 className="font-semibold mt-2 mb-1 border-b pb-1 dark:border-gray-700">General</h4>
                            <FieldRow label={t.enrollment.selfEmployed.businessName} value={data.selfEmployed?.businessName} />
                            <FieldRow label={t.enrollment.selfEmployed.businessPhone} value={data.selfEmployed?.businessPhone} />
                            <FieldRow label="GST/HST" value={data.selfEmployed?.gstHstNumber} />
                            <FieldRow label={t.enrollment.selfEmployed.creationDate} value={data.selfEmployed?.creationDate} />
                            <FieldRow label={t.enrollment.selfEmployed.isActive} value={data.selfEmployed?.isActive === "yes" ? t.common.yes : t.common.no} />
                            <FieldRow label={t.enrollment.selfEmployed.productType} value={data.selfEmployed?.productType} />
                            <FieldRow label={t.enrollment.selfEmployed.grossIncome} value={data.selfEmployed?.grossIncome} />

                            <h4 className="font-semibold mt-4 mb-1 border-b pb-1 dark:border-gray-700">{t.enrollment.selfEmployed.expenses.title}</h4>
                            {data.selfEmployed?.expenses && Object.entries(data.selfEmployed.expenses).map(([key, value]) => {
                                const labelKey = key as keyof typeof t.enrollment.selfEmployed.expenses;
                                const label = t.enrollment.selfEmployed.expenses[labelKey] || key;
                                return <FieldRow key={key} label={label} value={value as string | number} />;
                            })}
                        </div>
                    </Section>
                )
            )}

            {/* Car Expenses */}
            {(incomeSources.includes("carExpenses") || incomeSources.includes("studentCarExpenses") || incomeSources.includes("selfEmployedCarExpenses") || incomeSources.includes("employeeCarExpenses") || hasData(data.car)) && (
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
                    <Section title={t.enrollment.steps.car} onEdit={() => setIsEditing('car')} isEmpty={!hasData(data.car)} t={t}>
                        <div className="space-y-1">
                            <FieldRow label={t.enrollment.car.makeModel} value={data.car?.makeModel} />
                            <FieldRow label={t.enrollment.car.businessKm} value={data.car?.businessKm} />
                            <FieldRow label={t.enrollment.car.totalKm} value={data.car?.totalKm} />
                            <FieldRow label={t.enrollment.car.gas} value={data.car?.gas} />
                            <FieldRow label={t.enrollment.car.insurance} value={data.car?.insurance} />
                            <FieldRow label={t.enrollment.car.license} value={data.car?.license} />
                            <FieldRow label={t.enrollment.car.maintenance} value={data.car?.maintenance} />
                            <FieldRow label={t.enrollment.car.purchaseLeaseDate} value={data.car?.purchaseLeaseDate} />
                            <FieldRow label={t.enrollment.car.leaseEndDate} value={data.car?.leaseEndDate} />
                            <FieldRow label={t.enrollment.car.leasePayments} value={data.car?.leasePayments} />
                            <FieldRow label={t.enrollment.car.notes} value={data.car?.notes} />
                        </div>
                    </Section>
                )
            )}

            {/* Rental */}
            {(incomeSources.includes("rental") || hasData(data.rental)) && (
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
                    <Section title={t.enrollment.steps.rental} onEdit={() => setIsEditing('rental')} isEmpty={!hasData(data.rental)} t={t}>
                        <div className="space-y-1">
                            <FieldRow label={t.enrollment.rental.address} value={data.rental?.address} />
                            <FieldRow label={t.enrollment.rental.grossIncome} value={data.rental?.grossIncome} />
                            <FieldRow label={t.enrollment.rental.ownershipPercentage} value={data.rental?.ownershipPercentage} />

                            <h4 className="font-semibold mt-4 mb-1 border-b pb-1 dark:border-gray-700">Expenses</h4>
                            {data.rental?.expenses && Object.entries(data.rental.expenses).map(([key, value]) => {
                                const labelKey = key as keyof typeof t.enrollment.rental.expenses;
                                const label = t.enrollment.rental.expenses[labelKey] || key;
                                return <FieldRow key={key} label={label} value={value as string | number} />;
                            })}
                        </div>
                    </Section>
                )
            )}

            {/* Work From Home */}
            {(incomeSources.includes("workFromHome") || hasData(data.workFromHome)) && (
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
                    <Section title={t.enrollment.workFromHome.title} onEdit={() => setIsEditing('workFromHome')} isEmpty={!hasData(data.workFromHome)} t={t}>
                        <div className="space-y-1">
                            <FieldRow label="Method" value={data.workFromHome?.method} />

                            <h4 className="font-semibold mt-4 mb-1 border-b pb-1 dark:border-gray-700">{t.enrollment.workFromHome.utilities.title}</h4>
                            {data.workFromHome?.utilities && Object.entries(data.workFromHome.utilities).map(([key, value]) => {
                                const labelKey = key as keyof typeof t.enrollment.workFromHome.utilities;
                                const label = t.enrollment.workFromHome.utilities[labelKey] || key;
                                return <FieldRow key={key} label={label} value={value as string | number} />;
                            })}

                            <h4 className="font-semibold mt-4 mb-1 border-b pb-1 dark:border-gray-700">{t.enrollment.workFromHome.maintenance.title}</h4>
                            {data.workFromHome?.maintenance && Object.entries(data.workFromHome.maintenance).map(([key, value]) => {
                                const labelKey = key as keyof typeof t.enrollment.workFromHome.maintenance;
                                const label = t.enrollment.workFromHome.maintenance[labelKey] || key;
                                return <FieldRow key={key} label={label} value={value as string | number} />;
                            })}

                            <h4 className="font-semibold mt-4 mb-1 border-b pb-1 dark:border-gray-700">{t.enrollment.workFromHome.communication.title}</h4>
                            {data.workFromHome?.communication && Object.entries(data.workFromHome.communication).map(([key, value]) => {
                                const labelKey = key as keyof typeof t.enrollment.workFromHome.communication;
                                const label = t.enrollment.workFromHome.communication[labelKey] || key;
                                return <FieldRow key={key} label={label} value={value as string | number} />;
                            })}
                        </div>
                    </Section>
                )
            )}

        </div>
    );
}
