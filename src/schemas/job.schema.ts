import { z } from "zod";

export const createJobSchema = z.object({
  name: z.string().min(2, "Le nom du poste doit comporter au moins 2 caractères"),
  description: z.string().optional(),
});

export const updateJobSchema = z.object({
  id: z.string().uuid("ID de poste non valide"),
  name: z.string().min(2, "Le nom du poste doit comporter au moins 2 caractères").optional(),
  description: z.string().optional(),
});

export const deleteJobSchema = z.object({
  id: z.string().uuid("ID de poste non valide"),
});
