import currentStockApi, {
  StockIdentifier,
} from "@/api/stock-management/current-stock.api";
import { ApiResponse } from "@/types/api.type";
import {
  CreateCurrentStockDTO,
  CurrentStock,
  UpdateCurrentStockDTO,
} from "@/types/stock-management/current-stock.dto";
import { AxiosError } from "axios";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

const CURRENT_STOCK_KEY = "current-stock";

// Types
type UseCurrentStocksReturn = {
  stocks: CurrentStock[];
  isLoading: boolean;
  error: AxiosError | null;
};

type UseCurrentStockReturn = {
  stock: CurrentStock | null;
  isLoading: boolean;
  error: AxiosError | null;
};

type CreateMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  createStock: (
    data: CreateCurrentStockDTO
  ) => Promise<ApiResponse<CurrentStock>>;
};

type UpdateMutationReturn = {
  stock: CurrentStock | null;
  updateStock: (
    data: Omit<UpdateCurrentStockDTO, keyof StockIdentifier>
  ) => Promise<ApiResponse<CurrentStock>>;
  isLoading: boolean;
  isFetching: boolean;
  error: AxiosError | null;
};

type DeleteMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  deleteStock: () => Promise<ApiResponse<void>>;
};

// Key generators
const getCurrentStocksKey = () => CURRENT_STOCK_KEY;
const getCurrentStockKey = (identifier: StockIdentifier) =>
  `${CURRENT_STOCK_KEY}/${identifier.locationId}/${identifier.purchaseItemId}`;
const getStocksByProductKey = (productId: string) =>
  `${CURRENT_STOCK_KEY}/by-product/${productId}`;
const getStocksByLocationAndProductKey = (
  locationId: string,
  productId: string
) => `${CURRENT_STOCK_KEY}/location/${locationId}/product/${productId}`;
const getStocksByLocationAndVariantKey = (
  locationId: string,
  variantId: string
) => `${CURRENT_STOCK_KEY}/location/${locationId}/variant/${variantId}`;

export const useCurrentStocks = (): UseCurrentStocksReturn => {
  const { data, error, isLoading } = useSWR(
    getCurrentStocksKey(),
    () => currentStockApi.getAll(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    stocks: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useCurrentStock = (
  identifier: StockIdentifier
): UseCurrentStockReturn => {
  const { data, error, isLoading } = useSWR(
    getCurrentStockKey(identifier),
    () => currentStockApi.getById(identifier),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    stock: data?.data ?? null,
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useStocksByProduct = (
  productId: string
): UseCurrentStocksReturn => {
  const { data, error, isLoading } = useSWR(
    getStocksByProductKey(productId),
    () => currentStockApi.getByProduct(productId),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    stocks: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useStocksByLocationAndProduct = (
  locationId: string,
  productId: string
): UseCurrentStocksReturn => {
  const { data, error, isLoading } = useSWR(
    getStocksByLocationAndProductKey(locationId, productId),
    () => currentStockApi.getByLocationAndProduct({ locationId, productId }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    stocks: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useStocksByLocationAndVariant = (
  locationId: string,
  variantId: string
): UseCurrentStocksReturn => {
  const { data, error, isLoading } = useSWR(
    getStocksByLocationAndVariantKey(locationId, variantId),
    () => currentStockApi.getByLocationAndVariant({ locationId, variantId }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    stocks: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useCreateCurrentStock = (): CreateMutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    CURRENT_STOCK_KEY,
    async (_key: string, { arg }: { arg: CreateCurrentStockDTO }) => {
      const response = await currentStockApi.create(arg);
      await mutate(getCurrentStocksKey());
      return response;
    }
  );

  return {
    createStock: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};

export const useUpdateCurrentStock = (
  identifier: StockIdentifier
): UpdateMutationReturn => {
  const { mutate } = useSWRConfig();

  const {
    data: stockData,
    error: fetchError,
    isLoading: isFetching,
  } = useSWR(
    getCurrentStockKey(identifier),
    () => currentStockApi.getById(identifier),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const {
    trigger,
    error: mutationError,
    isMutating,
  } = useSWRMutation(
    getCurrentStockKey(identifier),
    async (
      _key: string,
      { arg }: { arg: Omit<UpdateCurrentStockDTO, keyof StockIdentifier> }
    ) => {
      const response = await currentStockApi.update(identifier, arg);
      await Promise.all([
        mutate(getCurrentStockKey(identifier)),
        mutate(getCurrentStocksKey()),
      ]);
      return response;
    }
  );

  return {
    stock: stockData?.data ?? null,
    updateStock: trigger,
    isLoading: isMutating,
    isFetching,
    error: (mutationError || fetchError) as AxiosError | null,
  };
};

export const useDeleteCurrentStock = (
  identifier: StockIdentifier
): DeleteMutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getCurrentStockKey(identifier),
    async () => {
      const response = await currentStockApi.delete(identifier);
      await mutate(getCurrentStocksKey());
      return response;
    }
  );

  return {
    deleteStock: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};
