import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { AxiosError } from "axios";
import {
  OnlineSaleChannel,
  CreateOnlineSaleChannelDTO,
  UpdateOnlineSaleChannelDTO,
} from "@/types/sales/online-sale-channel.dto";
import { ApiResponse } from "@/types/api.type";
import onlineSaleChannelsApi from "@/api/sales/online-sale-channel.api";

const ONLINE_SALE_CHANNELS_KEY = "onlineSaleChannels";

type UseOnlineSaleChannelsReturn = {
  onlineSaleChannels: OnlineSaleChannel[];
  isLoading: boolean;
  error: AxiosError | null;
};

type UseOnlineSaleChannelReturn = {
  onlineSaleChannel: OnlineSaleChannel | null;
  isLoading: boolean;
  error: AxiosError | null;
};

type CreateMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  createOnlineSaleChannel: (
    data: CreateOnlineSaleChannelDTO
  ) => Promise<ApiResponse<OnlineSaleChannel>>;
};

type UpdateMutationReturn = {
  onlineSaleChannel: OnlineSaleChannel | null;
  updateOnlineSaleChannel: (
    data: Omit<UpdateOnlineSaleChannelDTO, "id">
  ) => Promise<ApiResponse<OnlineSaleChannel>>;
  isLoading: boolean;
  isFetching: boolean;
  error: AxiosError | null;
};

type DeleteMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  deleteOnlineSaleChannel: () => Promise<ApiResponse<OnlineSaleChannel>>;
};

const getOnlineSaleChannelsKey = () => ONLINE_SALE_CHANNELS_KEY;
const getOnlineSaleChannelKey = (id: string) =>
  `${ONLINE_SALE_CHANNELS_KEY}/${id}`;

export const useOnlineSaleChannels = (): UseOnlineSaleChannelsReturn => {
  const { data, error, isLoading } = useSWR(
    getOnlineSaleChannelsKey(),
    () => onlineSaleChannelsApi.getAll(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    onlineSaleChannels: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useOnlineSaleChannel = (
  id: string
): UseOnlineSaleChannelReturn => {
  const { data, error, isLoading } = useSWR(
    getOnlineSaleChannelKey(id),
    () => onlineSaleChannelsApi.getById({ id }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    onlineSaleChannel: data?.data ?? null,
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useCreateOnlineSaleChannel = (): CreateMutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    ONLINE_SALE_CHANNELS_KEY,
    async (_key: string, { arg }: { arg: CreateOnlineSaleChannelDTO }) => {
      const response = await onlineSaleChannelsApi.create(arg);
      await mutate(getOnlineSaleChannelsKey());
      return response;
    }
  );

  return {
    createOnlineSaleChannel: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};

export const useUpdateOnlineSaleChannel = (
  id: string
): UpdateMutationReturn => {
  const { mutate } = useSWRConfig();

  const {
    data: onlineSaleChannelData,
    error: fetchError,
    isLoading: isFetching,
  } = useSWR(
    getOnlineSaleChannelKey(id),
    () => onlineSaleChannelsApi.getById({ id }),
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
    getOnlineSaleChannelKey(id),
    async (
      _key: string,
      { arg }: { arg: Omit<UpdateOnlineSaleChannelDTO, "id"> }
    ) => {
      const response = await onlineSaleChannelsApi.update({ id, ...arg });
      await Promise.all([
        mutate(getOnlineSaleChannelKey(id)),
        mutate(getOnlineSaleChannelsKey()),
      ]);
      return response;
    }
  );

  return {
    onlineSaleChannel: onlineSaleChannelData?.data ?? null,
    updateOnlineSaleChannel: trigger,
    isLoading: isMutating,
    isFetching,
    error: (mutationError || fetchError) as AxiosError | null,
  };
};

export const useDeleteOnlineSaleChannel = (
  id: string
): DeleteMutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getOnlineSaleChannelKey(id),
    async () => {
      const response = await onlineSaleChannelsApi.delete({ id });
      await mutate(getOnlineSaleChannelsKey());
      return response;
    }
  );

  return {
    deleteOnlineSaleChannel: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};
