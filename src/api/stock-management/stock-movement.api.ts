import { env } from "@/config/environment";
import { ApiResponse } from "@/types/api.type";
import {
  CreateStockMovementDTO,
  PopulatedStockMovement,
  UpdateStockMovementDTO,
} from "@/types/stock-management/stock-movement.dto";
import axios, { AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/stock-movements`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const stockMovementApi = {
  create: async (
    data: CreateStockMovementDTO
  ): Promise<ApiResponse<PopulatedStockMovement>> => {
    const response: AxiosResponse<ApiResponse<PopulatedStockMovement>> =
      await apiClient.post("/", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateStockMovementDTO
  ): Promise<ApiResponse<PopulatedStockMovement>> => {
    const response: AxiosResponse<ApiResponse<PopulatedStockMovement>> =
      await apiClient.put(`/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(
      `/${id}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<PopulatedStockMovement>> => {
    const response: AxiosResponse<ApiResponse<PopulatedStockMovement>> =
      await apiClient.get(`/${id}`);
    return response.data;
  },
};

export default stockMovementApi;
