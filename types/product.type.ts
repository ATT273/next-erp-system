import { IResponseMeta } from "./response.types";

// RESPONSE TYPE FROM API
export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  mainCategory: number;
  subCategory: number;
  unit: string;
  qty: number;
  sizes: string[];
  importPrice: number;
  skus: IProductSku[];
  images: IProductImage[];
};

export interface IProductResponse {
  data: ProductType[];
  meta: IResponseMeta | null;
}

// PAYLOAD TYPE FOR CREATING/UPDATING PRODUCT
export type CreateProductType = {
  name: string;
  description: string;
  price: number;
  mainCategory: number;
  subCategory: number;
  unit: string;
  qty: number;
  sizes: string[];
  importPrice: number;
};

export interface IProductSku {
  id: string;
  sku: string;
  size: string;
  qty: number;
  price: number;
  images: IProductImage[];
}
export interface IProductImage {
  url: string;
  id?: string;
  name: string;
}

export type ClientImage = {
  id?: number;
  file?: File;
  url: string;
  name: string;
};

export interface IProductForm {
  name: string;
  mainCategory: string;
  subCategory: string;
  unit: string;
  price: number;
  importPrice: number;
  // qty: number;
  sizes?: string[];
  tags?: string[];
  description?: string;
}

export interface IProductPayload extends IProductForm {
  images: IProductImage[];
}
