"use server";
import { ISession } from "@/types/auth.types";
import { cookies } from "next/headers";

export const getSession = async (): Promise<ISession | null> => {
  const cookieStore = await cookies();
  if (cookieStore) {
    const session = cookieStore.get("session");
    if (session) {
      if (!session.value) return null;
      return JSON.parse(session.value);
    }
    return null;
  } else {
    return null;
  }
};
