
import axios, { AxiosResponse } from 'axios';
import { env } from '@/config/environment';
import { CreateRoleDTO, UpdateRoleDTO, RoleResponse } from '@/types/role.dto';

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/roles`,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

export const rolesApi = {
  getAll: async (): Promise<ApiResponse<RoleResponse[]>> => {
    const response: AxiosResponse<ApiResponse<RoleResponse[]>> = await apiClient.get('/');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<RoleResponse>> => {
    const response: AxiosResponse<ApiResponse<RoleResponse>> = await apiClient.get(`/${id}`);
    return response.data;
  },

  create: async (role: CreateRoleDTO): Promise<ApiResponse<RoleResponse>> => {
    const response: AxiosResponse<ApiResponse<RoleResponse>> = await apiClient.post('/', role);
    return response.data;
  },

  update: async (id: string, role: UpdateRoleDTO): Promise<ApiResponse<RoleResponse>> => {
    const response: AxiosResponse<ApiResponse<RoleResponse>> = await apiClient.put(`/${id}`, role);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await apiClient.delete(`/${id}`);
    return response.data;
  },
};