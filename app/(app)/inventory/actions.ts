"use server";
import { getSession } from "@/app/actions";
import { revalidatePath } from "next/cache";
import {
  IInventoryFilterParams,
  InventoryItem,
  InventoryType,
  IInventoryPayload,
  IResponseInventoryDetail,
} from "@/types/inventory.type";
import { buildUrlWithParams } from "@/utils/api.util";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "${API_URL}";

export const getInventories = async (
  options?: IInventoryFilterParams
): Promise<{
  status: number;
  data: {
    data: InventoryItem[];
    meta: { page: number; limit: number; total: number; count: number; totalPages: number } | null;
  };
}> => {
  const user = await getSession();

  // Build URL with query parameters from options
  const url = buildUrlWithParams(`${API_URL}/inventories`, options);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    const jsonRes = await res.json();
    if (jsonRes.status === 200) {
      return jsonRes;
    }
    return { status: jsonRes.status, data: { data: [], meta: null } };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error", error.message);
      return {
        status: 500,
        data: {
          data: [],
          meta: null,
        },
      };
      // throw new Error(error.message);
    } else {
      return { status: 500, data: { data: [], meta: null } };
    }
  }
};

export const createInventory = async (data: IInventoryPayload) => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/inventories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const jsonRes = await res.json();
    if (jsonRes.status === 200) {
      revalidatePath("/(app)/inventory", "page");
    }
    return jsonRes;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const deleteInventory = async (id: string): Promise<{ status: number; message: string }> => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/inventories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    const jsonRes: { status: number; message: string } = await res.json();
    return jsonRes;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const updateInventory = async (
  id: string,
  data: IInventoryPayload
): Promise<{
  data: IResponseInventoryDetail | undefined;
  status: number;
  message: string;
}> => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/inventories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const jsonRes = await res.json();
    if (jsonRes.status === 200) {
      revalidatePath("/(app)/inventory", "page");
    }
    return jsonRes;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const getInventoryDetails = async (
  id: string
): Promise<{
  data: IResponseInventoryDetail | undefined;
  status: number;
  message: string;
}> => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/inventories/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    const jsonRes = await res.json();
    return jsonRes;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
