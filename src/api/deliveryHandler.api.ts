import axios, { AxiosResponse } from "axios";
import { env } from "@/config/environment";
import { DeliveryHandler } from "@/types/deliveryHandler.dto";

import { CreateDeliveryHandlerAPIPayload, UpdateDeliveryHandlerAPIPayload } from "@/types/deliveryHandler.dto";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/delivery`,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export const deliveryHandlersApi = {
  getAll: async () => {
    const response: AxiosResponse<ApiResponse<DeliveryHandler[]>> = await apiClient.get("/");
    return response.data;
  },

  getById: async (id: string) => {
    const response: AxiosResponse<ApiResponse<DeliveryHandler>> = await apiClient.get(`/${id}`);
    return response.data;
  },

  create: async (deliveryHandler: CreateDeliveryHandlerAPIPayload) => {
    const response: AxiosResponse<ApiResponse<DeliveryHandler>> = await apiClient.post("/", deliveryHandler);
    return response.data;
  },

  update: async (id: string, deliveryHandler: UpdateDeliveryHandlerAPIPayload) => {
    const response: AxiosResponse<ApiResponse<DeliveryHandler>> = await apiClient.put(`/${id}`, deliveryHandler);
    return response.data;
  },

  delete: async (id: string) => {
    const response: AxiosResponse<ApiResponse<DeliveryHandler>> = await apiClient.delete(`/${id}`);
    return response.data;
  },
};