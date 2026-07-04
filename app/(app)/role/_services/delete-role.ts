import { prisma } from "@/libs/prisma";

export const deleteRole = async (id: string) => {
  return prisma.role.delete({
    where: { id },
  });
};
