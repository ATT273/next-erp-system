import { prisma } from "@/libs/prisma";
import { createAdminClient } from "@/libs/supabase/admin";

export const deleteUser = async (id: string): Promise<{ success: boolean; message: string }> => {
  const supabase = createAdminClient();

  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) {
    return { success: false, message: error.message };
  }

  await prisma.profile.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return { success: true, message: "User deleted successfully" };
};
