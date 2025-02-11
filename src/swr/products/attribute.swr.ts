import attributesApi from "@/api/attribute.api";
import {
  Attribute,
  CreateAttributeDTO,
  UpdateAttributeDTO,
} from "@/types/attribute.dto";
import {
  UseCreate,
  UseDelete,
  UseItem,
  UseItems,
  UsePaginatedItems,
  UseUpdate,
} from "@/types/swr.type";
import { AxiosError } from "axios";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

const ATTRIBUTES_KEY = "attributes";

const getPaginatedAttributesKey = (params: URLSearchParams) => {
  return `${ATTRIBUTES_KEY}?${params.toString()}`;
};

const getAttributesKey = () => ATTRIBUTES_KEY;
const getAttributeKey = (id: string) => `${ATTRIBUTES_KEY}/${id}`;
const getActiveAttributesKey = () => `${ATTRIBUTES_KEY}/active`;

export const useAttributes = (
  params: URLSearchParams
): UsePaginatedItems<Attribute> => {
  const { data, error, isLoading } = useSWR(
    getPaginatedAttributesKey(params),
    () => attributesApi.getAll(params),
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

export const useAttribute = (id: string): UseItem<Attribute> => {
  const { data, error, isLoading } = useSWR(
    getAttributeKey(id),
    () => attributesApi.getById(id),
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

export const useActiveAttributes = (): UseItems<Attribute> => {
  const { data, error, isLoading } = useSWR(
    getActiveAttributesKey(),
    () => attributesApi.getActive(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useCreateAttribute = (): UseCreate<
  Attribute,
  CreateAttributeDTO
> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    ATTRIBUTES_KEY,
    async (_key: string, { arg }: { arg: CreateAttributeDTO }) => {
      const response = await attributesApi.create(arg);
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(getAttributesKey());
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

export const useUpdateAttribute = (
  id: string
): UseUpdate<Attribute, UpdateAttributeDTO> => {
  const { mutate } = useSWRConfig();

  const {
    trigger,
    error: mutationError,
    isMutating,
  } = useSWRMutation(
    getAttributeKey(id),
    async (_key: string, { arg }: { arg: UpdateAttributeDTO }) => {
      const response = await attributesApi.update(arg);
      await Promise.all([
        mutate(getAttributeKey(id)),
        await mutate((key: string) => {
          return typeof key === "string" && key.startsWith(getAttributesKey());
        }),
      ]);
      return response;
    }
  );

  return {
    update: trigger,
    isUpdating: isMutating,
    error: mutationError as AxiosError | null,
  };
};

export const useDeleteAttribute = (id: string): UseDelete<Attribute> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getAttributeKey(id),
    async () => {
      const response = await attributesApi.delete(id);
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(getAttributesKey());
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
