
import { z } from "zod";
import { dictionary } from "./dictionary";

type T = typeof dictionary.en;

export const createMemberSchema = (t: T) => {
    return z.object({
        firstName: z.string().min(1, t.enrollment.errors.required),
        lastName: z.string().min(1, t.enrollment.errors.required),
        relationship: z.enum(["SPOUSE", "PARTNER", "CHILD", "DEPENDANT", "OTHER"], {
            message: t.enrollment.errors.required,
        }),
        dateOfBirth: z.string().optional(),
        livesWithPrimary: z.boolean().default(true),
        isDependent: z.boolean().default(false),
        // Additional fields for dependants could be added here or in a separate object
        dependencyDetails: z.object({
            disability: z.boolean().optional(),
            financialDependency: z.boolean().optional(),
            notes: z.string().optional(),
        }).optional(),
    });
};

export type MemberFormData = z.infer<ReturnType<typeof createMemberSchema>>;
