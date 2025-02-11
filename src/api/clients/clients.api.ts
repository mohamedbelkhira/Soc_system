import { env } from "@/config/environment";
import { PaginatedApiResponse } from "@/types/api.type";
import {
  CreateClientDTO,
  DeleteClientDTO,
  FindClientByIdDTO,
  FindClientByPhoneDTO,
  UpdateClientDTO,
} from "@/types/clients/client.dto";
import { Client } from "@/types/clients/client.dto";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/clients`,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

const clientsApi = {
  getAll: async (searchParams?: URLSearchParams) => {
    const response = await apiClient.get<PaginatedApiResponse<Client>>(
      `?${searchParams?.toString()}`
    );
    return response.data;
  },

  getById: async (params: FindClientByIdDTO) => {
    const response = await apiClient.get<ApiResponse<Client>>(`/${params.id}`);
    return response.data;
  },

  getByPhone: async (params: FindClientByPhoneDTO) => {
    const response = await apiClient.get<ApiResponse<Client>>(
      `/phone/${params.phoneNumber}`
    );
    return response.data;
  },

  create: async (client: CreateClientDTO) => {
    const response = await apiClient.post<ApiResponse<Client>>("/", client);
    return response.data;
  },

  update: async (params: UpdateClientDTO) => {
    const { id, ...updateData } = params;
    const response = await apiClient.put<ApiResponse<Client>>(
      `/${id}`,
      updateData
    );
    return response.data;
  },

  delete: async (params: DeleteClientDTO) => {
    const response = await apiClient.delete<ApiResponse<Client>>(
      `/${params.id}`
    );
    return response.data;
  },
};

export default clientsApi;
