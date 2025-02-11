import { z } from 'zod';

export const createAgencySchema = z.object({
  name: z.string().min(2, 'Agency name must be at least 2 characters long'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Invalid phone number format').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
});

export const updateAgencySchema = z.object({
  id: z.string().uuid('Invalid agency ID'),
  name: z.string().min(2, 'Agency name must be at least 2 characters long').optional(),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Invalid phone number format').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters long').optional(),

});

export const deleteAgencySchema = z.object({
  id: z.string().uuid('Invalid agency ID'),
});

export type CreateAgencyDTO = z.infer<typeof createAgencySchema>;
export type UpdateAgencyDTO = z.infer<typeof updateAgencySchema>;
export type DeleteAgencyDTO = z.infer<typeof deleteAgencySchema>;

export interface Agency {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  // Add other fields if necessary
}