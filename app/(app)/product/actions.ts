"use server";
import { IProductForm, IProductSku } from "@/types/product.type";
import { getProductsList } from "./_services/get-products-list";
import { getProductsListInfiniteSearch as getProductsInfiniteSearchService } from "./_services/get-products-list-infinite-search";
import { createProduct as createProductService } from "./_services/create-product";
import { updateProduct as updateProductService } from "./_services/update-product";
import { deleteProduct as deleteProductService } from "./_services/delete-product";
import { getProductDetails as getProductDetailsService } from "./_services/get-product-details";
import { createProductSku as createProductSkuService } from "./_services/create-product-sku";
import { updateProductSku as updateProductSkuService } from "./_services/update-product-sku";
import {
  IProductListRequestParams,
  IProductListInfiniteSearchRequestParams,
  IProductPayloadRequest,
} from "@/types/requests/product.request";

export const getProducts = async (params: IProductListRequestParams) => {
  const result = await getProductsList(params);
  return { data: result };
};

export const getProductsInfiniteSearch = async (params: IProductListInfiniteSearchRequestParams) => {
  const result = await getProductsInfiniteSearchService(params);
  return { data: result };
};

export const getProductDetails = async (id: string) => {
  try {
    const data = await getProductDetailsService(id);
    return { status: 200, message: "Success", data };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const createProduct = async (data: IProductForm) => {
  try {
    const result = await createProductService(data);
    return { status: 200, message: "Product created successfully", data: result };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const updateProduct = async (id: string, data: IProductPayloadRequest) => {
  try {
    const result = await updateProductService(id, data);
    return { status: 200, message: "Product updated successfully", data: result };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteProductService(id);
    return { status: 200, message: "Product deleted successfully", data: null };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const createProductSku = async (productId: string, data: IProductSku[]) => {
  try {
    const result = await createProductSkuService(productId, data);
    return { status: 200, message: "Product SKUs created successfully", data: result };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const updateProductSku = async (productId: string, data: IProductSku[]) => {
  try {
    const result = await updateProductSkuService(productId, data);
    return { status: 200, message: "Product SKUs updated successfully", data: result };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};
