import { prisma } from "@/libs/prisma";
import { InventoryItemType } from "@/types/responses/inventory.response";

export const getInventoryDetails = async (id: string): Promise<InventoryItemType | null> => {
  const item = await prisma.inventory.findUnique({
    where: { id },
    include: {
      sku: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!item) return null;

  return {
    id: item.id,
    skuId: item.skuId,
    skuCode: item.sku.sku,
    productId: item.sku.productId,
    productName: item.sku.product.name,
    changeType: item.changeType as any,
    qtyChange: item.qtyChange,
    refOrderId: item.refOrderId,
    note: item.note,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};
