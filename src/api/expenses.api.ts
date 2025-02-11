import axios, { AxiosResponse } from "axios";
import { env } from "@/config/environment";
import { 
  Expense, 
  CreateExpenseDTO, 
  UpdateExpenseDTO 
} from "@/types/expense.dto";
import { PaginatedResponse } from "@/types/pagination.type";


// Define the base URL for expenses
const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/expenses`, 
  headers: {
    "Content-Type": "application/json",
  },
});
interface PaginatedApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: PaginatedResponse<T>;
}
// Standard API Response Interface
interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

// Expenses API Methods
export const expensesApi = {
  // Fetch all expenses
  getAll: async (params: URLSearchParams) => {
    const response: AxiosResponse<PaginatedApiResponse<Expense>> =
      await apiClient.get(`?${params.toString()}`);
    return response.data;
  },

  // Fetch a single expense by ID
  getExpense: async (id: string): Promise<ApiResponse<Expense>> => {
    const response: AxiosResponse<ApiResponse<Expense>> = await apiClient.get(`/${id}`);
    return response.data;
  },

  // Create a new expense
  create: async (expense: CreateExpenseDTO): Promise<ApiResponse<Expense>> => {
    const response: AxiosResponse<ApiResponse<Expense>> = await apiClient.post("/", expense);
    return response.data;
  },

  // Update an existing expense
  update: async (id: string, expense: UpdateExpenseDTO): Promise<ApiResponse<Expense>> => {
    const response: AxiosResponse<ApiResponse<Expense>> = await apiClient.put(`/${id}`, expense);
    return response.data;
  },

  // Delete an expense
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await apiClient.delete(`/${id}`);
    return response.data;
  },
};