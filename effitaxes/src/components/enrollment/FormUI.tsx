import React from "react";
import { useFormContext } from "react-hook-form";

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

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string | React.ReactNode;
    name: string;
    options: { label: string; value: string }[];
    labelClassName?: string;
}

export const FormSelect = ({ label, name, options, className, labelClassName, ...props }: SelectProps) => {
    const { register } = useFormContext();
    return (
        <div className="mb-4 flex flex-col h-full">
            <FormLabel className={labelClassName}>{label}</FormLabel>
            <select
                {...register(name)}
                {...props}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 mt-auto ${className || ""}`}
            >
                <option value="">Select...</option>
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
