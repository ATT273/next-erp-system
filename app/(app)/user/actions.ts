"use server";

import { getSession } from "@/app/actions";
import { IFormUser, IUserResponse } from "@/types/user.type";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "${API_URL}";
export const getUserDetails = async (id: string) => {
  const user = await getSession();
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
  if (!res || res.status !== 200) {
    throw new Error("User not found");
  }
  if (res.status === 200) {
    return res.json();
  }
};

export const getUsers = async (): Promise<{ status: number; data: IUserResponse[] | null }> => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    if (res.status === 200) {
      const response = await res.json();
      return {
        status: res.status,
        data: response.data,
      };
    }
    // Ensure a return statement for all code paths
    return {
      status: res.status,
      data: null,
    };
  } catch (error) {
    console.log("error", error);
    return {
      status: 500,
      data: null,
    };
  }
};

export const deleteUser = async (id: string): Promise<{ status: number; data: null }> => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    const jsonRes = await res.json();
    if (res.status === 200) {
      revalidatePath("/(app)/user", "page");
      return jsonRes;
    }
    throw new Error(jsonRes.message || "Failed to delete user");
  } catch (error) {
    console.log("error", error);
    return {
      status: 500,
      data: null,
    };
  }
};

export const createUser = async (data: IFormUser): Promise<{ status: number; code: string; message: string }> => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const jsonRes = await res.json();
    if (res.status === 201) {
      revalidatePath("/(app)/user", "page");
    }

    return { status: jsonRes.data.status, code: jsonRes.data.code, message: jsonRes.data.message };
  } catch (error) {
    console.log("error", error);
    return {
      status: 500,
      code: "INTERNAL_ERROR",
      message: "An unknown error occurred",
    };
  }
};

export const updateUser = async (
  id: string,
  data: IFormUser
): Promise<{ status: number; code: string; message: string }> => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const jsonRes = await res.json();
    if (res.status === 200) {
      revalidatePath("/(app)/user", "page");
    }
    return { status: jsonRes.data.status, code: jsonRes.data.code, message: jsonRes.data.message };
  } catch (error) {
    console.log("error", error);
    return {
      status: 500,
      code: "INTERNAL_ERROR",
      message: "An unknown error occurred",
    };
  }
};

export const resetUserPassword = async (data: { id: string; password: string }) => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/users/reset-password/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const jsonRes = await res.json();
    if (res.status === 200) {
      revalidatePath("/(app)/user", "page");
    }
    return { status: jsonRes.data.status, code: jsonRes.data.code, message: jsonRes.data.message };
  } catch (error) {
    console.log("error", error);
    return {
      status: 500,
      code: "INTERNAL_ERROR",
      message: "An unknown error occurred",
    };
  }
};
