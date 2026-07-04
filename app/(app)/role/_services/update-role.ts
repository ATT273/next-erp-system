import { prisma } from "@/libs/prisma";
import { IUpdateRoleRequest } from "@/types/requests/role.request";

export const updateRole = async (data: IUpdateRoleRequest) => {
  const { id, ...rest } = data;

  return prisma.role.update({
    where: { id },
    data: rest,
  });
};
