import { createAdminClient } from "@/libs/supabase/admin";

export const resetUserPassword = async (id: string, password: string): Promise<{ success: boolean; message: string }> => {
  const supabase = createAdminClient();

  const { error } = await supabase.auth.admin.updateUserById(id, { password });
  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Password reset successfully" };
};
