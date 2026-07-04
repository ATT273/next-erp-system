import { prisma } from "@/libs/prisma";
import { createAdminClient } from "@/libs/supabase/admin";
import { IFormUser } from "@/types/user.type";

export const createUser = async (data: IFormUser): Promise<{ success: boolean; message: string }> => {
  const supabase = createAdminClient();

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: data.email,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return { success: false, message: authError?.message ?? "Failed to create auth user" };
  }

  await prisma.profile.create({
    data: {
      id: authData.user.id,
      name: data.name,
      email: data.email,
      dob: data.dob,
      roleCode: data.roleCode,
      password: "",
    },
  });

  return { success: true, message: "User created successfully" };
};
