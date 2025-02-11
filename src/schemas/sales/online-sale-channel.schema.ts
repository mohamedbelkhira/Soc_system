import z from "zod";

export const createOnlineSaleChannelSchema = z.object({
  name: z.string(),
  description: z.string(),
  isActive: z.boolean().default(true),
});

export const updateOnlineSaleChannelSchema = z.object({
  id: z.string().uuid("ID de canal de vente en ligne non valide"),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean().default(true),
});

export const deleteOnlineSaleChannelSchema = z.object({
  id: z.string().uuid("ID de canal de vente en ligne non valide"),
});

export const findOnlineSaleChannelByIdSchema = z.object({
  id: z.string().uuid("ID de canal de vente en ligne non valide"),
});
