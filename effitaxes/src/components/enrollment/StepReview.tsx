import React from "react";
import { useFormContext } from "react-hook-form";
import { dictionary } from "@/lib/dictionary";

type Dictionary = typeof dictionary.en;

export const StepReview = ({ t }: { t: Dictionary }) => {
    const { getValues } = useFormContext();
    const values = getValues();

    // Helper to standard rendering of object values
    const renderValue = (val: any) => {
        if (typeof val === "boolean") return val ? "Yes" : "No";
        if (typeof val === "object" && val !== null) return JSON.stringify(val);
        return val;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-4">
                <h3 className="text-lg font-medium">{t.enrollment.steps.submit}</h3>
                <p className="text-sm text-gray-500">Please review your information before submitting.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md space-y-4 text-sm">
                <div>
                    <h4 className="font-semibold border-b mb-2">{t.enrollment.steps.personal}</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-500">Name:</span>
                        <span>{values.personal?.firstName} {values.personal?.lastName}</span>
                        <span className="text-gray-500">Email:</span>
                        <span>{values.personal?.email}</span>
                        <span className="text-gray-500">Phone:</span>
                        <span>{values.personal?.phone}</span>
                    </div>
                </div>

                {values.incomeSources?.includes("selfEmployed") && (
                    <div>
                        <h4 className="font-semibold border-b mb-2 mt-4">{t.enrollment.steps.selfEmployed}</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <span className="text-gray-500">Business:</span>
                            <span>{values.selfEmployed?.businessName}</span>
                            <span className="text-gray-500">Gross Income:</span>
                            <span>{values.selfEmployed?.grossIncome}</span>
                        </div>
                    </div>
                )}

                {/* Can be expanded to show all fields */}
            </div>

            <div className="p-4 bg-blue-50 text-blue-800 rounded-md">
                <p className="text-sm">
                    By clicking submit, you confirm that all information provided is accurate.
                </p>
            </div>
        </div>
    );
};
