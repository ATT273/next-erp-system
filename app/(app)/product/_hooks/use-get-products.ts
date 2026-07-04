import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../actions";
import { ProductType } from "@/types/product.type";
import { IBaseOptionParams, IResponseMeta } from "@/types/response.types";
import { DEFAULT_META } from "@/constants/response.constants";
import { ProductDataResponseType } from "@/types/responses/product.response";

export const GET_PRODUCTS_QUERY_KEY = "products";

const useGetProducts = () => {
  const [params, setParams] = useState<IBaseOptionParams>({ page: 1, limit: 5 });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [GET_PRODUCTS_QUERY_KEY, params],
    queryFn: () => getProducts(params),
  });

  const productsData: ProductDataResponseType[] = (data?.data?.data as unknown as ProductDataResponseType[]) ?? [];

  const meta: IResponseMeta = {
    page: data?.data?.meta?.page ?? DEFAULT_META.page,
    limit: data?.data?.meta?.limit ?? DEFAULT_META.limit,
    total: data?.data?.meta?.total ?? DEFAULT_META.total,
    count: data?.data?.meta?.count ?? DEFAULT_META.count,
    totalPages: data?.data?.meta?.totalPages ?? DEFAULT_META.totalPages,
    hasNextPage: data?.data?.meta?.hasNextPage ?? false,
    nextPage: data?.data?.meta?.nextPage ?? null,
  };

  const getProductsData = (options: IBaseOptionParams) => {
    setParams(options);
  };

  return {
    productsData,
    meta,
    isLoading,
    isFetching,
    getProductsData,
    refetch,
  };
};

export default useGetProducts;
