import { prisma } from "@/libs/prisma";
import { ICreateRoleRequest } from "@/types/requests/role.request";

export const createRole = async (data: ICreateRoleRequest) => {
  return prisma.role.create({
    data,
  });
};
