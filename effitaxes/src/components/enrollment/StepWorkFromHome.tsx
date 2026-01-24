import React from "react";
import { FormInput } from "./FormUI";
import { dictionary } from "@/lib/dictionary";

type Dictionary = typeof dictionary.en;

export const StepWorkFromHome = ({ t }: { t: Dictionary }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">{t.enrollment.workFromHome.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t.enrollment.workFromHome.description}</p>
            </div>

            {/* Utilities & Home Costs */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">{t.enrollment.workFromHome.utilities.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormInput label={t.enrollment.workFromHome.utilities.electricity} name="workFromHome.utilities.electricity" type="number" prefix="$" />
                    <FormInput label={t.enrollment.workFromHome.utilities.heating} name="workFromHome.utilities.heating" type="number" prefix="$" />
                    <FormInput label={t.enrollment.workFromHome.utilities.water} name="workFromHome.utilities.water" type="number" prefix="$" />
                    <FormInput label={t.enrollment.workFromHome.utilities.internet} name="workFromHome.utilities.internet" type="number" prefix="$" />
                    <FormInput label={t.enrollment.workFromHome.utilities.rent} name="workFromHome.utilities.rent" type="number" prefix="$" />
                    <FormInput label={t.enrollment.workFromHome.utilities.propertyTaxes} name="workFromHome.utilities.propertyTaxes" type="number" prefix="$" />
                    <FormInput label={t.enrollment.workFromHome.utilities.insurance} name="workFromHome.utilities.insurance" type="number" prefix="$" />
                </div>
            </div>

            {/* Maintenance & Supplies */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">{t.enrollment.workFromHome.maintenance.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={t.enrollment.workFromHome.maintenance.maintenance} name="workFromHome.maintenance.maintenance" type="number" prefix="$" />
                    <FormInput label={t.enrollment.workFromHome.maintenance.officeSupplies} name="workFromHome.maintenance.officeSupplies" type="number" prefix="$" />
                </div>
            </div>

            {/* Communication */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">{t.enrollment.workFromHome.communication.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={t.enrollment.workFromHome.communication.cellPhone} name="workFromHome.communication.cellPhone" type="number" prefix="$" />
                </div>
            </div>

        </div>
    );
};
