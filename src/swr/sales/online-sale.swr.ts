import onlineSalesApi from "@/api/sales/online-sale.api";
import {
  EmbeddedCreateOnlineSaleDTO,
  EmbeddedUpdateOnlineSaleDTO,
  OnlineSale,
} from "@/types/sales/online-sale.dto";
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

const ONLINE_SALES_KEY = "online-sales";
const LOW_STOCK_KEY = "low-stock";

const getPaginatedOnlineSalesKey = (searchParams: URLSearchParams) => {
  return `${ONLINE_SALES_KEY}?${searchParams.toString()}`;
};

const getOnlineSalesKey = () => {
  return `${ONLINE_SALES_KEY}`;
};

const getOnlineSaleKey = (id: string) => `${ONLINE_SALES_KEY}/${id}`;

export const useOnlineSales = (
  searchParams: URLSearchParams
): UsePaginatedItems<OnlineSale> => {
  const { data, error, isLoading } = useSWR(
    getPaginatedOnlineSalesKey(searchParams),
    () => onlineSalesApi.getAll(searchParams),
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

export const useOnlineSale = (id: string): UseItem<OnlineSale> => {
  const { data, error, isLoading } = useSWR(
    getOnlineSaleKey(id),
    () => onlineSalesApi.getById(id),
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

export const useCreateOnlineSale = (): UseCreate<
  OnlineSale,
  EmbeddedCreateOnlineSaleDTO
> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    ONLINE_SALES_KEY,
    async (_key: string, { arg }: { arg: EmbeddedCreateOnlineSaleDTO }) => {
      const response = await onlineSalesApi.create(arg);
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(ONLINE_SALES_KEY);
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

export const useUpdateOnlineSale = (
  id: string
): UseFetchAndUpdate<OnlineSale, EmbeddedUpdateOnlineSaleDTO> => {
  const { mutate } = useSWRConfig();

  const {
    data: onlineSaleData,
    error: fetchError,
    isLoading: isFetching,
  } = useSWR(getOnlineSaleKey(id), () => onlineSalesApi.getById(id), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const {
    trigger,
    error: mutationError,
    isMutating,
  } = useSWRMutation(
    getOnlineSaleKey(id),
    async (_key: string, { arg }: { arg: EmbeddedUpdateOnlineSaleDTO }) => {
      const response = await onlineSalesApi.update(id, arg);
      await mutate(
        (key: string) =>
          typeof key === "string" && key.startsWith(ONLINE_SALES_KEY)
      );
      await mutate(LOW_STOCK_KEY);
      return response;
    }
  );

  return {
    data: onlineSaleData?.data ?? null,
    update: trigger,
    isLoading: isFetching,
    isUpdating: isMutating,
    error: (mutationError || fetchError) as AxiosError | null,
  };
};

export const useDeleteOnlineSale = (id: string): UseDelete<OnlineSale> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getOnlineSaleKey(id),
    async () => {
      const response = await onlineSalesApi.delete(id);
      await mutate((key) => {
        return typeof key === "string" && key.startsWith(getOnlineSalesKey());
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
