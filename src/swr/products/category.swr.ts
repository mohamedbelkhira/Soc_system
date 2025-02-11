import categoriesApi from "@/api/category.api";
import {
  Category,
  EmbeddedCreateCategoryDTO,
  EmbeddedUpdateCategoryDTO,
} from "@/types/category.dto";
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

const CATEGORIES_KEY = "categories";

const getPaginatedCategoriesKey = (params: URLSearchParams) => {
  return `${CATEGORIES_KEY}?${params.toString()}`;
};

const getCategoriesKey = () => CATEGORIES_KEY;
const getCategoryKey = (id: string) => `${CATEGORIES_KEY}/${id}`;
const getActiveCategoriesKey = () => `${CATEGORIES_KEY}/active`;

export const usePaginatedCategories = (
  params: URLSearchParams
): UsePaginatedItems<Category> => {
  const { data, error, isLoading } = useSWR(
    getPaginatedCategoriesKey(params),
    () => categoriesApi.getAllPaginated(params),
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

export const useCategories = (): UseItems<Category> => {
  const { data, error, isLoading } = useSWR(
    getCategoriesKey(),
    () => categoriesApi.getAll(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      keepPreviousData: true,
    }
  );

  return {
    data: data?.data.items ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useCategory = (id: string): UseItem<Category> => {
  const { data, error, isLoading } = useSWR(
    getCategoryKey(id),
    () => categoriesApi.getById(id),
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

export const useActiveCategories = (): UseItems<Category> => {
  const { data, error, isLoading } = useSWR(
    getActiveCategoriesKey(),
    () => categoriesApi.getActive(),
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

export const useCreateCategory = (): UseCreate<
  Category,
  EmbeddedCreateCategoryDTO
> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    CATEGORIES_KEY,
    async (_key: string, { arg }: { arg: EmbeddedCreateCategoryDTO }) => {
      const response = await categoriesApi.create(arg);
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(getCategoriesKey());
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

export const useUpdateCategory = (
  id: string
): UseUpdate<Category, EmbeddedUpdateCategoryDTO> => {
  const { mutate } = useSWRConfig();

  const {
    trigger,
    error: mutationError,
    isMutating,
  } = useSWRMutation(
    getCategoryKey(id),
    async (_key: string, { arg }: { arg: EmbeddedUpdateCategoryDTO }) => {
      const response = await categoriesApi.update(arg);
      await Promise.all([
        mutate(getCategoryKey(id)),
        await mutate((key: string) => {
          return typeof key === "string" && key.startsWith(getCategoriesKey());
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

export const useDeleteCategory = (id: string): UseDelete<Category> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getCategoryKey(id),
    async () => {
      const response = await categoriesApi.delete(id);
      await mutate((key: string) => {
        return typeof key === "string" && key.startsWith(getCategoriesKey());
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
