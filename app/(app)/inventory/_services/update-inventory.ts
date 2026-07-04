import { prisma } from "@/libs/prisma";
import { ICreateInventoryRequest } from "@/types/requests/inventory.request";

export const updateInventory = async (id: string, data: ICreateInventoryRequest) => {
  return prisma.inventory.update({
    where: { id },
    data: {
      skuId: data.skuId,
      changeType: data.changeType as any,
      qtyChange: data.qtyChange,
      refOrderId: data.refOrderId,
      note: data.note ?? "",
    },
  });
};
