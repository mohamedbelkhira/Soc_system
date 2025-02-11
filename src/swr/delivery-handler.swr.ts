import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { AxiosError } from "axios";
import {
  DeliveryHandler,
  CreateDeliveryHandlerAPIPayload,
  UpdateDeliveryHandlerAPIPayload,
} from "@/types/deliveryHandler.dto";
import { ApiResponse } from "@/types/api.type";
import { deliveryHandlersApi } from "@/api/deliveryHandler.api";

const DELIVERY_HANDLERS_KEY = "delivery-handlers";

type UseDeliveryHandlersReturn = {
  deliveryHandlers: DeliveryHandler[];
  isLoading: boolean;
  error: AxiosError | null;
};

type UseDeliveryHandlerReturn = {
  deliveryHandler: DeliveryHandler | null;
  isLoading: boolean;
  error: AxiosError | null;
};

type CreateMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  createDeliveryHandler: (
    data: CreateDeliveryHandlerAPIPayload
  ) => Promise<ApiResponse<DeliveryHandler>>;
};

type UpdateMutationReturn = {
  deliveryHandler: DeliveryHandler | null;
  updateDeliveryHandler: (
    data: UpdateDeliveryHandlerAPIPayload
  ) => Promise<ApiResponse<DeliveryHandler>>;
  isLoading: boolean;
  isFetching: boolean;
  error: AxiosError | null;
};

type DeleteMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  deleteDeliveryHandler: () => Promise<ApiResponse<DeliveryHandler>>;
};

const getDeliveryHandlersKey = () => DELIVERY_HANDLERS_KEY;
const getDeliveryHandlerKey = (id: string) => `${DELIVERY_HANDLERS_KEY}/${id}`;

export const useDeliveryHandlers = (): UseDeliveryHandlersReturn => {
  const { data, error, isLoading } = useSWR(
    getDeliveryHandlersKey(),
    () => deliveryHandlersApi.getAll(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    deliveryHandlers: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useDeliveryHandler = (id: string): UseDeliveryHandlerReturn => {
  const { data, error, isLoading } = useSWR(
    getDeliveryHandlerKey(id),
    () => deliveryHandlersApi.getById(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    deliveryHandler: data?.data ?? null,
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useCreateDeliveryHandler = (): CreateMutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    DELIVERY_HANDLERS_KEY,
    async (_key: string, { arg }: { arg: CreateDeliveryHandlerAPIPayload }) => {
      const response = await deliveryHandlersApi.create(arg);
      await mutate(getDeliveryHandlersKey());
      return response;
    }
  );

  return {
    createDeliveryHandler: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};

export const useUpdateDeliveryHandler = (id: string): UpdateMutationReturn => {
  const { mutate } = useSWRConfig();

  const {
    data: deliveryHandlerData,
    error: fetchError,
    isLoading: isFetching,
  } = useSWR(getDeliveryHandlerKey(id), () => deliveryHandlersApi.getById(id), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const {
    trigger,
    error: mutationError,
    isMutating,
  } = useSWRMutation(
    getDeliveryHandlerKey(id),
    async (_key: string, { arg }: { arg: UpdateDeliveryHandlerAPIPayload }) => {
      const response = await deliveryHandlersApi.update(id, arg);
      await Promise.all([
        mutate(getDeliveryHandlerKey(id)),
        mutate(getDeliveryHandlersKey()),
      ]);
      return response;
    }
  );

  return {
    deliveryHandler: deliveryHandlerData?.data ?? null,
    updateDeliveryHandler: trigger,
    isLoading: isMutating,
    isFetching,
    error: (mutationError || fetchError) as AxiosError | null,
  };
};

export const useDeleteDeliveryHandler = (id: string): DeleteMutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getDeliveryHandlerKey(id),
    async () => {
      const response = await deliveryHandlersApi.delete(id);
      await mutate(getDeliveryHandlersKey());
      return response;
    }
  );

  return {
    deleteDeliveryHandler: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};
