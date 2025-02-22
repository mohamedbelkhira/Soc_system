import axios, { AxiosResponse } from 'axios';
import { env } from '@/config/environment';
import { 
  CreateFeedItemDTO, 
  UpdateFeedItemDTO, 
  FeedItemResponse 
} from '@/dto/feedItem.dto';

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/feeds-items`,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

export const feedItemsApi = {
  getAll: async (): Promise<ApiResponse<FeedItemResponse[]>> => {
    const response: AxiosResponse<ApiResponse<FeedItemResponse[]>> = await apiClient.get('/');
    return response.data;
  },

  getById: async (itemId: string): Promise<ApiResponse<FeedItemResponse>> => {
    const response: AxiosResponse<ApiResponse<FeedItemResponse>> = await apiClient.get(`/${itemId}`);
    return response.data;
  },

  create: async (feedItem: CreateFeedItemDTO): Promise<ApiResponse<FeedItemResponse>> => {
    const response: AxiosResponse<ApiResponse<FeedItemResponse>> = await apiClient.post('/', feedItem);
    return response.data;
  },

  update: async (itemId: string, feedItem: UpdateFeedItemDTO): Promise<ApiResponse<FeedItemResponse>> => {
    const response: AxiosResponse<ApiResponse<FeedItemResponse>> = await apiClient.put(`/${itemId}`, feedItem);
    return response.data;
  },

  delete: async (itemId: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await apiClient.delete(`/${itemId}`);
    return response.data;
  },

  // Additional helper method to update read status
  updateReadStatus: async (itemId: string, readStatus: boolean): Promise<ApiResponse<FeedItemResponse>> => {
    const response: AxiosResponse<ApiResponse<FeedItemResponse>> = await apiClient.put(`/${itemId}`, {
      readStatus,
    });
    return response.data;
  },

  // Helper method to get feed items by feed ID
  getByFeedId: async (feedId: string): Promise<ApiResponse<FeedItemResponse[]>> => {
    const response: AxiosResponse<ApiResponse<FeedItemResponse[]>> = await apiClient.get(`/?feedId=${feedId}`);
    return response.data;
  }
};