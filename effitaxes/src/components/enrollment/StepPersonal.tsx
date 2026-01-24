import React from "react";
import { useFormContext } from "react-hook-form";
import { FormInput, FormSelect, FormRadioGroup } from "./FormUI";
import { dictionary } from "@/lib/dictionary";

// Helper to infer type from dictionary
type Dictionary = typeof dictionary.en;

export const StepPersonal = ({ t }: { t: Dictionary }) => {
    const { watch } = useFormContext();
    const maritalStatus = watch("personal.maritalStatus");

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label={t.enrollment.personal.firstName} name="personal.firstName" />
                <FormInput label={t.enrollment.personal.lastName} name="personal.lastName" />
            </div>

            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2 md:col-span-1">
                    <FormInput label={t.enrollment.personal.addressNumber} name="personal.addressNumber" />
                </div>
                <div className="col-span-4 md:col-span-5">
                    <FormInput label={t.enrollment.personal.addressName} name="personal.addressName" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                    label={t.enrollment.personal.addressCity}
                    name="personal.addressCity"
                    labelClassName="md:min-h-10 flex md:items-end"
                />
                <FormInput
                    label={t.enrollment.personal.addressApp}
                    name="personal.addressApp"
                    labelClassName="md:min-h-10 flex md:items-end"
                />
                <FormInput
                    label={
                        <span>
                            {t.enrollment.personal.province.split('(')[0]}
                            <span className="whitespace-nowrap">
                                ({t.enrollment.personal.province.split('(')[1]}
                            </span>
                        </span>
                    }
                    name="personal.province"
                    defaultValue="QC"
                    labelClassName="md:min-h-10 flex md:items-end"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label={t.enrollment.personal.phone} name="personal.phone" placeholder={t.contact.form.phonePlaceholder} />
                <FormInput label={t.enrollment.personal.dob} name="personal.dob" type="date" />
            </div>

            <FormInput label={t.enrollment.personal.email} name="personal.email" type="email" placeholder={t.contact.form.emailPlaceholder} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                    label={t.enrollment.personal.maritalStatus}
                    name="personal.maritalStatus"
                    options={[
                        { value: "single", label: t.enrollment.personal.maritalStatusOptions.single },
                        { value: "married", label: t.enrollment.personal.maritalStatusOptions.married },
                        { value: "commonLaw", label: t.enrollment.personal.maritalStatusOptions.commonLaw },
                        { value: "separated", label: t.enrollment.personal.maritalStatusOptions.separated },
                        { value: "divorced", label: t.enrollment.personal.maritalStatusOptions.divorced },
                        { value: "widowed", label: t.enrollment.personal.maritalStatusOptions.widowed },
                    ]}
                />
                {/* Conditional Date field */}
                {maritalStatus && maritalStatus !== "single" && (
                    <FormInput
                        label={t.enrollment.personal.maritalChangeDate}
                        name="personal.maritalChangeDate"
                        type="date"
                    />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormSelect
                    label={t.enrollment.personal.ownerTenant}
                    name="personal.ownerTenant"
                    options={[
                        { value: "owner", label: t.enrollment.personal.ownerTenantOptions.owner },
                        { value: "tenant", label: t.enrollment.personal.ownerTenantOptions.tenant },
                    ]}
                />
            </div>

            <FormRadioGroup
                label={t.enrollment.personal.soldBuyHouse}
                name="personal.soldBuyHouseStr"
                options={[
                    { value: "yes", label: "Yes / Oui" }, // Hardcoded or needs dictionary for Yes/No common? 
                    // Ideally dictionary should have "common.yes", "common.no". 
                    { value: "no", label: "No / Non" }
                ]}
            />

            <FormInput label={t.enrollment.personal.incomeSource} name="personal.incomeSource" />

            <div className="border-t pt-4">
                <FormRadioGroup
                    label={t.enrollment.personal.privateDrugInsurance}
                    name="personal.privateDrugInsurance"
                    options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                />
                <FormInput label={t.enrollment.personal.insuranceMonths} name="personal.insuranceMonths" type="number" placeholder="0-12" />
            </div>

            <FormRadioGroup
                label={t.enrollment.personal.workedRemotely}
                name="personal.workedRemotely"
                options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
            />

            <FormInput
                label={t.enrollment.personal.additionalInfo}
                name="personal.additionalInfo"
                className="h-24"
            // FormInput renders 'input'. I should probably add FormTextarea. 
            // For now I'll use input but it's single line. 
            />
        </div>
    );
};
