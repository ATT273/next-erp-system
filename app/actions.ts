"use server";
import { ISession } from "@/types/auth.types";
import { createClient } from "@/libs/supabase/server";
import { prisma } from "@/libs/prisma";

export const getSession = async (): Promise<ISession | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { role: true },
  });

  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    roleCode: profile.roleCode,
    roleActive: profile.role.active,
    permissions: profile.role.permissions as ISession["permissions"],
  };
};
