import { prisma } from "@/libs/prisma";
import { IFormUser } from "@/types/user.type";

export const updateUser = async (id: string, data: IFormUser): Promise<{ success: boolean; message: string }> => {
  await prisma.profile.update({
    where: { id },
    data: {
      name: data.name,
      dob: data.dob,
      roleCode: data.roleCode,
    },
  });

  return { success: true, message: "User updated successfully" };
};
