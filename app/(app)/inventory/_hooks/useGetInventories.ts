import { useState } from "react";
import { getInventories } from "../actions";
import { InventoryType } from "@/types/inventory.type";
import { IBaseOptionParams } from "@/types/response.types";
import { DEFAULT_META } from "@/constants/response.constants";
import { useQuery } from "@tanstack/react-query";

interface UseGetInventoriesProps {
  params?: IBaseOptionParams & { type?: InventoryType };
  options?: {
    enabled?: boolean;
  };
}
export const INVENTORY_QUERY_KEY = "inventoriesData";
const useGetInventories = ({ params, options }: UseGetInventoriesProps) => {
  const [keyword, setKeyword] = useState<string>("");
  const { enabled } = options || {};

  const { data, isFetching, refetch } = useQuery({
    queryKey: [INVENTORY_QUERY_KEY, params],
    queryFn: async () => {
      const res = await getInventories(params);
      return res;
    },
    enabled: enabled ?? true,
  });

  return {
    inventoriesData: data?.data.data || [],
    meta: data?.data?.meta || DEFAULT_META,
    keyword,
    isFetchingInventories: isFetching,
    refetchInventories: refetch,
    setKeyword,
  };
};

export default useGetInventories;
