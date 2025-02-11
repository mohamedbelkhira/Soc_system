import axios, { AxiosResponse } from "axios";
import { env } from "@/config/environment";
import { Job, CreateJobDTO, UpdateJobDTO } from "@/types/job.dto";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/jobs`,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export const jobsApi = {
  getAll: async () => {
    const response: AxiosResponse<ApiResponse<Job[]>> = await apiClient.get("/");
    return response.data;
  },

  getById: async (id: string) => {
    const response: AxiosResponse<ApiResponse<Job>> = await apiClient.get(`/${id}`);
    return response.data;
  },

  create: async (job: CreateJobDTO) => {
    const response: AxiosResponse<ApiResponse<Job>> = await apiClient.post("/", job);
    return response.data;
  },

  update: async (id: string, job: UpdateJobDTO) => {
    const response: AxiosResponse<ApiResponse<Job>> = await apiClient.put(`/${id}`, job);
    return response.data;
  },

  delete: async (id: string) => {
    const response: AxiosResponse<ApiResponse<Job>> = await apiClient.delete(`/${id}`);
    return response.data;
  },
};