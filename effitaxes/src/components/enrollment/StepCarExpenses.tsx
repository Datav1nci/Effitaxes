import React from "react";
import { FormInput, FormLabel } from "./FormUI";
import { dictionary } from "@/lib/dictionary";

type Dictionary = typeof dictionary.en;

export const StepCarExpenses = ({ t }: { t: Dictionary }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-4">
                <h3 className="text-lg font-medium">{t.enrollment.car.title}</h3>
            </div>

            <FormInput label={t.enrollment.car.makeModel} name="car.makeModel" placeholder="e.g. Honda Civic 2020" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label={t.enrollment.car.businessKm} name="car.businessKm" type="number" />
                <FormInput label={t.enrollment.car.totalKm} name="car.totalKm" type="number" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormInput label={t.enrollment.car.gas} name="car.gas" type="number" />
                <FormInput label={t.enrollment.car.insurance} name="car.insurance" type="number" />
                <FormInput label={t.enrollment.car.license} name="car.license" type="number" />
                <FormInput label={t.enrollment.car.maintenance} name="car.maintenance" type="number" />
                <FormInput label={t.enrollment.car.leasePayments} name="car.leasePayments" type="number" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label={t.enrollment.car.purchaseLeaseDate} name="car.purchaseLeaseDate" type="date" />
                <FormInput label={t.enrollment.car.leaseEndDate} name="car.leaseEndDate" type="date" />
            </div>

            <FormInput label={t.enrollment.car.notes} name="car.notes" />
        </div>
    );
};
