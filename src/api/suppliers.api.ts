import axios, { AxiosResponse } from 'axios';
import { env } from '@/config/environment';
import {
  Supplier,
  CreateSupplierDTO,
  UpdateSupplierDTO,
} from '@/types/supplier.dto';

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/supplier`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

export const suppliersApi = {
  getAll: async (): Promise<ApiResponse<Supplier[]>> => {
    const response: AxiosResponse<ApiResponse<Supplier[]>> = await apiClient.get('/');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Supplier>> => {
    const response: AxiosResponse<ApiResponse<Supplier>> = await apiClient.get(`/${id}`);
    return response.data;
  },

  create: async (supplier: CreateSupplierDTO): Promise<ApiResponse<Supplier>> => {
    const response: AxiosResponse<ApiResponse<Supplier>> = await apiClient.post('/', supplier);
    return response.data;
  },

  update: async (id: string, supplier: UpdateSupplierDTO): Promise<ApiResponse<Supplier>> => {
    const response: AxiosResponse<ApiResponse<Supplier>> = await apiClient.put(`/${id}`, supplier);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<Supplier>> => {
    const response: AxiosResponse<ApiResponse<Supplier>> = await apiClient.delete(`/${id}`);
    return response.data;
  },
};