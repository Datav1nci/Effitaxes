import React from "react";
import { FormCheckbox } from "./FormUI";
import { dictionary } from "@/lib/dictionary";

type Dictionary = typeof dictionary.en;

export const StepIncomeSelection = ({ t }: { t: Dictionary }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-6">
                <h3 className="text-lg font-medium">{t.enrollment.selection.title}</h3>
                <p className="text-sm text-gray-500">{t.enrollment.selection.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* We map to an array string 'incomeSources' */}
                <FormCheckbox label={t.enrollment.selection.employee} name="incomeSources" value="employee" />
                <FormCheckbox label={t.enrollment.selection.selfEmployed} name="incomeSources" value="selfEmployed" />
                <FormCheckbox label={t.enrollment.selection.student} name="incomeSources" value="student" />
                <FormCheckbox label={t.enrollment.selection.retired} name="incomeSources" value="retired" />
                <FormCheckbox label={t.enrollment.selection.rental} name="incomeSources" value="rental" />
                <FormCheckbox label={t.enrollment.selection.crypto} name="incomeSources" value="crypto" />
                <FormCheckbox label={t.enrollment.selection.carExpenses} name="incomeSources" value="carExpenses" />
                <FormCheckbox label={t.enrollment.selection.workFromHome} name="incomeSources" value="workFromHome" />
            </div>
        </div>
    );
};
