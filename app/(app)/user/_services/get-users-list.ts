import { prisma } from "@/libs/prisma";
import { IUserResponse } from "@/types/user.type";

export const getUsersList = async (): Promise<IUserResponse[]> => {
  const users = await prisma.profile.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    isOnline: u.isOnline,
    dob: u.dob ?? "",
    roleCode: u.roleCode,
  }));
};
