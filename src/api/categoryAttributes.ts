import axios, { AxiosResponse } from "axios";
import { env } from "@/config/environment";
import {
  CategoryAttribute,
  CreateCategoryAttributeDTO,
  UpdateCategoryAttributeDTO,
  DeleteCategoryAttributeDTO,
  FindCategoryAttributeByIdDTO,
} from "@/types/categoryAttribute.dto";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/category-attributes`,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

const categoryAttributesApi = {
  getAll: async () => {
    const response: AxiosResponse<ApiResponse<CategoryAttribute[]>> =
      await apiClient.get("/");
    return response.data;
  },

  getByCategoryId: async (categoryId: string) => {
    const response: AxiosResponse<ApiResponse<CategoryAttribute[]>> =
      await apiClient.get(`/category/${categoryId}`);
    return response.data;
  },

  getByAttributeId: async (attributeId: string) => {
    const response: AxiosResponse<ApiResponse<CategoryAttribute[]>> =
      await apiClient.get(`/attribute/${attributeId}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response: AxiosResponse<ApiResponse<CategoryAttribute>> =
      await apiClient.get(`/${id}`);
    return response.data;
  },

  create: async (categoryAttribute: CreateCategoryAttributeDTO) => {
    const response: AxiosResponse<ApiResponse<CategoryAttribute>> =
      await apiClient.post("/", categoryAttribute);
    return response.data;
  },

  update: async (id: string, categoryAttribute: UpdateCategoryAttributeDTO) => {
    const response: AxiosResponse<ApiResponse<CategoryAttribute>> =
      await apiClient.put(`/${id}`, categoryAttribute);
    return response.data;
  },

  delete: async (id: string) => {
    const response: AxiosResponse<ApiResponse<CategoryAttribute>> =
      await apiClient.delete(`/${id}`);
    return response.data;
  },
};

export default categoryAttributesApi;
