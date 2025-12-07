import { z } from "zod";

export const formInfoSchema = z.object({
  skuId: z.string().min(1, {
    message: "Please select product sku",
  }),
  qtyChange: z.number().min(1, {
    message: "Quantity must be at least 1",
  }),
  note: z.string().optional(),
  changeType: z.string(),
});
