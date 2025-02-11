// src/types/job.dto.ts
import { createJobSchema, updateJobSchema, deleteJobSchema } from "../schemas/job.schema";
import z from "zod";
export interface Job {
    id: string;
    name: string;
    description: string;
    employees: { id: string; userId: string; jobId: string }[];
    createdAt: string;
    updatedAt: string;
  }
  
export type CreateJobDTO = z.infer<typeof createJobSchema>;
export type UpdateJobDTO = z.infer<typeof updateJobSchema>;
export type DeleteJobDTO = z.infer<typeof deleteJobSchema>;
