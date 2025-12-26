import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }).trim(),
    email: z.string().email({ message: "Adresse email invalide" }).trim().toLowerCase(),
    phone: z.string().trim().refine((val) => val === "" || /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val), {
        message: "Numéro de téléphone invalide (10 chiffres requis)"
    }),
    message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" }).trim(),
    // Honeypot field - should be empty
    _gotcha: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
