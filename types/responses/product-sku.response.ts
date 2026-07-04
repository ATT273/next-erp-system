export interface IProductSKUImage {
  url: string;
  id?: string;
  name: string;
  productImageId: number;
}

export type ClientImage = {
  id?: number;
  file?: File;
  url: string;
  name: string;
};

export interface IProductSku {
  id: string;
  sku: string;
  size: string;
  qty: number;
  price: number;
  images: IProductSKUImage[];
}
