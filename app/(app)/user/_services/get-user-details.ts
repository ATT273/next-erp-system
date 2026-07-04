import { prisma } from "@/libs/prisma";
import { IUserResponse } from "@/types/user.type";

export const getUserDetails = async (id: string): Promise<IUserResponse | null> => {
  const user = await prisma.profile.findUnique({
    where: { id, deletedAt: null },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isOnline: user.isOnline,
    dob: user.dob ?? "",
    roleCode: user.roleCode,
  };
};
