import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";

// Removed cn import as we'll use template literals


interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string | React.ReactNode;
    name: string;
    labelClassName?: string;
}

export const FormLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${className || ""}`}>
        {children}
    </label>
);

export const AnnualBanner = ({ message }: { message: string }) => (
    <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-800 dark:text-blue-300 text-sm">
        <span className="text-lg leading-none mt-0.5 flex-shrink-0">📅</span>
        <p className="font-medium">{message}</p>
    </div>
);

export const FormError = ({ name }: { name: string }) => {
    const { formState: { errors } } = useFormContext();
    // lodash.get style access for nested errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = name.split('.').reduce((obj, key) => (obj as Record<string, any>)?.[key], errors) as any;

    if (!error?.message) return null;
    return <p className="text-red-500 text-xs mt-1">{error.message as string}</p>;
};

export const FormInput = ({ label, name, className, labelClassName, ...props }: FieldProps) => {
    const { register } = useFormContext();
    return (
        <div className="mb-4 flex flex-col h-full">
            <FormLabel className={labelClassName}>{label}</FormLabel>
            <input
                {...register(name)}
                {...props}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 mt-auto ${className || ""}`}
            />
            <FormError name={name} />
        </div>
    );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string | React.ReactNode;
    name: string;
    labelClassName?: string;
}

export const FormTextarea = ({ label, name, className, labelClassName, rows = 3, ...props }: TextareaProps) => {
    const { register } = useFormContext();
    return (
        <div className="mb-4 flex flex-col h-full">
            <FormLabel className={labelClassName}>{label}</FormLabel>
            <textarea
                {...register(name)}
                {...props}
                rows={rows}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 mt-auto resize-none ${className || ""}`}
            />
            <FormError name={name} />
        </div>
    );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string | React.ReactNode;
    name: string;
    options: { label: string; value: string }[];
    labelClassName?: string;
    placeholder?: string;
}

export const FormSelect = ({ label, name, options, className, labelClassName, placeholder, ...props }: SelectProps) => {
    const { register } = useFormContext();
    return (
        <div className="mb-4 flex flex-col h-full">
            <FormLabel className={labelClassName}>{label}</FormLabel>
            <select
                {...register(name)}
                {...props}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 mt-auto ${className || ""}`}
            >
                <option value="">{placeholder ?? "Select..."}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <FormError name={name} />
        </div>
    );
};

export const FormCheckbox = ({ label, name, value, ...props }: FieldProps & { value?: string }) => {
    const { register } = useFormContext();
    return (
        <div className="flex items-center mb-2">
            <input
                type="checkbox"
                value={value}
                {...register(name)}
                {...props}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {label}
            </label>
        </div>
    );
};

// Radio is useful specifically for Yes/No questions
export const FormRadioGroup = ({ label, name, options }: { label: string, name: string, options: { label: string, value: string }[] }) => {
    const { register } = useFormContext();
    return (
        <div className="mb-4">
            <FormLabel>{label}</FormLabel>
            <div className="flex space-x-4 mt-1">
                {options.map((opt) => (
                    <div key={opt.value} className="flex items-center">
                        <input
                            type="radio"
                            value={opt.value}
                            {...register(name)}
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            {opt.label}
                        </label>
                    </div>
                ))}
            </div>
            <FormError name={name} />
        </div>
    );
};

interface DateInputProps {
    label: string | React.ReactNode;
    name: string;
    labelClassName?: string;
    /** Placeholder hints shown inside each segment, e.g. ["YYYY","MM","DD"] */
    placeholders?: [string, string, string];
}

/**
 * Three-part date input (YYYY / MM / DD) that writes a YYYY-MM-DD string into RHF.
 * - Year is clamped to exactly 4 digits (prevents 19895 style entries)
 * - Month and day are auto-padded to 2 digits on blur
 * - Produces an empty string when any segment is blank
 */
