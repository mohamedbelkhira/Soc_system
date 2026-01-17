export type WorkerStatus = 'RUNNING' | 'PAUSED' | 'STOPPED';

export interface WorkerConfigResponse {
    configId: string;
    pollInterval: number;
    lastRun?: Date;
    nextRun?: Date;
    status: WorkerStatus;
}

export interface UpdateWorkerConfigDTO {
    pollInterval?: number;
    status?: WorkerStatus;
}
