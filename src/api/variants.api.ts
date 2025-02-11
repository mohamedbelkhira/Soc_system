import { env } from "@/config/environment";
import { ApiResponse, PaginatedApiResponse } from "@/types/api.type";
import {
  CreateVariantDTO,
  UpdateVariantDTO,
  Variant,
} from "@/types/variant.dto";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/variants`,
  headers: {
    "Content-Type": "application/json",
  },
});

const variantsApi = {
  getByProductId: async (productId: string, params: URLSearchParams) => {
    const response = await apiClient.get<PaginatedApiResponse<Variant>>(
      `/product/${productId}?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Variant>>(`/${id}`);
    return response.data;
  },

  create: async (variant: CreateVariantDTO) => {
    const response = await apiClient.post<ApiResponse<Variant>>(`/`, variant);
    return response.data;
  },

  update: async (id: string, variant: UpdateVariantDTO) => {
    const response = await apiClient.put<ApiResponse<Variant>>(
      `/${id}`,
      variant
    );
    return response.data;
  },

  updateBulk: async (productId: string, variants: UpdateVariantDTO[]) => {
    const response = await apiClient.put<ApiResponse<Variant[]>>(
      `/product/${productId}/bulk`,
      variants
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<Variant>>(`/${id}`);
    return response.data;
  },

  deleteBulk: async (productId: string, variantIds: string[]) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/product/${productId}/bulk`,
      { data: { variantIds } }
    );
    return response.data;
  },

  updateStock: async (id: string, quantity: number) => {
    const response = await apiClient.patch<ApiResponse<Variant>>(
      `/${id}/stock`,
      { quantity }
    );
    return response.data;
  },
};

export default variantsApi;