export const FormDateInput = ({
    label,
    name,
    labelClassName,
    placeholders = ["YYYY", "MM", "DD"],
}: DateInputProps) => {
    const { control, getValues } = useFormContext();

    return (
        <div className="mb-4 flex flex-col h-full">
            <FormLabel className={labelClassName}>{label}</FormLabel>
            <Controller
                control={control}
                name={name}
                render={({ field }) => {
                    // Parse current value (YYYY-MM-DD or empty)
                    const parts = (field.value as string)?.split("-") ?? [];
                    const initYear  = parts[0] ?? "";
                    const initMonth = parts[1] ?? "";
                    const initDay   = parts[2] ?? "";

                    // Local state drives the three inputs
                    const [year,  setYear]  = useState(initYear);
                    const [month, setMonth] = useState(initMonth);
                    const [day,   setDay]   = useState(initDay);

                    // Sync back to RHF whenever any segment changes
                    useEffect(() => {
                        const combined =
                            year.length === 4 && month.length === 2 && day.length === 2
                                ? `${year}-${month}-${day}`
                                : "";
                        field.onChange(combined);
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [year, month, day]);

                    // Seed from form default value on mount only
                    useEffect(() => {
                        const v = getValues(name) as string;
                        if (v && v.includes("-")) {
                            const [y, m, d] = v.split("-");
                            setYear(y ?? "");
                            setMonth(m ?? "");
                            setDay(d ?? "");
                        }
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, []);

                    const segmentClass =
                        "border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 text-center py-2 text-sm";

                    return (
                        <div className="flex gap-1.5 mt-auto">
                            {/* Year — 4 digits max */}
                            <input
                                type="number"
                                inputMode="numeric"
                                placeholder={placeholders[0]}
                                value={year}
                                min={1900}
                                max={9999}
                                onInput={(e) => {
                                    // Hard-clamp to 4 characters before React state update
                                    const el = e.currentTarget;
                                    if (el.value.length > 4) el.value = el.value.slice(0, 4);
                                }}
                                onChange={(e) => {
                                    const v = e.target.value.slice(0, 4);
                                    setYear(v);
                                }}
                                onBlur={() => {
                                    // Pad to 4 only if user typed something but not enough digits
                                    if (year && year.length < 4) setYear(year.padStart(4, "0"));
                                }}
                                className={`${segmentClass} w-20`}
                                aria-label="Year"
                            />
                            <span className="self-center text-gray-400 text-sm select-none">/</span>
                            {/* Month — 2 digits, 01-12 */}
                            <input
                                type="number"
                                inputMode="numeric"
                                placeholder={placeholders[1]}
                                value={month}
                                min={1}
                                max={12}
                                onChange={(e) => {
                                    let v = e.target.value;
                                    if (parseInt(v) > 12) v = "12";
                                    if (v.length > 2) v = v.slice(0, 2);
                                    setMonth(v);
                                }}
                                onBlur={() => {
                                    if (month && month.length === 1) setMonth(month.padStart(2, "0"));
                                }}
                                className={`${segmentClass} w-14`}
                                aria-label="Month"
                            />
                            <span className="self-center text-gray-400 text-sm select-none">/</span>
                            {/* Day — 2 digits, 01-31 */}
                            <input
                                type="number"
                                inputMode="numeric"
                                placeholder={placeholders[2]}
                                value={day}
                                min={1}
                                max={31}
                                onChange={(e) => {
                                    let v = e.target.value;
                                    if (parseInt(v) > 31) v = "31";
                                    if (v.length > 2) v = v.slice(0, 2);
                                    setDay(v);
                                }}
                                onBlur={() => {
                                    if (day && day.length === 1) setDay(day.padStart(2, "0"));
                                }}
                                className={`${segmentClass} w-14`}
                                aria-label="Day"
                            />
                        </div>
                    );
                }}
            />
            <FormError name={name} />
        </div>
    );
};
