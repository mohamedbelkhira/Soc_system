// src/api/expenseCategories.api.ts

import axios, { AxiosResponse } from "axios";
import { env } from "@/config/environment";
import {
  ExpenseCategory,
  CreateExpenseCategoryDTO,
  UpdateExpenseCategoryDTO,
} from "@/types/expenseCategory.dto";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/expenses-categories`, 
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export const expenseCategoriesApi = {
  getAll: async (): Promise<ApiResponse<ExpenseCategory[]>> => {
    const response: AxiosResponse<ApiResponse<ExpenseCategory[]>> = await apiClient.get("/");
    return response.data;
  },


  create: async (category: CreateExpenseCategoryDTO): Promise<ApiResponse<ExpenseCategory>> => {
    const response: AxiosResponse<ApiResponse<ExpenseCategory>> = await apiClient.post("/", category);
    return response.data;
  },

  update: async (id: string, category: UpdateExpenseCategoryDTO): Promise<ApiResponse<ExpenseCategory>> => {
    const response: AxiosResponse<ApiResponse<ExpenseCategory>> = await apiClient.put(`/${id}`, category);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await apiClient.delete(`/${id}`);
    return response.data;
  },
};
