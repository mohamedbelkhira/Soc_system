import { z } from "zod";
import { 
  createExpenseSchema, 
  updateExpenseSchema, 
  deleteExpenseSchema 
} from "@/schemas/expense.schema";

// Type Inference from Zod Schemas
export type CreateExpenseDTO = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDTO = z.infer<typeof updateExpenseSchema>;
export type DeleteExpenseDTO = z.infer<typeof deleteExpenseSchema>;

// Expense Status Enum
export enum ExpenseStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELED = "CANCELED",
}
import { ExpenseCategory } from "@/types/expenseCategory.dto";
// Expense Interface
export interface Expense {
  id: string;
  categoryId: string;
  locationId?: string | null;
  description?: string | null;
  status: ExpenseStatus;
  paidAt?: string | null;
  dueAt?: string | null;
  amount: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  category: ExpenseCategory;
}