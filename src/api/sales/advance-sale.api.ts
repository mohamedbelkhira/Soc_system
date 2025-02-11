import { env } from "@/config/environment";
import { ApiResponse, PaginatedApiResponse } from "@/types/api.type";
import {
  AdvanceSale,
  EmbeddedCreateAdvanceSaleDTO,
  EmbeddedUpdateAdvanceSaleDTO,
} from "@/types/sales/advance-sale.dto";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/advance-sales`,
  headers: {
    "Content-Type": "application/json",
  },
});

const advanceSaleApi = {
  getAll: async (searchParams: URLSearchParams) => {
    const response = await apiClient.get<PaginatedApiResponse<AdvanceSale>>(
      `?${searchParams.toString()}`
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<AdvanceSale>>(`/${id}`);
    return response.data;
  },

  create: async (storeSale: EmbeddedCreateAdvanceSaleDTO) => {
    const response = await apiClient.post<ApiResponse<AdvanceSale>>(
      "/",
      storeSale
    );
    return response.data;
  },

  update: async (id: string, storeSale: EmbeddedUpdateAdvanceSaleDTO) => {
    const response = await apiClient.put<ApiResponse<AdvanceSale>>(
      `/${id}`,
      storeSale
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<AdvanceSale>>(`/${id}`);
    return response.data;
  },
};

export default advanceSaleApi;
