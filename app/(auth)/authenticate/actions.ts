"use server";
import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import { createNewUser } from "@/app/(app)/user/_services/create-new-user";
import { UserSignIn, UserSignUp } from "@/types/requests/user.request";
import { updateUserOnlineStatus } from "./_services/update-user-online-status";

// Email & Password
export async function signUp(formData: UserSignUp) {
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (error || !data.user) redirect("/error");
  const useData = {
    id: data.user.id,
    email: data.user.email,
    roleCode: "sadm",
    name: formData.name,
  };

  const result = await createNewUser(useData);

  if (!result.success) redirect("/error");
  return result;
}

export async function signIn(formData: UserSignIn) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) redirect("/error");

  const userId = data.user?.id;
  await updateUserOnlineStatus(userId, true);
  redirect("/dashboard");
}

export const logOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};
