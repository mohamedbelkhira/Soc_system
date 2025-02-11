import axios, { AxiosResponse } from "axios";
import { env } from "@/config/environment";

// This interface matches the structure your backend returns, adjust if needed.
interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

// Define interfaces for the response data your backend returns.
// Adjust these based on your actual backend response types.
interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  imageUrls: string[];
}

interface TopCategory {
  categoryId: string;
  categoryName: string;
  totalSold: number;
}

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/statistics`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const statisticsApi = {
  getTop5Products: async (): Promise<ApiResponse<TopProduct[]>> => {
    const response: AxiosResponse<ApiResponse<TopProduct[]>> = await apiClient.get("/top-products");
    console.log("top products", response);
    return response.data;
  },

  getTop5Categories: async (): Promise<ApiResponse<TopCategory[]>> => {
    const response: AxiosResponse<ApiResponse<TopCategory[]>> = await apiClient.get("/top-categories");
    return response.data;
  },
};