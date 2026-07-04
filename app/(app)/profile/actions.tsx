"use server";

import { prisma } from "@/libs/prisma";
import { resetUserPassword as resetUserPasswordService } from "@/app/(app)/user/_services/reset-user-password";

export const updateInfo = async (
  id: string,
  data: { name: string; dob: string },
): Promise<{ status: number; message: string }> => {
  try {
    await prisma.profile.update({
      where: { id },
      data: { name: data.name, dob: data.dob },
    });
    return { status: 200, message: "Info updated successfully" };
  } catch (error) {
    console.log("error", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

export const updatePassword = async (
  id: string,
  password: string,
): Promise<{ status: number; message: string }> => {
  try {
    const result = await resetUserPasswordService(id, password);
    if (!result.success) return { status: 400, message: result.message };
    return { status: 200, message: result.message };
  } catch (error) {
    console.log("error", error);
    return { status: 500, message: "Internal Server Error" };
  }
};
