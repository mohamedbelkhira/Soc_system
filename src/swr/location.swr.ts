import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { AxiosError } from "axios";
import {
  Location,
  LocationType,
  CreateLocationDTO,
  UpdateLocationDTO,
} from "@/types/locations/location.dto";
import { ApiResponse } from "@/types/api.type";
import locationApi from "@/api/locations/locations.api";

const LOCATIONS_KEY = "locations";

type UseLocationsReturn = {
  locations: Location[];
  isLoading: boolean;
  error: AxiosError | null;
};

type UseLocationReturn = {
  location: Location | null;
  isLoading: boolean;
  error: AxiosError | null;
};

type UseActiveLocationsReturn = {
  locations: Location[];
  isLoading: boolean;
  error: AxiosError | null;
};

type UseLocationsByTypeReturn = {
  locations: Location[];
  isLoading: boolean;
  error: AxiosError | null;
};

type CreateMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  createLocation: (data: CreateLocationDTO) => Promise<ApiResponse<Location>>;
};

type UpdateMutationReturn = {
  location: Location | null;
  updateLocation: (
    data: Omit<UpdateLocationDTO, "id">
  ) => Promise<ApiResponse<Location>>;
  isLoading: boolean;
  isFetching: boolean;
  error: AxiosError | null;
};

type DeleteMutationReturn = {
  isLoading: boolean;
  error: AxiosError | null;
  deleteLocation: () => Promise<ApiResponse<void>>;
};

const getLocationsKey = () => LOCATIONS_KEY;
const getLocationKey = (id: string) => `${LOCATIONS_KEY}/${id}`;
const getActiveLocationsKey = () => `${LOCATIONS_KEY}/active`;
const getLocationsByTypeKey = (type: LocationType) =>
  `${LOCATIONS_KEY}/type/${type}`;

export const useLocations = (): UseLocationsReturn => {
  const { data, error, isLoading } = useSWR(
    getLocationsKey(),
    () => locationApi.getAll(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    locations: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useLocation = (id: string): UseLocationReturn => {
  const { data, error, isLoading } = useSWR(
    getLocationKey(id),
    () => locationApi.getById(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    location: data?.data ?? null,
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useActiveLocations = (): UseActiveLocationsReturn => {
  const { data, error, isLoading } = useSWR(
    getActiveLocationsKey(),
    () => locationApi.getActive(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    locations: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useLocationsByType = (
  type: LocationType
): UseLocationsByTypeReturn => {
  const { data, error, isLoading } = useSWR(
    getLocationsByTypeKey(type),
    () => locationApi.getByType(type),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    locations: data?.data ?? [],
    isLoading,
    error: error as AxiosError | null,
  };
};

export const useCreateLocation = (): CreateMutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    LOCATIONS_KEY,
    async (_key: string, { arg }: { arg: CreateLocationDTO }) => {
      const response = await locationApi.create(arg);
      await mutate(getLocationsKey());
      return response;
    }
  );

  return {
    createLocation: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};

export const useUpdateLocation = (id: string): UpdateMutationReturn => {
  const { mutate } = useSWRConfig();

  const {
    data: locationData,
    error: fetchError,
    isLoading: isFetching,
  } = useSWR(getLocationKey(id), () => locationApi.getById(id), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const {
    trigger,
    error: mutationError,
    isMutating,
  } = useSWRMutation(
    getLocationKey(id),
    async (_key: string, { arg }: { arg: Omit<UpdateLocationDTO, "id"> }) => {
      const response = await locationApi.update(id, arg);
      await Promise.all([
        mutate(getLocationKey(id)),
        mutate(getLocationsKey()),
      ]);
      return response;
    }
  );

  return {
    location: locationData?.data ?? null,
    updateLocation: trigger,
    isLoading: isMutating,
    isFetching,
    error: (mutationError || fetchError) as AxiosError | null,
  };
};

export const useDeleteLocation = (id: string): DeleteMutationReturn => {
  const { mutate } = useSWRConfig();
  const { trigger, error, isMutating } = useSWRMutation(
    getLocationKey(id),
    async () => {
      const response = await locationApi.delete(id);
      await mutate(getLocationsKey());
      return response;
    }
  );

  return {
    deleteLocation: trigger,
    isLoading: isMutating,
    error: error as AxiosError | null,
  };
};
