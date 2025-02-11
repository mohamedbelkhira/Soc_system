import { z } from "zod";
import { Employee } from "./employee.dto";
import { Agency } from "./agency.dto";

export enum DeliveryHandlerType {
  AGENCY = "AGENCY",
  EMPLOYEE = "EMPLOYEE",
}

export const createDeliveryHandlerSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("EMPLOYEE"),
    employeeId: z
      .string()
      .min(1, { message: "Veuillez sélectionner un employé" }),
    deliveryCost: z.coerce
      .number()
      .min(0, { message: "Le coût de livraison doit être positif" }),
    returnCost: z.coerce
      .number()
      .min(0, { message: "Le coût de retour doit être positif" }),
    isActive: z.boolean(),
  }),
  z.object({
    type: z.literal("AGENCY"),
    agencyName: z.string().min(1, { message: "Le nom de l'agence est requis" }),
    agencyPhoneNumber: z.string().optional(),
    agencyAddress: z.string().min(1, { message: "L'adresse est requise" }),
    deliveryCost: z.coerce
      .number()
      .min(0, { message: "Le coût de livraison doit être positif" }),
    returnCost: z.coerce
      .number()
      .min(0, { message: "Le coût de retour doit être positif" }),
    isActive: z.boolean(),
  }),
]);

export const updateDeliveryHandlerSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("EMPLOYEE"),
    id: z.string().uuid("ID du Delivery Handler non valide"),
    employeeId: z.string().uuid("ID d'employé non valide").optional(),
    deliveryCost: z.coerce
      .number()
      .min(0, { message: "Le coût de livraison doit être positif" }),
    returnCost: z.coerce
      .number()
      .min(0, { message: "Le coût de retour doit être positif" }),
    isActive: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("AGENCY"),
    id: z.string().uuid("ID du Delivery Handler non valide"),
    agencyId: z.string().uuid("ID d'agence non valide"), // Now required
    agencyName: z
      .string()
      .min(1, { message: "Le nom de l'agence est requis" })
      .optional(),
    agencyPhoneNumber: z
      .string().optional(),
    agencyAddress: z
      .string()
      .min(1, { message: "L'adresse est requise" })
      .optional(),
    deliveryCost: z.coerce
      .number()
      .min(0, { message: "Le coût de livraison doit être positif" }),
    returnCost: z.coerce
      .number()
      .min(0, { message: "Le coût de retour doit être positif" }),
    isActive: z.boolean().optional(),
  }),
]);

export type UpdateDeliveryHandlerDTO = z.infer<
  typeof updateDeliveryHandlerSchema
>;

export type CreateDeliveryHandlerDTO = z.infer<
  typeof createDeliveryHandlerSchema
>;
export type CreateDeliveryHandlerEMPLOYEE = Extract<
  CreateDeliveryHandlerDTO,
  { type: "EMPLOYEE" }
>;
export type CreateDeliveryHandlerAGENCY = Extract<
  CreateDeliveryHandlerDTO,
  { type: "AGENCY" }
>;

export interface DeliveryHandler {
  id: string;
  type: "EMPLOYEE" | "AGENCY";
  employeeId?: string;
  agencyId?: string;
  deliveryCost: number;
  returnCost: number;
  isActive: boolean;
  employee?: Employee;
  agency?: Agency;
  // Add other fields if necessary
}

export type CreateDeliveryHandlerAPIPayload =
  | {
      type: "EMPLOYEE";
      employeeId: string;
      deliveryCost: number;
      returnCost: number;
      isActive: boolean;
    }
  | {
      type: "AGENCY";
      agencyId: string;
      deliveryCost: number;
      returnCost: number;
      isActive: boolean;
    };

export type UpdateDeliveryHandlerAPIPayload =
  | {
      type: "EMPLOYEE";
      id: string;
      employeeId?: string;
      deliveryCost?: number;
      returnCost?: number;
      isActive?: boolean;
    }
  | {
      type: "AGENCY";
      id: string;
      agencyId: string; // Made required
      deliveryCost?: number;
      returnCost?: number;
      isActive?: boolean;
    };
