// src/swr/purchases/purchase.swr.ts
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { Purchase } from "@/types/purchase.dto";
import { AxiosError } from "axios";
import purchaseApi from "@/api/purchases.api";
import { ApiResponse } from "@/types/api.type";
import { CreateFullPurchaseDTO, UpdatePurchaseFullDTO } from "@/types/createPurchase.dto";
import { Purchase_with_extra_data } from "@/types/getpurchase.dto";

const PURCHASES_KEY = "purchase";

// Updated return types
type UsePurchasesReturn = {
  data: Purchase[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  isLoading: boolean;
  error: AxiosError | null;
};

type UsePurchaseReturn = {
  data: Purchase_with_extra_data | null;
  isLoading: boolean;
  error: AxiosError | null;
};

type MutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  trigger: (formData: CreateFullPurchaseDTO) => Promise<ApiResponse<Purchase>>;
};

type DeleteMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  deletePurchase: () => Promise<ApiResponse<Purchase>>;
};

const getPaginatedPurchasesKey = (params: URLSearchParams) => {
  return `${PURCHASES_KEY}?${params.toString()}`;
};

const getPurchasesKey = () => {
  return `${PURCHASES_KEY}`;
};
const getPurchaseKey = (id: string) => `${PURCHASES_KEY}/${id}`;

export const usePurchases = (params: URLSearchParams): UsePurchasesReturn => {
  const { data, error, isLoading } = useSWR(
    getPaginatedPurchasesKey(params),
    () => purchaseApi.getAll(params),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data?.data.items ?? [],
    totalPages: data?.data.meta.totalPages ?? 0,
    currentPage: data?.data.meta.page ?? 1,
    totalCount: data?.data.meta.total ?? 0,
    isLoading,
    error: error as AxiosError | null,
  };
};

export const usePurchase = (id: string): UsePurchaseReturn => {
  const { data, error, isLoading } = useSWR(
    getPurchaseKey(id),
    () => purchaseApi.getById(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data?.data ?? null,
    isLoading,
    error: error as AxiosError | null,
  };
};


export const useCreatePurchase = (): MutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    PURCHASES_KEY,
    async (_key: string, { arg }: { arg: CreateFullPurchaseDTO }) => {
      const response = await purchaseApi.create(arg); 
      await mutate((key: string) => typeof key === "string" && key.startsWith(PURCHASES_KEY));
      return response;
    }
  );

  return {
    trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};

export const useUpdatePurchase = (id: string) => {
  const { mutate } = useSWRConfig();

  const { trigger, error, isMutating } = useSWRMutation(
    getPurchaseKey(id),
    async (_key: string, { arg }: { arg: UpdatePurchaseFullDTO }) => {
      const response = await purchaseApi.update(id, arg);
      await mutate((key: string) => typeof key === "string" && key.startsWith(PURCHASES_KEY));
      return response;
    }
  );

  return {
    updatePurchase: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};

export const useDeletePurchase = (id: string): DeleteMutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getPurchaseKey(id),
    async () => {
      const response = await purchaseApi.delete(id); 
      await mutate((key) => typeof key === "string" && key.startsWith(getPurchasesKey()));
      return response;
    }
  );

  return {
    deletePurchase: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};

export default {
  usePurchases,
  usePurchase,
  useCreatePurchase,
  useUpdatePurchase,
  useDeletePurchase,
};
