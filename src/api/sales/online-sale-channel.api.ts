import axios, { AxiosResponse } from "axios";
import { env } from "@/config/environment";
import {
  CreateOnlineSaleChannelDTO,
  UpdateOnlineSaleChannelDTO,
  DeleteOnlineSaleChannelDTO,
  FindOnlineSaleChannelByIdDTO,
} from "@/types/sales/online-sale-channel.dto";
import { OnlineSaleChannel } from "@/types/sales/online-sale-channel.dto";

const apiOnlineSaleChannel = axios.create({
  baseURL: `${env.BACKEND_API_URL}/online-sale-channels`,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

const onlineSaleChannelsApi = {
  getAll: async () => {
    const response: AxiosResponse<ApiResponse<OnlineSaleChannel[]>> =
      await apiOnlineSaleChannel.get("/");
    return response.data;
  },

  getById: async (params: FindOnlineSaleChannelByIdDTO) => {
    const response: AxiosResponse<ApiResponse<OnlineSaleChannel>> =
      await apiOnlineSaleChannel.get(`/${params.id}`);
    return response.data;
  },

  create: async (client: CreateOnlineSaleChannelDTO) => {
    const response: AxiosResponse<ApiResponse<OnlineSaleChannel>> =
      await apiOnlineSaleChannel.post("/", client);
    return response.data;
  },

  update: async (params: UpdateOnlineSaleChannelDTO) => {
    const { id, ...updateData } = params;
    const response: AxiosResponse<ApiResponse<OnlineSaleChannel>> =
      await apiOnlineSaleChannel.put(`/${id}`, updateData);
    return response.data;
  },

  delete: async (params: DeleteOnlineSaleChannelDTO) => {
    const response: AxiosResponse<ApiResponse<OnlineSaleChannel>> =
      await apiOnlineSaleChannel.delete(`/${params.id}`);
    return response.data;
  },
};

export default onlineSaleChannelsApi;
