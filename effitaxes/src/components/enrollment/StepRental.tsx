import React from "react";
import { FormInput } from "./FormUI";
import { dictionary } from "@/lib/dictionary";

type Dictionary = typeof dictionary.en;

export const StepRental = ({ t }: { t: Dictionary }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-4">
                <h3 className="text-lg font-medium">{t.enrollment.rental.title}</h3>
            </div>

            <FormInput label={t.enrollment.rental.address} name="rental.address" placeholder="123 Rental St, Apt 4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label={t.enrollment.rental.grossIncome} name="rental.grossIncome" type="number" prefix="$" />
                <FormInput label={t.enrollment.rental.ownershipPercentage} name="rental.ownershipPercentage" type="number" placeholder="100" />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h4 className="text-md font-semibold">{t.enrollment.rental.expenses.other || "Expenses"}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormInput label={t.enrollment.rental.expenses.advertising} name="rental.expenses.advertising" type="number" />
                    <FormInput label={t.enrollment.rental.expenses.insurance} name="rental.expenses.insurance" type="number" />
                    <FormInput label={t.enrollment.rental.expenses.interest} name="rental.expenses.interest" type="number" />
                    <FormInput label={t.enrollment.rental.expenses.taxes} name="rental.expenses.taxes" type="number" />
                    <FormInput label={t.enrollment.rental.expenses.maintenance} name="rental.expenses.maintenance" type="number" />
                    <FormInput label={t.enrollment.rental.expenses.utilities} name="rental.expenses.utilities" type="number" />
                    <FormInput label={t.enrollment.rental.expenses.managementFees} name="rental.expenses.managementFees" type="number" />
                    <FormInput label={t.enrollment.rental.expenses.other} name="rental.expenses.other" type="number" />
                </div>
            </div>
        </div>
    );
};
