import React from "react";
import { FormInput, FormSelect } from "./FormUI";
import { dictionary } from "@/lib/dictionary";
import { useFieldArray, useFormContext } from "react-hook-form";
import { EnrollmentFormData } from "@/lib/enrollmentSchema";

type Dictionary = typeof dictionary.en;

export const StepRental = ({ t }: { t: Dictionary }) => {
    const { control, watch } = useFormContext<EnrollmentFormData>();

    // Ensure rental object exists
    const rentalProperties = watch("rental.properties");

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rental.properties"
    });

    // If there are no properties, add one by default
    React.useEffect(() => {
        if (!rentalProperties || rentalProperties.length === 0) {
            append({
                propertyType: "apartment",
                address: "",
                grossIncome: 0,
                ownershipPercentage: 100,
                expenses: {}
            });
        }
    }, [rentalProperties, append]);

    const propertyTypeOptions = [
        { value: "apartment", label: t.enrollment.rental.propertyTypeOptions.apartment },
        { value: "duplex", label: t.enrollment.rental.propertyTypeOptions.duplex },
        { value: "triplex", label: t.enrollment.rental.propertyTypeOptions.triplex },
        { value: "house", label: t.enrollment.rental.propertyTypeOptions.house },
        { value: "other", label: t.enrollment.rental.propertyTypeOptions.other },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-4">
                <h3 className="text-lg font-medium">{t.enrollment.rental.title}</h3>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-6 relative">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                            {t.enrollment.rental.propertyLabel} {index + 1}
                        </h4>
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                                {t.enrollment.rental.removeProperty}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormSelect
                            label={t.enrollment.rental.propertyType}
                            name={`rental.properties.${index}.propertyType`}
                            options={propertyTypeOptions}
                        />
                        <FormInput
                            label={t.enrollment.rental.address}
                            name={`rental.properties.${index}.address`}
                            placeholder="123 Rental St, Apt 4"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label={t.enrollment.rental.grossIncome}
                            name={`rental.properties.${index}.grossIncome`}
                            type="number"
                            prefix="$"
                        />
                        <FormInput
                            label={t.enrollment.rental.ownershipPercentage}
                            name={`rental.properties.${index}.ownershipPercentage`}
                            type="number"
                            placeholder="100"
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <h4 className="text-md font-semibold">{t.enrollment.rental.expenses.other || "Expenses"}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormInput label={t.enrollment.rental.expenses.advertising} name={`rental.properties.${index}.expenses.advertising`} type="number" />
                            <FormInput label={t.enrollment.rental.expenses.insurance} name={`rental.properties.${index}.expenses.insurance`} type="number" />
                            <FormInput label={t.enrollment.rental.expenses.interest} name={`rental.properties.${index}.expenses.interest`} type="number" />
                            <FormInput label={t.enrollment.rental.expenses.taxes} name={`rental.properties.${index}.expenses.taxes`} type="number" />
                            <FormInput label={t.enrollment.rental.expenses.maintenance} name={`rental.properties.${index}.expenses.maintenance`} type="number" />
                            <FormInput label={t.enrollment.rental.expenses.utilities} name={`rental.properties.${index}.expenses.utilities`} type="number" />
                            <FormInput label={t.enrollment.rental.expenses.managementFees} name={`rental.properties.${index}.expenses.managementFees`} type="number" />
                            <FormInput label={t.enrollment.rental.expenses.other} name={`rental.properties.${index}.expenses.other`} type="number" />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                className="w-full py-2 px-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
                onClick={() => append({ propertyType: "apartment", address: "", grossIncome: 0, ownershipPercentage: 100, expenses: {} })}
            >
                + {t.enrollment.rental.addProperty}
            </button>
        </div>
    );
};
