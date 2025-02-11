import axios, { AxiosResponse } from 'axios';
import { env } from '@/config/environment';
import { CreateFeedDTO, UpdateFeedDTO, FeedResponse } from '@/dto/feed.dto';

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/feeds`,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

export const feedsApi = {
  getAll: async (): Promise<ApiResponse<FeedResponse[]>> => {
    const response: AxiosResponse<ApiResponse<FeedResponse[]>> = await apiClient.get('/');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<FeedResponse>> => {
    const response: AxiosResponse<ApiResponse<FeedResponse>> = await apiClient.get(`/${id}`);
    return response.data;
  },

  create: async (feed: CreateFeedDTO): Promise<ApiResponse<FeedResponse>> => {
    const response: AxiosResponse<ApiResponse<FeedResponse>> = await apiClient.post('/', feed);
    return response.data;
  },

  update: async (id: string, feed: UpdateFeedDTO): Promise<ApiResponse<FeedResponse>> => {
    const response: AxiosResponse<ApiResponse<FeedResponse>> = await apiClient.put(`/${id}`, feed);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await apiClient.delete(`/${id}`);
    return response.data;
  },
};
