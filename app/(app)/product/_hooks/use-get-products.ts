import { useState } from "react";
import { getProducts } from "../actions";
import { IProductResponse, ProductType } from "@/types/product.type";
import { IBaseOptionParams, IResponseMeta } from "@/types/response.types";
import { DEFAULT_META } from "@/constants/response.constants";

const useGetProducts = () => {
  const [productsData, setProductsData] = useState<ProductType[]>([]);
  const [meta, setMeta] = useState<IResponseMeta>(DEFAULT_META);

  const getProductsData = async (options: IBaseOptionParams) => {
    const { data } = await getProducts(options);

    setProductsData(data.data);
    const formattedMeta = {
      page: data.meta?.page ? Number(data.meta?.page) : DEFAULT_META.page,
      limit: data.meta?.limit ? Number(data.meta?.limit) : DEFAULT_META.limit,
      total: data.meta?.total ? Number(data.meta?.total) : DEFAULT_META.total,
      count: data.meta?.count ? Number(data.meta?.count) : DEFAULT_META.count,
      totalPages: data.meta?.totalPages ? Number(data.meta?.totalPages) : DEFAULT_META.totalPages,
    };

    setMeta(formattedMeta);
  };

  return {
    productsData: productsData || [],
    meta: meta || DEFAULT_META,
    getProductsData,
  };
};

export default useGetProducts;
