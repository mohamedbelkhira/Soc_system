import { env } from "@/config/environment";
import { ApiResponse } from "@/types/api.type";
import { Sale } from "@/types/sales/sale.dto";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${env.BACKEND_API_URL}/sales`,
  headers: {
    "Content-Type": "application/json",
  },
});

const salesApi = {
  getByProductId: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Sale[]>>(`/product/${id}`);
    return response.data;
  },
};

export default salesApi;
