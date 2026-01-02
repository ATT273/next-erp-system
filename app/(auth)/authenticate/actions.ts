"use server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const signUp = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}): Promise<{ status: number; message: string }> => {
  try {
    const cookie = await cookies();
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const jsonRes = await res.json();

    if (jsonRes.status === 200) {
      const _session = JSON.stringify(jsonRes);
      cookie.set("session", _session, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 1, // One day
        path: "/",
      });
    }
    return { status: jsonRes.status, message: jsonRes.message };
  } catch (error) {
    console.log("error", error);
    return {
      status: 500,
      message: "Unknown server error",
    };
  }
};
export const logIn = async ({ email, password }: { email: string; password: string }) => {
  try {
    const cookie = await cookies();
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const jsonRes = await res.json();
    if (jsonRes.status === 400) {
      return { message: jsonRes.message, ok: false, status: 400, url: null };
    }
    if (jsonRes.status === 200) {
      const permissions = jsonRes.data.permissions ? JSON.parse(jsonRes.data.permissions) : {};
      const _session = JSON.stringify({ ...jsonRes.data, permissions });
      cookie.set("session", _session, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 1, // One day
        path: "/",
      });
      return jsonRes;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const logOut = async () => {
  try {
    const cookie = await cookies();
    cookie.delete("session");
  } catch (error) {
    console.log("error", error);
  }
};
