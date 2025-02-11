import clientsApi from "@/api/clients/clients.api";
import {
  Client,
  CreateClientDTO,
  UpdateClientDTO,
} from "@/types/clients/client.dto";
import {
  UseCreate,
  UseDelete,
  UseFetchAndUpdate,
  UseItem,
  UsePaginatedItems,
  UseUpdate,
} from "@/types/swr.type";
import { AxiosError } from "axios";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

const CLIENTS_KEY = "clients";

const getPaginatedClientsKey = (params?: URLSearchParams) => {
  return `${CLIENTS_KEY}?${params?.toString()}`;
};
const getClientKey = (id: string) => `${CLIENTS_KEY}/${id}`;

export const useClients = (
  params?: URLSearchParams
): UsePaginatedItems<Client> => {
  const { data, error, isLoading } = useSWR(
    getPaginatedClientsKey(params),
    () => clientsApi.getAll(params),
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

export const useClient = (id: string): UseItem<Client> => {
  const { data, error, isLoading } = useSWR(
    getClientKey(id),
    () => clientsApi.getById({ id }),
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

export const useCreateClient = (): UseCreate<Client, CreateClientDTO> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    CLIENTS_KEY,
    async (_key: string, { arg }: { arg: CreateClientDTO }) => {
      const response = await clientsApi.create(arg);
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(CLIENTS_KEY);
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

export const useFetchAndUpdateClient = (
  id: string
): UseFetchAndUpdate<Client, UpdateClientDTO> => {
  const { mutate } = useSWRConfig();

  const {
    data: clientData,
    error: fetchError,
    isLoading: isFetching,
  } = useSWR(getClientKey(id), () => clientsApi.getById({ id }), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const {
    trigger,
    error: mutationError,
    isMutating,
  } = useSWRMutation(
    getClientKey(id),
    async (_key: string, { arg }: { arg: Omit<UpdateClientDTO, "id"> }) => {
      const response = await clientsApi.update({ id, ...arg });
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(CLIENTS_KEY);
      });
      return response;
    }
  );

  return {
    data: clientData?.data ?? null,
    update: trigger,
    isLoading: isFetching,
    isUpdating: isMutating,
    error: (mutationError || fetchError) as AxiosError | null,
  };
};

export const useUpdateClient = (
  id: string
): UseUpdate<Client, UpdateClientDTO> => {
  const { mutate } = useSWRConfig();

  const {
    trigger,
    error: mutationError,
    isMutating,
  } = useSWRMutation(
    getClientKey(id),
    async (_key: string, { arg }: { arg: Omit<UpdateClientDTO, "id"> }) => {
      const response = await clientsApi.update({ id, ...arg });
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(CLIENTS_KEY);
      });
      return response;
    }
  );

  return {
    update: trigger,
    isUpdating: isMutating,
    error: mutationError as AxiosError | null,
  };
};

export const useDeleteClient = (id: string): UseDelete<Client> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getClientKey(id),
    async () => {
      const response = await clientsApi.delete({ id });
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(CLIENTS_KEY);
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
