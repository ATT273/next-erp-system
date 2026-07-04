import { z } from "zod";

export const formProductSchema = z.object({
  name: z.string().min(6, {
    message: "Name must be at least 6 characters",
  }),
  mainCategory: z.string().min(1, {
    message: "please select main category",
  }),
  subCategory: z.string().min(1, {
    message: "Please select sub category",
  }),
  unit: z.string().min(1, {
    message: "Unit is required",
  }),
  price: z.number().min(1, { message: "Price is required" }),
  importPrice: z.number().min(1, { message: "Import price is required" }),
  // qty: z.number().min(1, { message: "Quantity is required" }),
  sizes: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export type IProductFormValues = z.infer<typeof formProductSchema>;
