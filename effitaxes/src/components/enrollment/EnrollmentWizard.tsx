"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEnrollmentSchema, EnrollmentFormData } from "@/lib/enrollmentSchema";
import { useLanguage } from "@/context/LanguageContext";
import { submitEnrollment } from "@/actions/submitEnrollment";
import { StepPersonal } from "./StepPersonal";
import { StepIncomeSelection } from "./StepIncomeSelection";
import { StepSelfEmployed } from "./StepSelfEmployed";
import { StepCarExpenses } from "./StepCarExpenses";
import { StepRental } from "./StepRental";
import { StepReview } from "./StepReview";

export default function EnrollmentWizard() {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);

    // Dynamic Schema based on language
    const schema = useMemo(() => createEnrollmentSchema(t), [t]);

    const methods = useForm<EnrollmentFormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            incomeSources: [],
            // Initialize objects to avoid undefined issues if we want to be safe, 
            // but strictly optional fields should be fine.
        },
    });

    const { watch, trigger, handleSubmit } = methods;

    const watchedIncomeSources = watch("incomeSources");
    const incomeSources = useMemo(() => watchedIncomeSources || [], [watchedIncomeSources]);

    // Dynamic Steps Definition
    const steps = useMemo(() => {
        const baseSteps = [
            { id: "personal", title: t.enrollment.steps.personal, component: StepPersonal, fields: ["personal"] },
            { id: "selection", title: t.enrollment.steps.selection, component: StepIncomeSelection, fields: ["incomeSources"] },
        ];

        if (incomeSources.includes("selfEmployed")) {
            baseSteps.push({
                id: "selfEmployed",
                title: t.enrollment.steps.selfEmployed,
                component: StepSelfEmployed,
                fields: ["selfEmployed"]
            });
        }

        if (incomeSources.includes("carExpenses")) {
            baseSteps.push({
                id: "car",
                title: t.enrollment.steps.car,
                component: StepCarExpenses,
                fields: ["car"]
            });
        }

        if (incomeSources.includes("rental")) {
            baseSteps.push({
                id: "rental",
                title: t.enrollment.steps.rental,
                component: StepRental,
                fields: ["rental"]
            });
        }

        baseSteps.push({
            id: "submit",
            title: t.enrollment.steps.submit,
            component: StepReview,
            fields: [] // No validation for review step itself
        });

        return baseSteps;
    }, [incomeSources, t]);

    // Adjust Current Step if steps change (e.g. unselecting a step we were ahead of)
    useEffect(() => {
        if (currentStep >= steps.length) {
            setCurrentStep(steps.length - 1);
        }
    }, [steps.length, currentStep]);

    const CurrentComponent = steps[currentStep]?.component;

    const handleNext = async () => {
        const stepFields = steps[currentStep].fields;

        // Validate current step fields
        if (stepFields.length > 0) {
            // @ts-expect-error - trigger accepts array of field names/paths
            const isValid = await trigger(stepFields);
            if (!isValid) return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const onSubmit: SubmitHandler<EnrollmentFormData> = async (data) => {
        alert(t.contact.form.sending);

        const result = await submitEnrollment(data);

        if (result.success) {
            alert(t.contact.form.successMessage);
            // Optionally reset form or redirect
        } else {
            alert("Error sending form. Please try again.");
            console.error(result.error);
        }
    };

    if (!CurrentComponent) return null;

    return (
        <FormProvider {...methods}>
            <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

                {/* Progress Bar */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-4">{t.enrollment.title}</h1>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <span>{t.enrollment.steps.personal}</span>
                        <span>/</span>
                        <span className={currentStep === steps.length - 1 ? "font-bold text-primary" : ""}>
                            {steps[currentStep].title}
                        </span>
                        <span>({currentStep + 1} of {steps.length})</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Dynamic Step Content */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">

                    <CurrentComponent t={t} />

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between pt-4 border-t">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t.enrollment.buttons.prev}
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {t.enrollment.buttons.next}
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                {t.enrollment.buttons.submit}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </FormProvider>
    );
}
