import { env } from "@/config/environment";
import { ApiResponse } from "@/types/api.type";
import {
  PopulatedStockMovementItem,
  UpdateStockMovementItemDTO,
} from "@/types/stock-management/stock-movement-item.dto";
import axios, { AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/stock-movement-item`,
  headers: {
    "Content-Type": "application/json",
  },
});
export const stockMovementItemApi = {
  create: async (
    data: PopulatedStockMovementItem
  ): Promise<ApiResponse<PopulatedStockMovementItem>> => {
    const response: AxiosResponse<ApiResponse<PopulatedStockMovementItem>> =
      await apiClient.post("/", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateStockMovementItemDTO
  ): Promise<ApiResponse<PopulatedStockMovementItem>> => {
    const response: AxiosResponse<ApiResponse<PopulatedStockMovementItem>> =
      await apiClient.put(`/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(
      `/${id}`
    );
    return response.data;
  },

  getById: async (
    id: string
  ): Promise<ApiResponse<PopulatedStockMovementItem>> => {
    const response: AxiosResponse<ApiResponse<PopulatedStockMovementItem>> =
      await apiClient.get(`/${id}`);
    return response.data;
  },
};

export default stockMovementItemApi;