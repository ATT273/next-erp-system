import { InventoryItem, IResponseInventoryDetail } from "@/types/inventory.type";
import { create } from "zustand";

interface IState {
  selectedInventoryId: string;
  inventoryDetails: IResponseInventoryDetail;
  setSelectedId: (id: string) => void;
  setInventoryDetails: (values: IResponseInventoryDetail) => void;
}
export const useInventoryStore = create<IState>((set) => ({
  selectedInventoryId: "",
  inventoryDetails: {} as IResponseInventoryDetail,
  setSelectedId: (id: string) => set((state) => ({ ...state, selectedInventoryId: id })),
  setInventoryDetails: (values: IResponseInventoryDetail) => set((state) => ({ ...state, inventoryDetails: values })),
}));
