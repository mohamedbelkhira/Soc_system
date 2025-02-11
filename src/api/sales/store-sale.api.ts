import { env } from "@/config/environment";
import { ApiResponse, PaginatedApiResponse } from "@/types/api.type";
import {
  EmbeddedCreateStoreSaleDTO,
  EmbeddedUpdateStoreSaleDTO,
  StoreSale,
} from "@/types/sales/store-sale.dto";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/store-sales`,
  headers: {
    "Content-Type": "application/json",
  },
});

const storeSalesApi = {
  getAll: async (searchParams: URLSearchParams) => {
    const response = await apiClient.get<PaginatedApiResponse<StoreSale>>(
      `?${searchParams.toString()}`
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<StoreSale>>(`/${id}`);
    return response.data;
  },

  create: async (storeSale: EmbeddedCreateStoreSaleDTO) => {
    const response = await apiClient.post<ApiResponse<StoreSale>>(
      "/",
      storeSale
    );
    return response.data;
  },

  update: async (id: string, storeSale: EmbeddedUpdateStoreSaleDTO) => {
    const response = await apiClient.put<ApiResponse<StoreSale>>(
      `/${id}`,
      storeSale
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<StoreSale>>(`/${id}`);
    return response.data;
  },
};

export default storeSalesApi;
