// src/swr/expenseCategory.swr.ts

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { expenseCategoriesApi } from '@/api/expenseCategories.api';
import { 
  ExpenseCategory, 
  CreateExpenseCategoryDTO, 
  UpdateExpenseCategoryDTO 
} from '@/types/expenseCategory.dto';

// Fetcher function for SWR
const fetcher = async () => {
  const response = await expenseCategoriesApi.getAll();
  if (response.status === "success") {
    return response.data;
  } else {
    throw new Error(response.message || "Failed to fetch expense categories.");
  }
};

// Hook for fetching all expense categories
export const useExpenseCategories = () => {
  return useSWR<ExpenseCategory[]>('/expenses-categories', fetcher);
};

// Hook for creating an expense category
export const useCreateExpenseCategory = () => {
  return useSWRMutation(
    '/expenses-categories',
    async (_, { arg }: { arg: CreateExpenseCategoryDTO }) => {
      const response = await expenseCategoriesApi.create(arg);
      if (response.status === "success") {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create expense category.");
      }
    }
  );
};

// Hook for updating an expense category
export const useUpdateExpenseCategory = (id: string) => {
  return useSWRMutation(
    `/expenses-categories/${id}`,
    async (_, { arg }: { arg: UpdateExpenseCategoryDTO }) => {
      const response = await expenseCategoriesApi.update(id, arg);
      if (response.status === "success") {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update expense category.");
      }
    }
  );
};

// Hook for deleting an expense category
export const useDeleteExpenseCategory = () => {
  return useSWRMutation(
    '/expenses-categories',
    async (_, { arg }: { arg: string }) => {
      const response = await expenseCategoriesApi.delete(arg);
      if (response.status !== "success") {
        throw new Error(response.message || "Failed to delete expense category.");
      }
    }
  );
};
