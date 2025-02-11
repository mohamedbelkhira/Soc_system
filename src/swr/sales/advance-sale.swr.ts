import advanceSalesApi from "@/api/sales/advance-sale.api";
import {
  AdvanceSale,
  EmbeddedCreateAdvanceSaleDTO,
  EmbeddedUpdateAdvanceSaleDTO,
} from "@/types/sales/advance-sale.dto";
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

const ADVANCE_SALES_KEY = "advance-sales";
const LOW_STOCK_KEY = "low-stock";

const getPaginatedAdvanceSalesKey = (searchParams: URLSearchParams) => {
  return `${ADVANCE_SALES_KEY}?${searchParams.toString()}`;
};

const getAdvanceSalesKey = () => {
  return `${ADVANCE_SALES_KEY}`;
};

const getAdvanceSaleKey = (id: string) => `${ADVANCE_SALES_KEY}/${id}`;

export const useAdvanceSales = (
  searchParams: URLSearchParams
): UsePaginatedItems<AdvanceSale> => {
  const { data, error, isLoading } = useSWR(
    getPaginatedAdvanceSalesKey(searchParams),
    () => advanceSalesApi.getAll(searchParams),
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

export const useAdvanceSale = (id: string): UseItem<AdvanceSale> => {
  const { data, error, isLoading } = useSWR(
    getAdvanceSaleKey(id),
    () => advanceSalesApi.getById(id),
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

export const useCreateAdvanceSale = (): UseCreate<
  AdvanceSale,
  EmbeddedCreateAdvanceSaleDTO
> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    ADVANCE_SALES_KEY,
    async (_key: string, { arg }: { arg: EmbeddedCreateAdvanceSaleDTO }) => {
      const response = await advanceSalesApi.create(arg);
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(ADVANCE_SALES_KEY);
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

export const useFetchAndUpdateAdvanceSale = (
  id: string
): UseFetchAndUpdate<AdvanceSale, EmbeddedUpdateAdvanceSaleDTO> => {
  const { mutate } = useSWRConfig();

  const {
    data: advanceSaleData,
    error: fetchError,
    isLoading: isFetching,
  } = useSWR(getAdvanceSaleKey(id), () => advanceSalesApi.getById(id), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const {
    trigger,
    error: mutationError,
    isMutating,
  } = useSWRMutation(
    getAdvanceSaleKey(id),
    async (_key: string, { arg }: { arg: EmbeddedUpdateAdvanceSaleDTO }) => {
      const response = await advanceSalesApi.update(id, arg);
      await mutate(
        (key: string) =>
          typeof key === "string" && key.startsWith(ADVANCE_SALES_KEY)
      );
      await mutate(LOW_STOCK_KEY);
      return response;
    }
  );

  return {
    data: advanceSaleData?.data ?? null,
    update: trigger,
    isLoading: isFetching,
    isUpdating: isMutating,
    error: (mutationError || fetchError) as AxiosError | null,
  };
};

export const useDeleteAdvanceSale = (id: string): UseDelete<AdvanceSale> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getAdvanceSaleKey(id),
    async () => {
      const response = await advanceSalesApi.delete(id);
      await mutate((key) => {
        return typeof key === "string" && key.startsWith(getAdvanceSalesKey());
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
