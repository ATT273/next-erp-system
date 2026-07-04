import { prisma } from "@/libs/prisma";
import { IProductSku } from "@/types/product.type";
import { Prisma } from "@/app/generated/prisma/client";

export const updateProductSku = async (productId: string, data: IProductSku[]) => {
  const toAddSkus = data.filter((sku) => !sku.id);
  const toUpdateSkus = data.filter((sku) => sku.id);
  const keepSkuIds = toUpdateSkus.map((sku) => sku.id);

  return prisma.$transaction([
    prisma.productSku.deleteMany({
      where: { productId, id: { notIn: keepSkuIds } },
    }),
    prisma.productSku.createMany({
      data: toAddSkus.map((sku) => ({
        productId,
        sku: sku.sku,
        price: sku.price,
        qty: sku.qty,
        images: (sku.images ?? []) as unknown as Prisma.InputJsonValue,
      })),
    }),
    ...toUpdateSkus.map((sku) =>
      prisma.productSku.update({
        where: { id: sku.id },
        data: {
          sku: sku.sku,
          price: sku.price,
          qty: sku.qty,
          images: (sku.images ?? []) as unknown as Prisma.InputJsonValue,
        },
      }),
    ),
  ]);
};
