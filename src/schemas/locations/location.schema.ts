import { z } from "zod";
import { LocationType } from "@/types/locations/location.dto";
export const LocationTypeEnum = z.nativeEnum(LocationType);

export const createLocationSchema = z.object({
  name: z.string().min(1, "Le nom de l'emplacement est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  type: LocationTypeEnum,
  isActive: z.boolean().optional().default(true),
});

export const updateLocationSchema = z.object({
  id: z.string().uuid("ID de l'emplacement non valide"),
  name: z.string().min(1, "Le nom de l'emplacement est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  type: LocationTypeEnum,
  isActive: z.boolean().optional(),
});

export const deleteLocationSchema = z.object({
  id: z.string().uuid("ID de l'emplacement non valide"),
});

export const findLocationByIdSchema = z.object({
  id: z.string().uuid("ID de l'emplacement non valide"),
});
