import {
  deleteClientSchema,
  findClientByIdSchema,
  findClientByPhoneSchema,
  updateClientSchema,
} from "@/schemas/clients/client.schema";
import { z } from "zod";

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface CreateClientDTO {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
  address: string | null;
}

export type UpdateClientDTO = z.infer<typeof updateClientSchema>;
export type DeleteClientDTO = z.infer<typeof deleteClientSchema>;
export type FindClientByIdDTO = z.infer<typeof findClientByIdSchema>;
export type FindClientByPhoneDTO = z.infer<typeof findClientByPhoneSchema>;
