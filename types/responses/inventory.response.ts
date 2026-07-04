import { IResponseMeta } from "../response.types";
import { InventoryChangeType } from "../requests/inventory.request";

export interface InventoryItemType {
  id: string;
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  changeType: InventoryChangeType;
  qtyChange: number;
  refOrderId?: string | null;
  note?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetInventoriesListResponse {
  data: InventoryItemType[];
  meta: IResponseMeta | null;
  success: boolean;
  message: string;
}
