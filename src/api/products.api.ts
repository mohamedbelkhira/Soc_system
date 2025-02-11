import { env } from "@/config/environment";
import { ApiResponse, PaginatedApiResponse } from "@/types/api.type";
import { Product } from "@/types/product.dto";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/products`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const productsApi = {
  getAll: async (params: URLSearchParams) => {
    const response = await apiClient.get<PaginatedApiResponse<Product>>(
      `?${params.toString()}`
    );
    return response.data;
  },

  getLowStock: async () => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/low-stock`);
    return response.data;
  },

  getActive: async () => {
    const response = await apiClient.get<ApiResponse<Product[]>>("/active");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Product>>(`/${id}`);
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await apiClient.post<ApiResponse<Product>>("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await apiClient.put<ApiResponse<Product>>(
      `/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<Product>>(`/${id}`);
    return response.data;
  },
};

export default productsApi;
