import React from "react";
import { useFormContext } from "react-hook-form";
import { FormInput, FormRadioGroup, AnnualBanner } from "./FormUI";
import { dictionary } from "@/lib/dictionary";

type Dictionary = typeof dictionary.en;

export const StepCarExpenses = ({ t }: { t: Dictionary }) => {
    const { watch } = useFormContext();
    const isOwner = watch("car.isOwner");

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-4">
                <h3 className="text-lg font-medium">{t.enrollment.car.title}</h3>
            </div>

            <AnnualBanner message={t.enrollment.annualTotalsNote} />

            <FormInput label={t.enrollment.car.makeModel} name="car.makeModel" placeholder="e.g. Honda Civic 2021" />

            {/* Ownership type */}
            <FormRadioGroup
                label={t.enrollment.car.isOwner}
                name="car.isOwner"
                options={[
                    { value: "owner", label: t.enrollment.car.isOwnerOptions.owner },
                    { value: "leased", label: t.enrollment.car.isOwnerOptions.leased },
                ]}
            />

            {/* FMV only shown for owners — needed for CCA (Capital Cost Allowance) depreciation */}
            {isOwner === "owner" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <FormInput
                        label={t.enrollment.car.openingFMV}
                        name="car.openingFMV"
                        type="number"
                        prefix="$"
                        placeholder="$0"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label={t.enrollment.car.businessKm} name="car.businessKm" type="number" />
                <FormInput label={t.enrollment.car.totalKm} name="car.totalKm" type="number" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormInput label={t.enrollment.car.gas} name="car.gas" type="number" placeholder="$0" />
                <FormInput label={t.enrollment.car.insurance} name="car.insurance" type="number" placeholder="$0" />
                <FormInput label={t.enrollment.car.license} name="car.license" type="number" placeholder="$0" />
                <FormInput label={t.enrollment.car.maintenance} name="car.maintenance" type="number" placeholder="$0" />
                {/* Lease payments only relevant when leasing */}
                {isOwner === "leased" && (
                    <FormInput label={t.enrollment.car.leasePayments} name="car.leasePayments" type="number" placeholder="$0" />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label={t.enrollment.car.purchaseLeaseDate} name="car.purchaseLeaseDate" type="date" />
                <FormInput label={t.enrollment.car.leaseEndDate} name="car.leaseEndDate" type="date" />
            </div>

            <FormInput label={t.enrollment.car.notes} name="car.notes" />
        </div>
    );
};
