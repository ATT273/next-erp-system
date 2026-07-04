import { prisma } from "@/libs/prisma";

export const updateUserOnlineStatus = async (id: string, isOnline: boolean) => {
  await prisma.profile.update({
    where: {
      id,
    },
    data: {
      isOnline,
    },
  });
};
