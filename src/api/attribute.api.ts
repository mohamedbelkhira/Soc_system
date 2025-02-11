import { env } from "@/config/environment";
import { ApiResponse, PaginatedApiResponse } from "@/types/api.type";
import {
  Attribute,
  CreateAttributeDTO,
  UpdateAttributeDTO,
} from "@/types/attribute.dto";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/attributes`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const attributesApi = {
  getAll: async (params: URLSearchParams) => {
    const response = await apiClient.get<PaginatedApiResponse<Attribute>>(
      `?${params.toString()}`
    );
    console.log("PARAMS: ", params.toString());

    return response.data;
  },
  getActive: async () => {
    const response = await apiClient.get<ApiResponse<Attribute[]>>("/active");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Attribute>>(`/${id}`);
    return response.data;
  },

  create: async (attribute: CreateAttributeDTO) => {
    const response = await apiClient.post<ApiResponse<Attribute>>(
      "/",
      attribute
    );
    return response.data;
  },

  update: async (attribute: UpdateAttributeDTO) => {
    const response = await apiClient.put<ApiResponse<Attribute>>(
      `/${attribute.id}`,
      attribute
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<Attribute>>(`/${id}`);
    return response.data;
  },
};

export default attributesApi;
