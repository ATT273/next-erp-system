import { ProductResponseType, ProductType } from "@/types/product.type";
import { create } from "zustand";
interface IState {
  selectedProductId: string;
  productDetails: ProductResponseType;
  setSelectedId: (id: string) => void;
  setProductDetails: (values: ProductResponseType) => void;
}
export const useProductStore = create<IState>((set) => ({
  selectedProductId: "",
  productDetails: {} as ProductResponseType,
  setSelectedId: (id: string) => set((state) => ({ ...state, selectedProductId: id })),
  setProductDetails: (values: ProductResponseType) => set((state) => ({ ...state, productDetails: values })),
}));
