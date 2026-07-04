import { prisma } from "@/libs/prisma";

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};
