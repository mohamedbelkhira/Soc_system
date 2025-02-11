import axios, { AxiosResponse } from "axios";
import { env } from "@/config/environment";
import { Agency, CreateAgencyDTO, UpdateAgencyDTO } from "@/types/agency.dto";


const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/agency`,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export const agenciesApi = {
  getAll: async () => {
    const response: AxiosResponse<ApiResponse<Agency[]>> = await apiClient.get("/");
    return response.data;
  },

  getById: async (id: string) => {
    const response: AxiosResponse<ApiResponse<Agency>> = await apiClient.get(`/${id}`);
    return response.data;
  },

  create: async (agency: CreateAgencyDTO) => {
    const response: AxiosResponse<ApiResponse<Agency>> = await apiClient.post("/", agency);
    return response.data;
  },

  update: async (id: string, agency: UpdateAgencyDTO) => {
    const response: AxiosResponse<ApiResponse<Agency>> = await apiClient.put(`/${id}`, agency);
    return response.data;
  },

  delete: async (id: string) => {
    const response: AxiosResponse<ApiResponse<Agency>> = await apiClient.delete(`/${id}`);
    return response.data;
  },
};