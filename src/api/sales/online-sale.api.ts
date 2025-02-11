import { env } from "@/config/environment";
import { ApiResponse, PaginatedApiResponse } from "@/types/api.type";
import {
  EmbeddedCreateOnlineSaleDTO,
  EmbeddedUpdateOnlineSaleDTO,
  OnlineSale,
} from "@/types/sales/online-sale.dto";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/online-sales`,
  headers: {
    "Content-Type": "application/json",
  },
});

const onlineSalesApi = {
  getAll: async (searchParams: URLSearchParams) => {
    const response = await apiClient.get<PaginatedApiResponse<OnlineSale>>(
      `?${searchParams.toString()}`
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<OnlineSale>>(`/${id}`);
    return response.data;
  },

  create: async (onlineSale: EmbeddedCreateOnlineSaleDTO) => {
    const response = await apiClient.post<ApiResponse<OnlineSale>>(
      "/",
      onlineSale
    );
    return response.data;
  },

  update: async (id: string, onlineSale: EmbeddedUpdateOnlineSaleDTO) => {
    const response = await apiClient.put<ApiResponse<OnlineSale>>(
      `/${id}`,
      onlineSale
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<OnlineSale>>(`/${id}`);
    return response.data;
  },
};

export default onlineSalesApi;
