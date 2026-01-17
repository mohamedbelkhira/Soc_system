import axios, { AxiosResponse } from 'axios';
import { env } from '@/config/environment';
import { WorkerConfigResponse } from '@/dto/workerConfig.dto';

const apiClient = axios.create({
    baseURL: `${env.BACKEND_API_URL}/worker-configs`,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface ApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data: T;
}

export const workerConfigApi = {
    getAll: async (): Promise<ApiResponse<WorkerConfigResponse[]>> => {
        const response: AxiosResponse<ApiResponse<WorkerConfigResponse[]>> = await apiClient.get('/');
        return response.data;
    },

    getStatus: async (): Promise<ApiResponse<any>> => {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.get('/control/status');
        return response.data;
    },

    start: async (): Promise<ApiResponse<any>> => {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/control/start');
        return response.data;
    },

    stop: async (): Promise<ApiResponse<any>> => {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/control/stop');
        return response.data;
    },

    pause: async (): Promise<ApiResponse<any>> => {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/control/pause');
        return response.data;
    },

    update: async (id: string, data: Partial<WorkerConfigResponse>): Promise<ApiResponse<WorkerConfigResponse>> => {
        const response: AxiosResponse<ApiResponse<WorkerConfigResponse>> = await apiClient.put(`/${id}`, data);
        return response.data;
    },
};
