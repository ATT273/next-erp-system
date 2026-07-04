import { INVENTORY_CHANGE_TYPES } from "@/constants/inventory.constants";
import { z } from "zod";

export const formInventorySchema = z.object({
  skuId: z.string().min(1, {
    message: "Please select product sku",
  }),
  qtyChange: z.number().min(1, {
    message: "Quantity must be at least 1",
  }),
  note: z.string().optional(),
  changeType: z.enum([
    INVENTORY_CHANGE_TYPES.SALES,
    INVENTORY_CHANGE_TYPES.IMPORT,
    INVENTORY_CHANGE_TYPES.ADJUSTMENT,
    INVENTORY_CHANGE_TYPES.RETURN,
  ]),
});

export type IInventoryFormValues = z.infer<typeof formInventorySchema>;
