import useSWR, { SWRConfiguration } from 'swr';
import { workerConfigApi } from '@/api/workerConfig.api';
import { WorkerConfigResponse } from '@/dto/workerConfig.dto';

interface ApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data: T;
}

export function useWorkerConfigs(options?: SWRConfiguration) {
    const key = '/worker-configs';

    const { data, error, isLoading, mutate } = useSWR<ApiResponse<WorkerConfigResponse[]>>(
        key,
        workerConfigApi.getAll,
        {
            refreshInterval: 5000, // Poll every 5 seconds to get status updates
            ...options,
        }
    );

    return {
        configs: data?.data || [],
        isLoading,
        isError: error,
        mutate,
    };
}

export function useWorkerControl() {
    const { mutate } = useWorkerConfigs();

    const startWorker = async () => {
        await workerConfigApi.start();
        mutate();
    };

    const stopWorker = async () => {
        await workerConfigApi.stop();
        mutate();
    };

    const pauseWorker = async () => {
        await workerConfigApi.pause();
        mutate();
    };

    const updatePollInterval = async (id: string, interval: number) => {
        await workerConfigApi.update(id, { pollInterval: interval });
        mutate();
    };

    return {
        startWorker,
        stopWorker,
        pauseWorker,
        updatePollInterval,
    };
}
