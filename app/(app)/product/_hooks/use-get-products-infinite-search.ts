import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductsInfiniteSearch } from "../actions";
import { ProductType } from "@/types/product.type";
import { LIMIT } from "@/constants/response.constants";

export const GET_PRODUCTS_QUERY_KEY = "products-infinite-search";

const useGetProductsInfiniteSearch = () => {
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: [GET_PRODUCTS_QUERY_KEY],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getProductsInfiniteSearch({ limit: LIMIT, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data.meta?.nextCursor ?? undefined,
  });

  const productsData: ProductType[] = (data?.pages.flatMap((page) => page.data.data) as unknown as ProductType[]) ?? [];

  return {
    productsData,
    isLoading,
    isFetching,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    refetch,
  };
};

export default useGetProductsInfiniteSearch;
