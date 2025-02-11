import { env } from "@/config/environment";
import axios, { AxiosResponse } from "axios";
import { Location, LocationType } from "@/types/locations/location.dto";
import { ApiResponse } from "@/types/api.type";
import {
  CreateLocationDTO,
  UpdateLocationDTO,
} from "@/types/locations/location.dto";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/locations`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const locationApi = {
  create: async (data: CreateLocationDTO): Promise<ApiResponse<Location>> => {
    const response: AxiosResponse<ApiResponse<Location>> = await apiClient.post(
      "/",
      data
    );
    return response.data;
  },

  update: async (
    id: string,
    data: Omit<UpdateLocationDTO, "id">
  ): Promise<ApiResponse<Location>> => {
    const response: AxiosResponse<ApiResponse<Location>> = await apiClient.put(
      `/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(
      `/${id}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Location>> => {
    const response: AxiosResponse<ApiResponse<Location>> = await apiClient.get(
      `/${id}`
    );
    return response.data;
  },

  getAll: async (): Promise<ApiResponse<Location[]>> => {
    const response: AxiosResponse<ApiResponse<Location[]>> =
      await apiClient.get("/");
    return response.data;
  },

  getActive: async (): Promise<ApiResponse<Location[]>> => {
    const response: AxiosResponse<ApiResponse<Location[]>> =
      await apiClient.get("/active");
    return response.data;
  },

  getByType: async (type: LocationType): Promise<ApiResponse<Location[]>> => {
    const response: AxiosResponse<ApiResponse<Location[]>> =
      await apiClient.get("/type", {
        params: { type },
      });
    return response.data;
  },
};

export default locationApi;
