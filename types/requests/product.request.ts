import { IInfiniteSearchRequest, IPaginationRequest } from "./pagination.request";

export interface IProductListRequestParams extends IPaginationRequest {
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  };
}

export interface IProductListInfiniteSearchRequestParams extends IInfiniteSearchRequest {
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  };
}

export interface IProductForm {
  name: string;
  mainCategory: string;
  subCategory: string;
  unit: string;
  price: number;
  importPrice: number;
  sizes?: string[];
  tags?: string[];
  description?: string;
}

export interface IProductPayloadRequest extends IProductForm {
  images: IProductImage[];
}

export interface IProductImage {
  url: string;
  id?: number;
  name: string;
}
