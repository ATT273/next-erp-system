export interface InventoryItem {
  id: string;
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  changeType: string;
  qtyChange: number;
  refOrderId?: string;
  description?: string;
  note?: string;
}

export interface InventoryResponse {
  data: InventoryItem[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPage: number;
    count: number;
  } | null;
}

export interface INewInventoryForm {
  skuId: string;
  qtyChange: number;
  note?: string;
  changeType: string;
}

export type InventoryType = "TOTAL" | "IMPORT" | "EXPORT" | "SALES";

export interface ISummaryItem {
  key: InventoryType;
  title: string;
  icon: React.ReactNode;
  value: number;
}

export interface IInventoryPayload {
  skuId: string;
  changeType: string;
  qtyChange: number;
  refOrderId?: string;
  note?: string;
}

export interface IInventoryFilterParams {
  page: number;
  limit: number;
  keyword?: string;
  type?: InventoryType;
}

export interface IResponseInventoryDetail {
  changeType: InventoryType;
  id: string;
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  qtyChange: number;
  refOrderId?: string;
  note?: string;
}
