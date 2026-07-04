import { prisma } from "@/libs/prisma";
import { ICreateInventoryRequest } from "@/types/requests/inventory.request";

export const createInventory = async (data: ICreateInventoryRequest) => {
  return prisma.inventory.create({
    data: {
      skuId: data.skuId,
      changeType: data.changeType as any,
      qtyChange: data.qtyChange,
      refOrderId: data.refOrderId,
      note: data.note ?? "",
    },
  });
};
