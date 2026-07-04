import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInventories } from "../actions";
import { IInventoryListRequestParams } from "@/types/requests/inventory.request";
import { IResponseMeta } from "@/types/response.types";
import { DEFAULT_META } from "@/constants/response.constants";
import { InventoryItemType } from "@/types/responses/inventory.response";

export const INVENTORY_QUERY_KEY = "inventoriesData";

const useGetInventories = () => {
  const [params, setParams] = useState<IInventoryListRequestParams>({ page: 1, limit: 10 });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [INVENTORY_QUERY_KEY, params],
    queryFn: () => getInventories(params),
  });

  const inventoriesData: InventoryItemType[] = data?.data?.data ?? [];

  const meta: IResponseMeta = {
    page: data?.data?.meta?.page ?? DEFAULT_META.page,
    limit: data?.data?.meta?.limit ?? DEFAULT_META.limit,
    total: data?.data?.meta?.total ?? DEFAULT_META.total,
    count: data?.data?.meta?.count ?? DEFAULT_META.count,
    totalPages: data?.data?.meta?.totalPages ?? DEFAULT_META.totalPages,
    hasNextPage: data?.data?.meta?.hasNextPage ?? false,
    nextPage: data?.data?.meta?.nextPage ?? null,
  };

  const getInventoriesData = (options: IInventoryListRequestParams) => {
    setParams(options);
  };

  return {
    inventoriesData,
    meta,
    isLoading,
    isFetching,
    getInventoriesData,
    refetch,
  };
};

export default useGetInventories;
