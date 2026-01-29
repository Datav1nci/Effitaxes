import { z } from "zod";
import { dictionary } from "./dictionary";

type T = typeof dictionary.en;

export const createSchemas = (t: T) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    const personalSchema = z.object({
        firstName: z.string().min(1, t.enrollment.errors.required),
        lastName: z.string().min(1, t.enrollment.errors.required),
        addressNumber: z.string().min(1, t.enrollment.errors.required),
        addressName: z.string().min(1, t.enrollment.errors.required),
        addressCity: z.string().min(1, t.enrollment.errors.required),
        addressApp: z.string().optional(),
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
        additionalInfo: z.string().optional(),
    });

    const selfEmployedSchema = z.object({
        businessName: z.string().min(1, t.enrollment.errors.required),
        businessPhone: z.string().optional(),
        gstHstNumber: z.string().optional(),
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
        }).optional(),
    });

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

    const workFromHomeSchema = z.object({
        method: z.enum(["detailed", "flatRate"]).optional(),
        utilities: z.object({
            electricity: z.coerce.number().optional(),
            heating: z.coerce.number().optional(),
            water: z.coerce.number().optional(),
            internet: z.coerce.number().optional(),
            rent: z.coerce.number().optional(),
            propertyTaxes: z.coerce.number().optional(),
            insurance: z.coerce.number().optional(),
        }),
        maintenance: z.object({
            maintenance: z.coerce.number().optional(),
            officeSupplies: z.coerce.number().optional(),
        }),
        communication: z.object({
            cellPhone: z.coerce.number().optional(),
        }),
    });

    const incomeSourcesSchema = z.object({
        incomeSources: z.array(z.string()).default([]),
    });

    return {
        personal: personalSchema,
        selfEmployed: selfEmployedSchema,
        car: carSchema,
        rental: rentalSchema,
        workFromHome: workFromHomeSchema,
        incomeSources: incomeSourcesSchema,
    };
};

export const createEnrollmentSchema = (t: T) => {
    const schemas = createSchemas(t);

    // Base Schema linking everything
    const baseSchema = z.object({
        personal: schemas.personal,
        incomeSources: schemas.incomeSources.shape.incomeSources, // Access shape to get the array schema directly

        // Detailed sections are optional but will be validated via refinements if selected
        selfEmployed: schemas.selfEmployed.optional(),
        car: schemas.car.optional(),
        rental: schemas.rental.optional(),
        workFromHome: schemas.workFromHome.optional(),
        confirmed: z.boolean().default(false),
    });

    return baseSchema.superRefine((data, ctx) => {
        // Conditional Validation Logic

        // 1. If Self-Employed selected, validate selfEmployed section
        if (data.incomeSources.includes("selfEmployed")) {
            if (!data.selfEmployed) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t.enrollment.errors.required, // "Required"
                    path: ["selfEmployed"]
                });
            }
        }

        if (data.incomeSources.includes("carExpenses") || data.incomeSources.includes("studentCarExpenses") || data.incomeSources.includes("selfEmployedCarExpenses") || data.incomeSources.includes("employeeCarExpenses")) {
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

        if (data.incomeSources.includes("workFromHome")) {
            if (!data.workFromHome) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t.enrollment.errors.required,
                    path: ["workFromHome"]
                });
            }
        }
    });
};

export const createDashboardSchema = (t: T) => {
    // Re-use logic or duplicate lightly to avoid complexity?
    // The previous function scoped all sub-schemas locally.
    // I should refactor to expose the base object or just duplicate the object definition for safety/speed.
    // Since I cannot easily extract the sub-schemas without major refactor (they are consts inside `createEnrollmentSchema`),
    // I will use a trick: `createEnrollmentSchema` returns a ZodEffect (superRefine).
    // I can't easily unwrap it.
    // I will refactor the structure slightly to return both or allow a flag.
    return createEnrollmentSchema(t);
};

// I need to change signature of createEnrollmentSchema to accept a flag


export type EnrollmentFormData = z.infer<ReturnType<typeof createEnrollmentSchema>>;
