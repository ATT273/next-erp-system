import { prisma } from "@/libs/prisma";
import { IAssignPermissionsRequest } from "@/types/requests/role.request";

export const assignPermissionToRole = async ({ role, permissions }: IAssignPermissionsRequest) => {
  return prisma.role.update({
    where: { code: role },
    data: { permissions },
  });
};
