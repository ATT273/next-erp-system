import { getProductDetails } from "../actions";
import { useQuery } from "@tanstack/react-query";

const PRODUCT_DETAIL_QUERY_KEY = "product-details";

const useGetProductDetails = (id: string) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: [PRODUCT_DETAIL_QUERY_KEY, id],
    queryFn: () => getProductDetails(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  return {
    data: data?.data,
    isLoading,
    isFetching,
    error,
  };
};

export default useGetProductDetails;
