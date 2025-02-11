import { env } from "@/config/environment";
import { ApiResponse, PaginatedApiResponse } from "@/types/api.type";
import {
  Category,
  EmbeddedCreateCategoryDTO,
  EmbeddedUpdateCategoryDTO,
} from "@/types/category.dto";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/categories`,
  headers: {
    "Content-Type": "application/json",
  },
});

const categoriesApi = {
  getAllPaginated: async (params: URLSearchParams) => {
    const response = await apiClient.get<PaginatedApiResponse<Category>>(
      `?${params.toString()}`
    );
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get<PaginatedApiResponse<Category>>("/");
    return response.data;
  },

  getActive: async () => {
    const response = await apiClient.get<ApiResponse<Category[]>>("/active");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Category>>(`/${id}`);
    return response.data;
  },

  create: async (category: EmbeddedCreateCategoryDTO) => {
    const response = await apiClient.post<ApiResponse<Category>>("/", category);
    return response.data;
  },

  update: async (category: EmbeddedUpdateCategoryDTO) => {
    const response = await apiClient.put<ApiResponse<Category>>(
      `/${category.id}`,
      category
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<Category>>(`/${id}`);
    return response.data;
  },
};

export default categoriesApi;
