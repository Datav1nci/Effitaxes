import React from "react";
import { useFormContext } from "react-hook-form";
import { FormInput, FormRadioGroup } from "./FormUI";
import { dictionary } from "@/lib/dictionary";

type Dictionary = typeof dictionary.en;

export const StepSelfEmployed = ({ t }: { t: Dictionary }) => {
    const { watch } = useFormContext();
    const incomeSources = watch("incomeSources") || [];
    const showHomeOffice = incomeSources.includes("selfEmployedHomeOffice");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

            {/* Business Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">{t.enrollment.selfEmployed.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={t.enrollment.selfEmployed.businessName} name="selfEmployed.businessName" />
                    <FormInput label={t.enrollment.selfEmployed.businessPhone} name="selfEmployed.businessPhone" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={t.enrollment.selfEmployed.creationDate} name="selfEmployed.creationDate" type="date" />
                    <FormRadioGroup
                        label={t.enrollment.selfEmployed.isActive}
                        name="selfEmployed.isActive"
                        options={[{ value: "yes", label: t.common.yes }, { value: "no", label: t.common.no }]}
                    />
                </div>
                <FormInput label={t.enrollment.selfEmployed.productType} name="selfEmployed.productType" />
                <FormInput label={t.enrollment.selfEmployed.grossIncome} name="selfEmployed.grossIncome" type="number" prefix="$" />
            </div>

            {/* Expenses */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">{t.enrollment.selfEmployed.expenses.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormInput label={t.enrollment.selfEmployed.expenses.advertising} name="selfEmployed.expenses.advertising" type="number" />
                    <FormInput label={t.enrollment.selfEmployed.expenses.insurance} name="selfEmployed.expenses.insurance" type="number" />
                    <FormInput label={t.enrollment.selfEmployed.expenses.interest} name="selfEmployed.expenses.interest" type="number" />
                    <FormInput label={t.enrollment.selfEmployed.expenses.taxesLicenses} name="selfEmployed.expenses.taxesLicenses" type="number" />
                    <FormInput label={t.enrollment.selfEmployed.expenses.officeExpenses} name="selfEmployed.expenses.officeExpenses" type="number" />
                    <FormInput label={t.enrollment.selfEmployed.expenses.professionalFees} name="selfEmployed.expenses.professionalFees" type="number" />
                    <FormInput label={t.enrollment.selfEmployed.expenses.managementFees} name="selfEmployed.expenses.managementFees" type="number" />
                    <FormInput label={t.enrollment.selfEmployed.expenses.rent} name="selfEmployed.expenses.rent" type="number" />
                    <FormInput label={t.enrollment.selfEmployed.expenses.repairs} name="selfEmployed.expenses.repairs" type="number" />
                    <FormInput label={t.enrollment.selfEmployed.expenses.salaries} name="selfEmployed.expenses.salaries" type="number" />
                    <FormInput label={t.enrollment.selfEmployed.expenses.travel} name="selfEmployed.expenses.travel" type="number" />
                    <FormInput label={t.enrollment.selfEmployed.expenses.delivery} name="selfEmployed.expenses.delivery" type="number" />
                </div>
                <FormInput label={t.enrollment.selfEmployed.expenses.other} name="selfEmployed.expenses.other" type="number" />
                <FormInput label="Description (Other)" name="selfEmployed.expenses.otherDescription" placeholder="Specify..." />
            </div>

            {/* Home Office */}
            {showHomeOffice && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-lg font-semibold border-b pb-2">{t.enrollment.selfEmployed.homeOffice.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label={t.enrollment.selfEmployed.homeOffice.totalArea} name="selfEmployed.homeOffice.totalArea" type="number" />
                        <FormInput label={t.enrollment.selfEmployed.homeOffice.businessArea} name="selfEmployed.homeOffice.businessArea" type="number" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput label={t.enrollment.selfEmployed.homeOffice.electricity} name="selfEmployed.homeOffice.electricity" type="number" />
                        <FormInput label={t.enrollment.selfEmployed.homeOffice.heating} name="selfEmployed.homeOffice.heating" type="number" />
                        <FormInput label={t.enrollment.selfEmployed.homeOffice.insurance} name="selfEmployed.homeOffice.insurance" type="number" />
                        <FormInput label={t.enrollment.selfEmployed.homeOffice.maintenance} name="selfEmployed.homeOffice.maintenance" type="number" />
                        <FormInput label={t.enrollment.selfEmployed.homeOffice.mortgageInterest} name="selfEmployed.homeOffice.mortgageInterest" type="number" />
                        <FormInput label={t.enrollment.selfEmployed.homeOffice.propertyTaxes} name="selfEmployed.homeOffice.propertyTaxes" type="number" />
                        <FormInput label={t.enrollment.selfEmployed.homeOffice.other} name="selfEmployed.homeOffice.other" type="number" />
                    </div>
                </div>
            )}
        </div>
    );
};
