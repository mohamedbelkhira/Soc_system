import productsApi from "@/api/products.api";
import { Product } from "@/types/product.dto";
import {
  UseCreate,
  UseDelete,
  UseFetchAndUpdate,
  UseItem,
  UseItems,
  UsePaginatedItems,
} from "@/types/swr.type";
import { AxiosError } from "axios";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

const PRODUCTS_KEY = "products";
const LOW_STOCK_KEY = "low-stock";
const getPaginatedProductsKey = (params: URLSearchParams) => {
  return `${PRODUCTS_KEY}?${params.toString()}`;
};
const getProductKey = (id: string) => `${PRODUCTS_KEY}/${id}`;
const getProductsKey = () => PRODUCTS_KEY;

export const useProducts = (
  params: URLSearchParams
): UsePaginatedItems<Product> => {
  const { data, error, isLoading } = useSWR(
    getPaginatedProductsKey(params),
    () => productsApi.getAll(params),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      keepPreviousData: true,
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

export const useActiveProducts = (): UseItems<Product> => {
  const { data, error, isLoading } = useSWR(
    getProductsKey(),
    () => productsApi.getActive(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      keepPreviousData: true,
    }
  );

  return {
    data: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useLowStockProducts = (): UseItems<Product> => {
  const { data, error, isLoading } = useSWR(
    LOW_STOCK_KEY,
    () => productsApi.getLowStock(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      keepPreviousData: true,
    }
  );

  return {
    data: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useProduct = (id: string): UseItem<Product> => {
  const { data, error, isLoading } = useSWR(
    getProductKey(id),
    () => productsApi.getById(id),
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

export const useCreateProduct = (): UseCreate<Product, FormData> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    PRODUCTS_KEY,
    async (_key: string, { arg }: { arg: FormData }) => {
      const response = await productsApi.create(arg);
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(PRODUCTS_KEY);
      });
      return response;
    }
  );

  return {
    create: trigger,
    isCreating: isMutating,
    error: error as AxiosError | null,
  };
};

export const useUpdateProduct = (
  id: string
): UseFetchAndUpdate<Product, FormData> => {
  const { mutate } = useSWRConfig();

  const {
    data: productData,
    error: fetchError,
    isLoading: isFetching,
  } = useSWR(getProductKey(id), () => productsApi.getById(id), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const {
    trigger,
    error: mutationError,
    isMutating,
  } = useSWRMutation(
    getProductKey(id),
    async (_key: string, { arg }: { arg: FormData }) => {
      const response = await productsApi.update(id, arg);
      await mutate(
        (key: string) => typeof key === "string" && key.startsWith(PRODUCTS_KEY)
      );
      return response;
    }
  );

  return {
    data: productData?.data ?? null,
    update: trigger,
    isUpdating: isMutating,
    isLoading: isFetching,
    error: (mutationError || fetchError) as AxiosError | null,
  };
};

export const useDeleteProduct = (id: string): UseDelete<Product> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getProductKey(id),
    async () => {
      const response = await productsApi.delete(id);
      await mutate((key) => {
        return typeof key === "string" && key.startsWith(getProductsKey());
      });
      return response;
    }
  );

  return {
    delete: trigger,
    isDeleting: isMutating,
    error: error as AxiosError | null,
  };
};
