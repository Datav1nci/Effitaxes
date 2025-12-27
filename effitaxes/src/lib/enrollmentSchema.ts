import { z } from "zod";
import { dictionary } from "./dictionary";

type T = typeof dictionary.en;

export const createEnrollmentSchema = (t: T) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    const personalSchema = z.object({
        firstName: z.string().min(1, t.enrollment.errors.required),
        lastName: z.string().min(1, t.enrollment.errors.required),
        address: z.string().min(1, t.enrollment.errors.required),
        phone: z.string().regex(phoneRegex, t.contact.form.phonePlaceholder),
        dob: z.string().min(1, t.enrollment.errors.required),
        email: z.string().email(t.enrollment.errors.invalidEmail),
        maritalStatus: z.enum(["single", "married", "commonLaw", "separated", "divorced", "widowed"], {
            message: t.enrollment.errors.required,
        }),
        maritalChangeDate: z.string().optional(),
        province: z.string().min(1, t.enrollment.errors.required),
        ownerTenant: z.enum(["owner", "tenant"], {
            message: t.enrollment.errors.required,
        }),
        soldBuyHouse: z.boolean().default(false),
        soldBuyHouseStr: z.enum(["yes", "no"]),

        incomeSource: z.string().min(1, t.enrollment.errors.required),
        privateDrugInsurance: z.enum(["yes", "no"]),
        insuranceMonths: z.string().optional(),
        workedRemotely: z.enum(["yes", "no"]),
        additionalInfo: z.string().optional(),
    }).refine(data => {
        return true;
    });

    const selfEmployedSchema = z.object({
        businessName: z.string().min(1, t.enrollment.errors.required),
        businessPhone: z.string().optional(),
        creationDate: z.string().optional(),
        isActive: z.enum(["yes", "no"]),
        productType: z.string().min(1, t.enrollment.errors.required),
        grossIncome: z.coerce.number().min(0, t.enrollment.errors.positive),
        expenses: z.object({
            advertising: z.coerce.number().optional(),
            insurance: z.coerce.number().optional(),
            interest: z.coerce.number().optional(),
            taxesLicenses: z.coerce.number().optional(),
            officeExpenses: z.coerce.number().optional(),
            professionalFees: z.coerce.number().optional(),
            managementFees: z.coerce.number().optional(),
            rent: z.coerce.number().optional(),
            repairs: z.coerce.number().optional(),
            salaries: z.coerce.number().optional(),
            travel: z.coerce.number().optional(),
            delivery: z.coerce.number().optional(),
            other: z.coerce.number().optional(),
            otherDescription: z.string().optional(),
        }),
        homeOffice: z.object({
            totalArea: z.coerce.number().optional(),
            businessArea: z.coerce.number().optional(),
            electricity: z.coerce.number().optional(),
            heating: z.coerce.number().optional(),
            insurance: z.coerce.number().optional(),
            maintenance: z.coerce.number().optional(),
            mortgageInterest: z.coerce.number().optional(),
            propertyTaxes: z.coerce.number().optional(),
            other: z.coerce.number().optional(),
        }),
    });

    // ... (keeping carSchema and rentalSchema separate for clarity in diff if needed, but I must match exact target content)
    // I will just replace the top part and end part separately or ensure the middle matches.
    // The tool works best with contiguous blocks.
    // I will replace the first block (Main Schema) and the Export type.
    // BUT the schemas are nested variables.

    // I'll do 2 chunks.
    // Chunk 1: personalSchema definition
    // Chunk 2: export type

    // actually, simply replacing lines 16-36 is sufficient for the first part.
    // And 169 for the second.


    const carSchema = z.object({
        makeModel: z.string().min(1, t.enrollment.errors.required),
        businessKm: z.coerce.number().min(0),
        totalKm: z.coerce.number().min(0),
        gas: z.coerce.number().optional(),
        insurance: z.coerce.number().optional(),
        license: z.coerce.number().optional(),
        maintenance: z.coerce.number().optional(),
        purchaseLeaseDate: z.string().optional(),
        leaseEndDate: z.string().optional(),
        leasePayments: z.coerce.number().optional(),
        notes: z.string().optional(),
    });

    const rentalSchema = z.object({
        address: z.string().min(1, t.enrollment.errors.required),
        grossIncome: z.coerce.number().min(0, t.enrollment.errors.required),
        ownershipPercentage: z.coerce.number().min(0).max(100),
        expenses: z.object({
            advertising: z.coerce.number().optional(),
            insurance: z.coerce.number().optional(),
            interest: z.coerce.number().optional(),
            taxes: z.coerce.number().optional(),
            maintenance: z.coerce.number().optional(),
            utilities: z.coerce.number().optional(),
            managementFees: z.coerce.number().optional(),
            other: z.coerce.number().optional(),
        }),
    });

    // Base Schema linking everything
    return z.object({
        personal: personalSchema,
        incomeSources: z.array(z.string()).default([]), // ["employee", "selfEmployed", ...]

        // Detailed sections are optional but will be validated via refinements if selected
        selfEmployed: selfEmployedSchema.optional(), // We'll make it optional here so it doesn't block the initial steps
        car: carSchema.optional(),
        rental: rentalSchema.optional(),
    }).superRefine((data, ctx) => {
        // Conditional Validation Logic

        // 1. If Self-Employed selected, validate selfEmployed section
        if (data.incomeSources.includes("selfEmployed")) {
            if (!data.selfEmployed) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t.enrollment.errors.required, // "Required"
                    path: ["selfEmployed"]
                });
            } else {
                // Re-run the safe parse on the sub-schema to add issues to context?
                // Or just trust the types? Zod superRefine doesn't automatically recurse if defined as optional.
                // When we define `selfEmployed: selfEmployedSchema.optional()`, Zod validates it IF it exists.
                // If it exists (is not undefined), it runs `selfEmployedSchema`.
                // So we mostly need to check if it's MISSING when it SHOULD be there.
                // But wait, if the user picks "Self Employed", our Form UI should initialize the object.
                // If it's initialized, Zod validates it.
                // So checking `!data.selfEmployed` is enough to catch "Not started" steps.
                // But we must mostly ensure the UI initializes it or we force it here.
            }
        }

        if (data.incomeSources.includes("carExpenses")) {
            if (!data.car) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t.enrollment.errors.required,
                    path: ["car"]
                });
            }
        }

        if (data.incomeSources.includes("rental")) {
            if (!data.rental) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t.enrollment.errors.required,
                    path: ["rental"]
                });
            }
        }
    });
};

export type EnrollmentFormData = z.input<ReturnType<typeof createEnrollmentSchema>>;
