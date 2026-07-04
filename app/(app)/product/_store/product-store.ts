import { ProductDataResponseType, ProductType } from "@/types/product.type";
import { create } from "zustand";
interface IState {
  selectedProductId: string;
  productDetails: ProductDataResponseType;
  setSelectedId: (id: string) => void;
  setProductDetails: (values: ProductDataResponseType) => void;
}
export const useProductStore = create<IState>((set) => ({
  selectedProductId: "",
  productDetails: {} as ProductDataResponseType,
  setSelectedId: (id: string) => set((state) => ({ ...state, selectedProductId: id })),
  setProductDetails: (values: ProductDataResponseType) => set((state) => ({ ...state, productDetails: values })),
}));
