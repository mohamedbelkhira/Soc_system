// src/swr/expenses/expense.swr.ts
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { Expense, CreateExpenseDTO, UpdateExpenseDTO } from "@/types/expense.dto";
import { AxiosError } from "axios";
import { expensesApi } from "@/api/expenses.api";
import { ApiResponse, PaginatedApiResponse } from "@/types/api.type";

const EXPENSES_KEY = "expenses";

// Return types
type UseExpensesReturn = {
  data: Expense[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  isLoading: boolean;
  error: AxiosError | null;
  // mutate: () => Promise<void>; // Add mutate to return type
};

type UseExpenseReturn = {
  data: Expense | null;
  isLoading: boolean;
  error: AxiosError | null;
};

type CreateMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  trigger: (formData: CreateExpenseDTO) => Promise<ApiResponse<Expense>>;
};

type UpdateMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  updateExpense: (formData: UpdateExpenseDTO) => Promise<ApiResponse<Expense>>;
};

type DeleteMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  deleteExpense: () => Promise<ApiResponse<null>>;
};

// Key generators
const getPaginatedExpensesKey = (params: URLSearchParams) => {
  return `${EXPENSES_KEY}?${params.toString()}`;
};

const getExpensesKey = () => {
  return `${EXPENSES_KEY}`;
};

const getExpenseKey = (id: string) => `${EXPENSES_KEY}/${id}`;

// Hook for fetching all expenses with pagination
export const useExpenses = (params: URLSearchParams): UseExpensesReturn => {
  const { data, error, isLoading
   } = useSWR<PaginatedApiResponse<Expense>>(
    getPaginatedExpensesKey(params),
    () => expensesApi.getAll(params),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data?.data.items ?? [],
    totalPages: data?.data.meta.totalPages ?? 0,
    currentPage: data?.data.meta.page ?? 1,
    totalCount: data?.data.meta.total ?? 0,
    isLoading,
    error: error as AxiosError | null,
    
  };
};
// Hook for fetching a single expense
export const useExpense = (id: string): UseExpenseReturn => {
  const { data, error, isLoading } = useSWR(
    getExpenseKey(id),
    () => expensesApi.getExpense(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data?.data ?? null,
    isLoading,
    error: error as AxiosError | null,
  };
};

// Hook for creating an expense
export const useCreateExpense = (): CreateMutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    EXPENSES_KEY,
    async (_key: string, { arg }: { arg: CreateExpenseDTO }) => {
      const response = await expensesApi.create(arg);
      await mutate((key: string) => typeof key === "string" && key.startsWith(EXPENSES_KEY));
      return response;
    }
  );

  return {
    trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};

// Hook for updating an expense
export const useUpdateExpense = (id: string): UpdateMutationReturn => {
  const { mutate } = useSWRConfig();

  const { trigger, error, isMutating } = useSWRMutation(
    getExpenseKey(id),
    async (_key: string, { arg }: { arg: UpdateExpenseDTO }) => {
      const response = await expensesApi.update(id, arg);
      await mutate((key: string) => typeof key === "string" && key.startsWith(EXPENSES_KEY));
      return response;
    }
  );

  return {
    updateExpense: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};

// Hook for deleting an expense
export const useDeleteExpense = (id: string): DeleteMutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getExpenseKey(id),
    async () => {
      const response = await expensesApi.delete(id);
      await mutate((key) => typeof key === "string" && key.startsWith(getExpensesKey()));
      return response;
    }
  );

  return {
    deleteExpense: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};

export default {
  useExpenses,
  useExpense,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
};