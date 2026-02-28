"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchemas, EnrollmentFormData } from "@/lib/enrollmentSchema";
import { z, ZodType } from "zod";
import { Dictionary } from "@/lib/dictionary";
import { updateTaxData } from "@/actions/updateTaxData";
import { StepPersonal } from "@/components/enrollment/StepPersonal";
import { StepIncomeSelection } from "@/components/enrollment/StepIncomeSelection";
import { StepSelfEmployed } from "@/components/enrollment/StepSelfEmployed";
import { StepCarExpenses } from "@/components/enrollment/StepCarExpenses";
import { StepRental } from "@/components/enrollment/StepRental";
import { StepWorkFromHome } from "@/components/enrollment/StepWorkFromHome";
import { useRouter } from "next/navigation";
import HouseholdPanel from "./HouseholdPanel";
import { Household, HouseholdMember } from "@/lib/householdTypes";

type TaxProfileViewProps = {
    profile: {
        tax_data: EnrollmentFormData;
        email?: string | null;
    };
    household?: Household | null;
    members?: HouseholdMember[] | null;
    t: Dictionary;
};

const Section = ({ title, children, onEdit, isEmpty = false, t }: { title: string; children: React.ReactNode; onEdit: () => void, isEmpty?: boolean, t: Dictionary }) => (
    <div className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6 border ${isEmpty ? 'border-amber-300 dark:border-amber-700' : 'border-gray-200 dark:border-gray-700'}`}>
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
    onSaveError?: (msg: string) => void;
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
    onSaveError,
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
    const [inlineError, setInlineError] = useState<string | null>(null);

    const onSubmit = async (data: EnrollmentFormData) => {
        setIsSaving(true);
        setInlineError(null);
        // Validate specific fields for this section
        const fields = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
        // @ts-expect-error - trigger accepts array of strings
        const isValid = await trigger(fields);

        if (isValid) {
            try {
                await onSave(data);
            } catch {
                const msg = "Failed to save changes. Please try again.";
                setInlineError(msg);
                if (onSaveError) onSaveError(msg);
            }
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
                    <div className="mt-6 flex flex-col gap-3">
                        {inlineError && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-700 dark:text-red-300">{inlineError}</p>
                            </div>
                        )}
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                {t.common.cancel}
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                            >
                                {isSaving ? t.common.saving : t.common.saveChanges}
                            </button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default function TaxProfileView({ profile, household, members, t }: TaxProfileViewProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [data, setData] = useState<Partial<EnrollmentFormData>>(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const initialData = (profile?.tax_data || {}) as any;
        // Pre-fill email from profile if missing in tax data
        if (!initialData.personal) {
            initialData.personal = {};
        }
        if (!initialData.personal.email && profile?.email) {
            initialData.personal.email = profile.email;
        }
        return initialData;
    });

    const [pendingBatchId, setPendingBatchId] = useState<string | null>(null);
    const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);
    const [updatedSections, setUpdatedSections] = useState<Set<string>>(new Set());
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const currentBatchIdRef = useRef<string | null>(null);
    const updatedSectionsRef = useRef<Set<string>>(new Set());

    // Keep refs updated for the beacon
    useEffect(() => {
        currentBatchIdRef.current = pendingBatchId;
    }, [pendingBatchId]);

    useEffect(() => {
        updatedSectionsRef.current = updatedSections;
    }, [updatedSections]);

    const schemas = React.useMemo(() => createSchemas(t), [t]);

    // Handle Manual or Timer Submission
    const submitBatchUpdates = useCallback(async (batchIdToSubmit: string) => {
        if (!batchIdToSubmit || isSubmittingBatch) return;
        setIsSubmittingBatch(true);
        const sectionsSnapshot = Array.from(updatedSectionsRef.current);
        try {
            const res = await fetch("/api/notify-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ batchId: batchIdToSubmit, updatedSections: sectionsSnapshot }),
            });
            if (res.ok) {
                setPendingBatchId(null);
                setUpdatedSections(new Set());
                if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            } else {
                console.error("Failed to notify admin of batch:", await res.text());
                // Fallback: clear it so the UI isn't stuck forever, but log it
                setPendingBatchId(null);
            }
        } catch (e) {
            console.error("Error submitting batch:", e);
            setPendingBatchId(null);
        } finally {
            setIsSubmittingBatch(false);
        }
    }, [isSubmittingBatch]);

    // 3-Minute Debounce Timer
    useEffect(() => {
        if (pendingBatchId) {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = setTimeout(() => {
                submitBatchUpdates(pendingBatchId);
            }, 3 * 60 * 1000); // 3 minutes
        }
        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, [pendingBatchId, submitBatchUpdates]);

    // Visibility Change Beacon (reliable unmount/tab close)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden" && currentBatchIdRef.current) {
                const payload = JSON.stringify({
                    batchId: currentBatchIdRef.current,
                    updatedSections: Array.from(updatedSectionsRef.current),
                });
                navigator.sendBeacon("/api/notify-admin", payload);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    // Called whenever a local change happens (save section or household update)
    const triggerPendingState = (sectionName?: string) => {
        setPendingBatchId(prev => prev || crypto.randomUUID());
        if (sectionName) {
            setUpdatedSections(prev => new Set(prev).add(sectionName));
            updatedSectionsRef.current = new Set(updatedSectionsRef.current).add(sectionName);
        }
    };

    const handleSave = async (partialData: EnrollmentFormData) => {
        // Merge the new partial data with existing data to ensure we don't overwrite with incomplete object
        const mergedData = { ...data, ...partialData };

        const result = await updateTaxData(mergedData);
        if (result.success) {
            triggerPendingState(isEditing || undefined);
            // Check if we updated 'selection' and if new sources were added
            if (isEditing === 'selection') {
                const oldSources = (data.incomeSources as string[]) || [];
                const newSources = (mergedData.incomeSources as string[]) || [];
                const added = newSources.filter(s => !oldSources.includes(s));

                const sectionMap: Record<string, string> = {
                    selfEmployed: 'selfEmployed',
                    rental: 'rental',
                    workFromHome: 'workFromHome',
                    carExpenses: 'car',
                    studentCarExpenses: 'car',
                    selfEmployedCarExpenses: 'car',
                    employeeCarExpenses: 'car',
                };

                // Find the first added section that needs filling
                let nextSection = null;
                for (const s of added) {
                    if (sectionMap[s]) {
                        nextSection = sectionMap[s];
                        // If we found a mapped section, prioritize it
                        break;
                    }
                }

                if (nextSection) {
                    setData(mergedData);
                    setIsEditing(nextSection);
                    router.refresh();
                    return;
                }
            }

            setData(mergedData);
            setIsEditing(null);
            router.refresh(); // Refresh server components
        } else {
            // error is handled inline in SectionEditor
            throw new Error(result.error || "Save failed");
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
            <div className="grid grid-cols-1 sm:grid-cols-[45%_1fr] gap-2 py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="font-medium text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-gray-900 dark:text-gray-100 break-words">{String(displayValue)}</span>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{t.auth.yourProfile}</h2>

            {/* Pending Updates Banner */}
            {pendingBatchId && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 fade-in duration-300 shadow-sm dark:bg-blue-900/20 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                        <div className="text-blue-500 mt-0.5">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-200">
                                {t.common.submitUpdatesBtn || "Submit Profile Updates"}
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                {t.common.submitUpdatesHelpText || "We'll email your updates to the admin in a few minutes unless you submit now."}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => submitBatchUpdates(pendingBatchId!)}
                        disabled={isSubmittingBatch}
                        className="whitespace-nowrap w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmittingBatch ? "..." : (t.common.submitUpdatesBtn || "Submit Updates")}
                    </button>
                </div>
            )}

            {/* Household Panel */}
            <HouseholdPanel household={household} members={members} t={t} onUpdate={() => triggerPendingState("household")} />

            {/* Personal Section */}
            {isEditing === 'personal' ? (
                <SectionEditor
                    title={t.enrollment.steps.personal}
                    component={StepPersonal}
                    defaultValues={data}
                    t={t}
                    onCancel={() => setIsEditing(null)}
                    onSave={handleSave}
                    schema={z.object({ personal: schemas.personal })}
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
                        <div className="grid grid-cols-1 sm:grid-cols-[45%_1fr] gap-2 py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <span className="font-medium text-gray-500 dark:text-gray-400">{t.contact.address}</span>
                            <span className="text-gray-900 dark:text-gray-100">
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
                    schema={z.object({ incomeSources: schemas.incomeSources.shape.incomeSources })}
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
                        schema={z.object({ selfEmployed: schemas.selfEmployed })}
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

                            {data.selfEmployed?.homeOffice && (
                                <>
                                    <h4 className="font-semibold mt-4 mb-1 border-b pb-1 dark:border-gray-700">{t.enrollment.selfEmployed.homeOffice.title}</h4>
                                    <FieldRow label={t.enrollment.selfEmployed.homeOffice.totalArea} value={data.selfEmployed.homeOffice.totalArea} />
                                    <FieldRow label={t.enrollment.selfEmployed.homeOffice.businessArea} value={data.selfEmployed.homeOffice.businessArea} />
                                    <FieldRow label={t.enrollment.selfEmployed.homeOffice.electricity} value={data.selfEmployed.homeOffice.electricity} />
                                    <FieldRow label={t.enrollment.selfEmployed.homeOffice.heating} value={data.selfEmployed.homeOffice.heating} />
                                    <FieldRow label={t.enrollment.selfEmployed.homeOffice.insurance} value={data.selfEmployed.homeOffice.insurance} />
                                    <FieldRow label={t.enrollment.selfEmployed.homeOffice.maintenance} value={data.selfEmployed.homeOffice.maintenance} />
                                    <FieldRow label={t.enrollment.selfEmployed.homeOffice.mortgageInterest} value={data.selfEmployed.homeOffice.mortgageInterest} />
                                    <FieldRow label={t.enrollment.selfEmployed.homeOffice.propertyTaxes} value={data.selfEmployed.homeOffice.propertyTaxes} />
                                    <FieldRow label={t.enrollment.selfEmployed.homeOffice.other} value={data.selfEmployed.homeOffice.other} />
                                </>
                            )}
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
                        schema={z.object({ car: schemas.car })}
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
            {(incomeSources.includes("rental") || (data.rental?.properties && data.rental.properties.length > 0)) && (
                isEditing === 'rental' ? (
                    <SectionEditor
                        title={t.enrollment.steps.rental}
                        component={StepRental}
                        defaultValues={data}
                        t={t}
                        onCancel={() => setIsEditing(null)}
                        onSave={handleSave}
                        schema={z.object({ rental: schemas.rental })}
                        fieldNames={['rental']}
                    />
                ) : (
                    <Section title={t.enrollment.steps.rental} onEdit={() => setIsEditing('rental')} isEmpty={!(data.rental?.properties && data.rental.properties.length > 0)} t={t}>
                        <div className="space-y-6">
                            {data.rental?.properties?.map((property, idx) => (
                                <div key={idx} className="space-y-1 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                        {t.enrollment.rental.propertyLabel} {idx + 1}
                                    </h4>
                                    <FieldRow label={t.enrollment.rental.propertyType} value={property.propertyType ? t.enrollment.rental.propertyTypeOptions[property.propertyType as keyof typeof t.enrollment.rental.propertyTypeOptions] : ""} />
                                    <FieldRow label={t.enrollment.rental.address} value={property.address} />
                                    <FieldRow label={t.enrollment.rental.grossIncome} value={property.grossIncome} />
                                    <FieldRow label={t.enrollment.rental.ownershipPercentage} value={property.ownershipPercentage} />

                                    <h5 className="font-medium mt-3 mb-1 text-sm text-gray-700 dark:text-gray-300">Expenses</h5>
                                    {property.expenses && Object.entries(property.expenses).map(([key, value]) => {
                                        const labelKey = key as keyof typeof t.enrollment.rental.expenses;
                                        const label = t.enrollment.rental.expenses[labelKey] || key;
                                        return <FieldRow key={key} label={label} value={value as string | number} />;
                                    })}
                                </div>
                            ))}
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
                        schema={z.object({ workFromHome: schemas.workFromHome })}
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
