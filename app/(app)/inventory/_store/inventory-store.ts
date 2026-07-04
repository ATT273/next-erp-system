import { InventoryItemType } from "@/types/responses/inventory.response";
import { create } from "zustand";

interface IState {
  selectedInventoryId: string;
  inventoryDetails: InventoryItemType | null;
  setSelectedId: (id: string) => void;
  setInventoryDetails: (values: InventoryItemType | null) => void;
}
export const useInventoryStore = create<IState>((set) => ({
  selectedInventoryId: "",
  inventoryDetails: null,
  setSelectedId: (id: string) => set((state) => ({ ...state, selectedInventoryId: id })),
  setInventoryDetails: (values) => set((state) => ({ ...state, inventoryDetails: values })),
}));
