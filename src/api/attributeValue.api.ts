import axios, { AxiosResponse } from "axios";
import { env } from "@/config/environment";
import {
  AttributeValue,
  CreateAttributeValueDTO,
  UpdateAttributeValueDTO,
} from "@/types/attributeValue.dto";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/attribute-values`,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export const attributeValuesApi = {
  getAll: async () => {
    const response: AxiosResponse<ApiResponse<AttributeValue[]>> =
      await apiClient.get("/");
    return response.data;
  },

  getById: async (id: string) => {
    const response: AxiosResponse<ApiResponse<AttributeValue>> =
      await apiClient.get(`/${id}`);
    return response.data;
  },

  getByVariantId: async (variantId: string) => {
    const response: AxiosResponse<ApiResponse<AttributeValue[]>> =
      await apiClient.get(`/variant/${variantId}`);
    return response.data;
  },

  getByAttributeId: async (attributeId: string) => {
    const response: AxiosResponse<ApiResponse<AttributeValue[]>> =
      await apiClient.get(`/attribute/${attributeId}`);
    return response.data;
  },

  create: async (attributeValue: CreateAttributeValueDTO) => {
    const response: AxiosResponse<ApiResponse<AttributeValue>> =
      await apiClient.post("/", attributeValue);
    return response.data;
  },

  update: async (id: string, attributeValue: UpdateAttributeValueDTO) => {
    const response: AxiosResponse<ApiResponse<AttributeValue>> =
      await apiClient.put(`/${id}`, attributeValue);
    return response.data;
  },

  delete: async (id: string) => {
    const response: AxiosResponse<ApiResponse<AttributeValue>> =
      await apiClient.delete(`/${id}`);
    return response.data;
  },

  deleteByVariantId: async (variantId: string) => {
    const response: AxiosResponse<ApiResponse<{ count: number }>> =
      await apiClient.delete(`/variant/${variantId}`);
    return response.data;
  },

  deleteByAttributeId: async (attributeId: string) => {
    const response: AxiosResponse<ApiResponse<{ count: number }>> =
      await apiClient.delete(`/attribute/${attributeId}`);
    return response.data;
  },
};

export default attributeValuesApi;
