
import axios, { AxiosResponse } from "axios";
import { env } from "@/config/environment"; // Ensure this is correctly set up
import {
  PurchaseFee,
  CreatePurchaseFeeDTO,
  UpdatePurchaseFeeDTO,
} from "@/types/purchaseFee.dto";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/purchase-fees`, // Ensure this matches your backend route
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export const purchaseFeesApi = {
  getAll: async (): Promise<ApiResponse<PurchaseFee[]>> => {
    const response: AxiosResponse<ApiResponse<PurchaseFee[]>> = await apiClient.get("/");
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<PurchaseFee>> => {
    const response: AxiosResponse<ApiResponse<PurchaseFee>> = await apiClient.get(`/${id}`);
    return response.data;
  },

  create: async (purchaseFee: CreatePurchaseFeeDTO): Promise<ApiResponse<PurchaseFee>> => {
    const response: AxiosResponse<ApiResponse<PurchaseFee>> = await apiClient.post("/", purchaseFee);
    return response.data;
  },

  update: async (
    id: string,
    purchaseFee: UpdatePurchaseFeeDTO
  ): Promise<ApiResponse<PurchaseFee>> => {
    const response: AxiosResponse<ApiResponse<PurchaseFee>> = await apiClient.put(`/${id}`, purchaseFee);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<PurchaseFee>> => {
    const response: AxiosResponse<ApiResponse<PurchaseFee>> = await apiClient.delete(`/${id}`);
    return response.data;
  },
};