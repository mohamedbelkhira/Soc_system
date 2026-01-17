import axios, { AxiosResponse } from 'axios';
import { env } from '@/config/environment';
import { TagResponse, CreateTagDTO, UpdateTagDTO } from '@/dto/tag.dto';

const apiClient = axios.create({
    baseURL: `${env.BACKEND_API_URL}/tags`,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface ApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data: T;
}

export const tagsApi = {
    getAll: async (): Promise<ApiResponse<TagResponse[]>> => {
        const response: AxiosResponse<ApiResponse<TagResponse[]>> = await apiClient.get('/');
        return response.data;
    },

    getById: async (tagId: string): Promise<ApiResponse<TagResponse>> => {
        const response: AxiosResponse<ApiResponse<TagResponse>> = await apiClient.get(`/${tagId}`);
        return response.data;
    },

    create: async (tag: CreateTagDTO): Promise<ApiResponse<TagResponse>> => {
        const response: AxiosResponse<ApiResponse<TagResponse>> = await apiClient.post('/', tag);
        return response.data;
    },

    update: async (tagId: string, tag: UpdateTagDTO): Promise<ApiResponse<TagResponse>> => {
        const response: AxiosResponse<ApiResponse<TagResponse>> = await apiClient.put(`/${tagId}`, tag);
        return response.data;
    },

    delete: async (tagId: string): Promise<ApiResponse<null>> => {
        const response: AxiosResponse<ApiResponse<null>> = await apiClient.delete(`/${tagId}`);
        return response.data;
    },
};
