import axios, { AxiosResponse } from 'axios';
import { env } from '@/config/environment';

export interface DashboardStats {
    general: {
        totalArticles: number;
        activeFeeds: number;
        readArticles: number;
        unreadArticles: number;
    };
    timeline: {
        date: string;
        count: number;
    }[];
    sources: {
        name: string;
        count: number;
    }[];
    tags: {
        name: string;
        count: number;
    }[];
}

const apiClient = axios.create({
    baseURL: `${env.BACKEND_API_URL}/dashboard`,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface ApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data: T;
}

export const dashboardApi = {
    getStats: async (): Promise<ApiResponse<DashboardStats>> => {
        const response: AxiosResponse<ApiResponse<DashboardStats>> = await apiClient.get('/');
        return response.data;
    },
};
