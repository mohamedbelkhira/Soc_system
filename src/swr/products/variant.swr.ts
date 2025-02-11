import variantsApi from "@/api/variants.api";
import {
  UseCreate,
  UseDelete,
  UseItem,
  UsePaginatedItems,
  UseUpdate,
} from "@/types/swr.type";
import {
  CreateVariantDTO,
  UpdateVariantDTO,
  Variant,
} from "@/types/variant.dto";
import { AxiosError } from "axios";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

const VARIANTS_KEY = "variants";
const PRODUCTS_KEY = "products";

const getVariantsKey = (productId: string) =>
  `${VARIANTS_KEY}/product/${productId}`;
const getPaginatedVariantsKey = (productId: string, params: URLSearchParams) =>
  `${VARIANTS_KEY}/product/${productId}?${params.toString()}`;
const getVariantKey = (id: string) => `${VARIANTS_KEY}/${id}`;

export const useProductVariants = (
  productId: string,
  params: URLSearchParams
): UsePaginatedItems<Variant> => {
  const { data, error, isLoading } = useSWR(
    getPaginatedVariantsKey(productId, params),
    () => variantsApi.getByProductId(productId, params),
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

export const useVariant = (id: string): UseItem<Variant> => {
  const { data, error, isLoading } = useSWR(
    getVariantKey(id),
    () => variantsApi.getById(id),
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

export const useCreateVariant = (): UseCreate<Variant, CreateVariantDTO> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    VARIANTS_KEY,
    async (_key: string, { arg }: { arg: CreateVariantDTO }) => {
      const response = await variantsApi.create(arg);
      await mutate((key) => {
        return typeof key === "string" && key.startsWith(PRODUCTS_KEY);
      });
      await mutate((key) => {
        return (
          typeof key === "string" &&
          key.startsWith(getVariantsKey(arg.productId))
        );
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

export const useUpdateVariant = (
  id: string
): UseUpdate<Variant, UpdateVariantDTO> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getVariantKey(id),
    async (_key: string, { arg }: { arg: UpdateVariantDTO }) => {
      const response = await variantsApi.update(id, arg);

      await Promise.all([
        mutate(
          (key) => typeof key === "string" && key.startsWith(VARIANTS_KEY)
        ),
        mutate(getVariantKey(id)),
        mutate(getVariantsKey(arg.productId)),
      ]);

      return response;
    }
  );

  return {
    update: trigger,
    isUpdating: isMutating,
    error: error as AxiosError | null,
  };
};
export const useDeleteVariant = (
  id: string,
  productId: string
): UseDelete<Variant> => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getVariantKey(id),
    async () => {
      const response = await variantsApi.delete(id);
      await mutate((key) => {
        return (
          typeof key === "string" && key.startsWith(getVariantsKey(productId))
        );
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
