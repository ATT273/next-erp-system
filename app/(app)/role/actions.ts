"use server";

import { getSession } from "@/app/actions";
import { revalidatePath } from "next/cache";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "${API_URL}";

export const createRole = async (data: any) => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const jsonRes = await res.json();
    if (jsonRes.status === 200) {
      revalidatePath("/role", "page");
    }
    return { status: res.status, message: jsonRes.message, data: null };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const getRoleList = async () => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    const jsonRes = await res.json();
    if (jsonRes.status === 400) {
      throw Error(JSON.stringify({ message: jsonRes.message, ok: false, status: 400, url: null }));
    }
    if (jsonRes.status === 200) {
      const roles = jsonRes.data.map((item: any) => ({
        id: item._id,
        code: item.code,
        name: item.name,
        description: item.description,
        active: item.active,
        permissions: JSON.parse(item.permissions),
      }));
      return roles;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const updateRole = async (data: any) => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/roles/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const jsonRes = await res.json();
    if (jsonRes.status === 200) {
      revalidatePath("/role", "page");
    }
    return { status: res.status, message: jsonRes.message, data: jsonRes.data };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const deleteRole = async (id: string) => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    const jsonRes = await res.json();
    if (jsonRes.status === 200) {
      revalidatePath("/role", "page");
    }
    return { status: res.status, message: jsonRes.message, data: null };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};
