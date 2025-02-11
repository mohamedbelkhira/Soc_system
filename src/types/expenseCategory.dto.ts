// src/types/expenseCategory.dto.ts

import { z } from "zod";
import { createExpenseCategorySchema, updateExpenseCategorySchema, deleteExpenseCategorySchema } from "@/schemas/expenseCategory.schema";
// Type Inference
export type CreateExpenseCategoryDTO = z.infer<typeof createExpenseCategorySchema>;
export type UpdateExpenseCategoryDTO = z.infer<typeof updateExpenseCategorySchema>;
export type DeleteExpenseCategoryDTO = z.infer<typeof deleteExpenseCategorySchema>;

export enum ExpenseCategoryType {
    LOCAL = "LOCAL",
    GLOBAL = "GLOBAL",
  }
// ExpenseCategory Interface
export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string | null;
  type: ExpenseCategoryType;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}
