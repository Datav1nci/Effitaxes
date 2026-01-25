"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEnrollmentSchema, EnrollmentFormData } from "@/lib/enrollmentSchema";
import { useLanguage } from "@/context/LanguageContext";
import { Dictionary } from "@/lib/dictionary";
import { submitEnrollment } from "@/actions/submitEnrollment";
import { StepPersonal } from "./StepPersonal";
import { StepIncomeSelection } from "./StepIncomeSelection";
import { StepSelfEmployed } from "./StepSelfEmployed";
import { StepCarExpenses } from "./StepCarExpenses";
import { StepRental } from "./StepRental";
import { StepWorkFromHome } from "./StepWorkFromHome";
import { StepReview } from "./StepReview";

import { User } from "@supabase/supabase-js";

type StepProps = {
    t: Dictionary;
    highlightConfirmation?: boolean;
};

interface EnrollmentWizardProps {
    user?: User;
    profile?: any;
}

export default function EnrollmentWizard({ user, profile }: EnrollmentWizardProps) {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);

    // Dynamic Schema based on language
    const schema = useMemo(() => createEnrollmentSchema(t), [t]);

    const methods = useForm<EnrollmentFormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            incomeSources: [],
            personal: {
                firstName: profile?.first_name || "",
                lastName: profile?.last_name || "",
                email: user?.email || "",
                phone: profile?.phone || "",
                // other fields default to empty/undefined
            }
        },
    });

    const { watch, trigger, handleSubmit, reset } = methods;

    const watchedIncomeSources = watch("incomeSources");
    const incomeSources = useMemo(() => watchedIncomeSources || [], [watchedIncomeSources]);

    // Persistence Logic
    useEffect(() => {
        // Load saved data on mount
        const savedData = localStorage.getItem("enrollment_draft");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                reset({
                    ...parsedData,
                    // Ensure incomeSources is an array even if saved as null
                    incomeSources: parsedData.incomeSources || []
                });
            } catch (e) {
                console.error("Failed to parse saved enrollment form data", e);
            }
        }
    }, [reset]);

    useEffect(() => {
        // Save data on change
        const subscription = watch((value) => {
            localStorage.setItem("enrollment_draft", JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

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

        if (incomeSources.includes("carExpenses") || incomeSources.includes("studentCarExpenses") || incomeSources.includes("selfEmployedCarExpenses") || incomeSources.includes("employeeCarExpenses")) {
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

        if (incomeSources.includes("workFromHome")) {
            baseSteps.push({
                id: "workFromHome",
                title: t.enrollment.workFromHome.title,
                component: StepWorkFromHome,
                fields: ["workFromHome"]
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

    // Cast to React.FC<StepProps> to allow optional highlightConfirmation prop
    const CurrentComponent = steps[currentStep]?.component as React.FC<StepProps>;

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

    const [highlightConfirmation, setHighlightConfirmation] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const confirmed = watch("confirmed");

    const onSubmit: SubmitHandler<EnrollmentFormData> = async (data) => {
        const result = await submitEnrollment(data);

        if (result.success) {
            localStorage.removeItem("enrollment_draft");
            setIsSubmitted(true);
            window.scrollTo(0, 0);
        } else {
            console.error(result.error);
            // In a real app we'd set a general error state here
        }
    };

    const handleFakeSubmit = () => {
        if (!confirmed) {
            setHighlightConfirmation(true);
            setTimeout(() => setHighlightConfirmation(false), 500);
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-3xl mx-auto py-20 px-4 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-green-100 text-green-600 p-6 rounded-full inline-block mb-6">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.contact.form.successMessage}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    We have received your information and will be in touch shortly.
                </p>
            </div>
        );
    }

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

                    <CurrentComponent t={t} highlightConfirmation={highlightConfirmation} />

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
                            confirmed ? (
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                >
                                    {t.enrollment.buttons.submit}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleFakeSubmit}
                                    className="px-4 py-2 text-sm font-medium text-white bg-gray-400 border border-transparent rounded-md shadow-sm cursor-not-allowed focus:outline-none transition-colors duration-200"
                                >
                                    {t.enrollment.buttons.submit}
                                </button>
                            )
                        )}
                    </div>
                </form>
            </div>
        </FormProvider>
    );
}
