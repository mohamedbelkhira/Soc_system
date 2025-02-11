import { env } from "@/config/environment";
import { ApiResponse } from "@/types/api.type";
import {
  CreateCurrentStockDTO,
  CurrentStock,
  UpdateCurrentStockDTO,
} from "@/types/stock-management/current-stock.dto";
import axios, { AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/current-stock`,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface StockIdentifier {
  locationId: string;
  purchaseItemId: string;
}

export const currentStockApi = {
  create: async (
    data: CreateCurrentStockDTO
  ): Promise<ApiResponse<CurrentStock>> => {
    const response: AxiosResponse<ApiResponse<CurrentStock>> =
      await apiClient.post("/", data);
    return response.data;
  },

  update: async (
    identifier: StockIdentifier,
    data: Omit<UpdateCurrentStockDTO, keyof StockIdentifier>
  ): Promise<ApiResponse<CurrentStock>> => {
    const { locationId, purchaseItemId } = identifier;
    const response: AxiosResponse<ApiResponse<CurrentStock>> =
      await apiClient.put(`/${locationId}/${purchaseItemId}`, data);
    return response.data;
  },

  delete: async (identifier: StockIdentifier): Promise<ApiResponse<void>> => {
    const { locationId, purchaseItemId } = identifier;
    const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(
      `/${locationId}/${purchaseItemId}`
    );
    return response.data;
  },

  getById: async (
    identifier: StockIdentifier
  ): Promise<ApiResponse<CurrentStock>> => {
    const { locationId, purchaseItemId } = identifier;
    const response: AxiosResponse<ApiResponse<CurrentStock>> =
      await apiClient.get(`/${locationId}/${purchaseItemId}`);
    return response.data;
  },

  getAll: async (): Promise<ApiResponse<CurrentStock[]>> => {
    const response: AxiosResponse<ApiResponse<CurrentStock[]>> =
      await apiClient.get("/");
    return response.data;
  },

  getByProduct: async (
    productId: string
  ): Promise<ApiResponse<CurrentStock[]>> => {
    const response: AxiosResponse<ApiResponse<CurrentStock[]>> =
      await apiClient.get("/by-product", {
        params: { productId },
      });
    return response.data;
  },

  getByLocationAndProduct: async (params: {
    locationId: string;
    productId: string;
  }): Promise<ApiResponse<CurrentStock[]>> => {
    const response: AxiosResponse<ApiResponse<CurrentStock[]>> =
      await apiClient.get(
        `/?locationId=${params.locationId}&productId=${params.productId}`
      );
    return response.data;
  },

  getByLocationAndVariant: async (params: {
    locationId: string;
    variantId: string;
  }): Promise<ApiResponse<CurrentStock[]>> => {
    const response: AxiosResponse<ApiResponse<CurrentStock[]>> =
      await apiClient.get(
        `/?locationId=${params.locationId}&variantId=${params.variantId}`
      );
    return response.data;
  },
};

export default currentStockApi;
