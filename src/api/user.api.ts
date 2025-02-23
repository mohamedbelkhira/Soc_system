import axios, { AxiosResponse } from 'axios';
import { env } from '@/config/environment';
import {
  CreateUserDTO,
  UpdateUserDTO,
  AuthenticateUserDTO,
  UserResponse,
  AuthResponse,
  RefreshTokenResponse,
} from '@/dto/user.dto';

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

export const usersApi = {
  getAll: async (): Promise<ApiResponse<UserResponse[]>> => {
    const response: AxiosResponse<ApiResponse<UserResponse[]>> = await apiClient.get('/');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<UserResponse>> => {
    const response: AxiosResponse<ApiResponse<UserResponse>> = await apiClient.get(`/${id}`);
    return response.data;
  },

  create: async (user: CreateUserDTO): Promise<ApiResponse<UserResponse>> => {
    const response: AxiosResponse<ApiResponse<UserResponse>> = await apiClient.post('/', user);
    return response.data;
  },

  update: async (id: string, user: UpdateUserDTO): Promise<ApiResponse<UserResponse>> => {
    const response: AxiosResponse<ApiResponse<UserResponse>> = await apiClient.put(`/${id}`, user);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await apiClient.delete(`/${id}`);
    return response.data;
  },

  authenticate: async (data: AuthenticateUserDTO): Promise<ApiResponse<AuthResponse>> => {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await apiClient.post('/login', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> => {
    const response: AxiosResponse<ApiResponse<RefreshTokenResponse>> = await apiClient.post('/refresh-token', { refreshToken });
    return response.data;
  },
};
