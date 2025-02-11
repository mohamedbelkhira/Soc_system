import storeSalesApi from "@/api/sales/store-sale.api";
import {
  EmbeddedCreateStoreSaleDTO,
  EmbeddedUpdateStoreSaleDTO,
  StoreSale,
} from "@/types/sales/store-sale.dto";
import {
  UseCreate,
  UseDelete,
  UseFetchAndUpdate,
  UseItem,
  UsePaginatedItems,
} from "@/types/swr.type";
import { AxiosError } from "axios";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

const STORE_SALES_KEY = "store-sales";
const LOW_STOCK_KEY = "low-stock";
const getPaginatedStoreSalesKey = (searchParams: URLSearchParams) => {
  return `${STORE_SALES_KEY}?${searchParams.toString()}`;
};

const getStoreSalesKey = () => {
  return `${STORE_SALES_KEY}`;
};

const getStoreSaleKey = (id: string) => `${STORE_SALES_KEY}/${id}`;

export const useStoreSales = (
  searchParams: URLSearchParams
): UsePaginatedItems<StoreSale> => {
  const { data, error, isLoading } = useSWR(
    getPaginatedStoreSalesKey(searchParams),
    () => storeSalesApi.getAll(searchParams),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data?.data.items ?? [],
    totalPages: data?.data.meta.totalPages ?? 0,
    totalCount: data?.data.meta.total ?? 0,
    currentPage: data?.data.meta.page ?? 1,
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useStoreSale = (id: string): UseItem<StoreSale> => {
  const { data, error, isLoading } = useSWR(
    getStoreSaleKey(id),
    () => storeSalesApi.getById(id),
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

export const useCreateStoreSale = (): UseCreate<
  StoreSale,
  EmbeddedCreateStoreSaleDTO
> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    STORE_SALES_KEY,
    async (_key: string, { arg }: { arg: EmbeddedCreateStoreSaleDTO }) => {
      const response = await storeSalesApi.create(arg);
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(STORE_SALES_KEY);
      });
      await mutate(LOW_STOCK_KEY);
      return response;
    }
  );

  return {
    create: trigger,
    isCreating: isMutating,
    error: error as AxiosError | null,
  };
};

export const useFetchAndUpdateStoreSale = (
  id: string
): UseFetchAndUpdate<StoreSale, EmbeddedUpdateStoreSaleDTO> => {
  const { mutate } = useSWRConfig();

  const {
    data: storeSaleData,
    error: fetchError,
    isLoading: isFetching,
  } = useSWR(getStoreSaleKey(id), () => storeSalesApi.getById(id), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const {
    trigger,
    error: mutationError,
    isMutating,
  } = useSWRMutation(
    getStoreSaleKey(id),
    async (_key: string, { arg }: { arg: EmbeddedUpdateStoreSaleDTO }) => {
      const response = await storeSalesApi.update(id, arg);
      await mutate(
        (key: string) =>
          typeof key === "string" && key.startsWith(STORE_SALES_KEY)
      );
      await mutate(LOW_STOCK_KEY);
      return response;
    }
  );

  return {
    data: storeSaleData?.data ?? null,
    update: trigger,
    isLoading: isFetching,
    isUpdating: isMutating,
    error: (mutationError || fetchError) as AxiosError | null,
  };
};

export const useDeleteStoreSale = (id: string): UseDelete<StoreSale> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getStoreSaleKey(id),
    async () => {
      const response = await storeSalesApi.delete(id);
      await mutate((key) => {
        return typeof key === "string" && key.startsWith(getStoreSalesKey());
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
