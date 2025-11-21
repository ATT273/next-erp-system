export type InventoryType = "TOTAL" | "IMPORT" | "EXPORT" | "SALES";

export interface IInventoryResponse {
  id: string;
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  changeType: string;
  qtyChange: number;
  refOrderId?: string;
  note?: string;
}

export interface ISummaryItem {
  key: InventoryType;
  title: string;
  icon: React.ReactNode;
  value: number;
}
