import { AssignRoleRequest } from "@/types/requests/role.request";
import { prisma } from "@/libs/prisma";

export const assignUserRole = async ({ userId, roleId }: AssignRoleRequest) => {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw new Error("Role not found");

  return prisma.profile.update({
    where: { id: userId },
    data: { roleCode: role.code },
  });
};
