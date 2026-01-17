import { z } from 'zod';

export const createTagSchema = z.object({
    name: z
        .string()
        .min(1, 'Le nom est requis')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    color: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Couleur invalide (format: #RRGGBB)')
        .optional(),
});

export const updateTagSchema = z.object({
    name: z
        .string()
        .min(1, 'Le nom est requis')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères')
        .optional(),
    color: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Couleur invalide (format: #RRGGBB)')
        .optional(),
});

export type CreateTagFormValues = z.infer<typeof createTagSchema>;
export type UpdateTagFormValues = z.infer<typeof updateTagSchema>;
