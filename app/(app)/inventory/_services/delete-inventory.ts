import { prisma } from "@/libs/prisma";

export const deleteInventory = async (id: string) => {
  return prisma.inventory.delete({
    where: { id },
  });
};
