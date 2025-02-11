
import axios, { AxiosResponse } from 'axios';
import { env } from '@/config/environment';
import {
  Employee,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from '@/types/employee.dto';

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/employee`,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

export const employeesApi = {
  getAll: async () => {
    const response: AxiosResponse<ApiResponse<Employee[]>> = await apiClient.get('/');
    console.log(response.data);
    return response.data;
  },

  getById: async (id: string) => {
    const response: AxiosResponse<ApiResponse<Employee>> = await apiClient.get(`/${id}`);
    return response.data;
  },
  getByUserId: async (id: string) => {
    const response: AxiosResponse<ApiResponse<Employee>> = await apiClient.get(`by-user/${id}`);
    return response.data;
  },

  create: async (employee: CreateEmployeeDTO) => {
    const response: AxiosResponse<ApiResponse<Employee>> = await apiClient.post('/', employee);
    return response.data;
  },

  update: async (id: string, employee: UpdateEmployeeDTO) => {
    const response: AxiosResponse<ApiResponse<Employee>> = await apiClient.put(`/${id}`, employee);
    return response.data;
  },

  delete: async (id: string) => {
    const response: AxiosResponse<ApiResponse<Employee>> = await apiClient.delete(`/${id}`);
    return response.data;
  },
};