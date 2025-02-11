import { env } from "@/config/environment";
import { PaginatedResponse } from "@/types/pagination.type";
import { Purchase } from "@/types/purchase.dto";
import axios, { AxiosResponse } from "axios";
import { CreateFullPurchaseDTO } from "@/types/createPurchase.dto";
import { UpdatePurchaseFullDTO } from "@/types/createPurchase.dto";
const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/purchase`,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiClientBulk = axios.create({
    baseURL: `${env.BACKEND_API_URL}/create-purchase`,
    headers: {
      "Content-Type": "application/json",
    },
  });

interface PaginatedApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: PaginatedResponse<T>;
}

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export const purchaseApi = {
  getAll: async (params: URLSearchParams) => {
    const response: AxiosResponse<PaginatedApiResponse<Purchase>> =
      await apiClient.get(`?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response: AxiosResponse<ApiResponse<Purchase>> = await apiClient.get(
      `/${id}`
    );
    return response.data;
  },

create: async (data: CreateFullPurchaseDTO): Promise<ApiResponse<Purchase>> => {
  const response = await apiClientBulk.post('/', data);
  return response.data;
},

update: async (id: string,data : UpdatePurchaseFullDTO): Promise<ApiResponse<Purchase>> => {
  const response = await apiClientBulk.put(`/${id}`, data);
  return response.data;
},

delete: async (id: string) => {
    const response: AxiosResponse<ApiResponse<Purchase>> =
    
      await apiClient.delete(`/${id}`);
    return response.data;
  },
};

export default purchaseApi;
