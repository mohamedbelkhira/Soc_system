import useSWR, { SWRConfiguration } from 'swr';
import { dashboardApi, DashboardStats } from '@/api/dashboard.api';

interface ApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data: T;
}

export function useDashboardStats(options?: SWRConfiguration) {
    const key = '/dashboard/stats';

    const { data, error, isLoading, mutate } = useSWR<ApiResponse<DashboardStats>>(
        key,
        dashboardApi.getStats,
        {
            refreshInterval: 60000, // Refresh every minute
            ...options,
        }
    );

    return {
        stats: data?.data,
        isLoading,
        isError: error,
        mutate,
    };
}
