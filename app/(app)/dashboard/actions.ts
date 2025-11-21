"use server";

import { getSession } from "@/app/actions";
import { API_URL } from "@/constants";
import { IInventoryResponse, InventoryType } from "@/types/inventories.type";
import { IBaseOptionParams } from "@/types/response.types";
import { buildUrlWithParams } from "@/utils/api.util";

export const getSummary = async () => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/dashboard/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    const jsonRes = await res.json();
    if (jsonRes.status === 400) {
      throw Error(
        JSON.stringify({
          message: jsonRes.message,
          ok: false,
          status: 400,
          url: null,
        })
      );
    }
    if (jsonRes.status === 200) {
      return jsonRes;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("error", error.message);
      // throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const getInventoryByType = async (
  type: InventoryType
): Promise<{
  status: number;
  data: {
    data: IInventoryResponse[];
    meta: { page: number; limit: number; total: number; count: number; totalPages: number } | null;
  };
}> => {
  const user = await getSession();
  try {
    const res = await fetch(`${API_URL}/inventories/type/${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
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
      return { status: 500, data: { data: [], meta: null } };
      // throw new Error(error.message);
    } else {
      return { status: 500, data: { data: [], meta: null } };
    }
  }
};

export const getInventories = async (
  options?: IBaseOptionParams & { type?: InventoryType }
): Promise<{
  status: number;
  data: {
    data: IInventoryResponse[];
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
        Authorization: `Bearer ${user.accessToken}`,
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
