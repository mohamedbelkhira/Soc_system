import {
  createLocationSchema,
  deleteLocationSchema,
  findLocationByIdSchema,
  updateLocationSchema,
} from "@/schemas/locations/location.schema";
import z from "zod";

export enum LocationType {
  STORE = "STORE",
  WAREHOUSE = "WAREHOUSE",
}

export type Location = {
  id: string;
  name: string;
  address: string;
  type: LocationType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateLocationDTO = z.infer<typeof createLocationSchema>;
export type UpdateLocationDTO = z.infer<typeof updateLocationSchema>;
export type DeleteLocationDTO = z.infer<typeof deleteLocationSchema>;
export type FindLocationByIdDTO = z.infer<typeof findLocationByIdSchema>;
