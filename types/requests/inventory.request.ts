import { IPaginationRequest } from "./pagination.request";

export type InventoryChangeType = "SALES" | "IMPORT" | "ADJUSTMENT" | "RETURN";

export interface IInventoryListRequestParams extends IPaginationRequest {
  keyword?: string;
  type?: InventoryChangeType;
}

export interface ICreateInventoryRequest {
  skuId: string;
  changeType: InventoryChangeType;
  qtyChange: number;
  refOrderId?: string;
  note?: string;
}
