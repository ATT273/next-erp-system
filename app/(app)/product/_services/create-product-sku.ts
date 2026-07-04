import { prisma } from "@/libs/prisma";
import { IProductSku } from "@/types/product.type";

export const createProductSku = async (productId: string, data: IProductSku[]) => {
  return prisma.productSku.createMany({
    data: data.map((sku) => ({
      productId,
      sku: sku.sku,
      price: sku.price,
      qty: sku.qty,
      images: sku.images ?? [],
    })),
  });
};
