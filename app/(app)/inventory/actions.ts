"use server";
import { IInventoryListRequestParams, ICreateInventoryRequest } from "@/types/requests/inventory.request";
import { getInventoriesList } from "./_services/get-inventories-list";
import { createInventory as createInventoryService } from "./_services/create-inventory";
import { updateInventory as updateInventoryService } from "./_services/update-inventory";
import { deleteInventory as deleteInventoryService } from "./_services/delete-inventory";
import { getInventoryDetails as getInventoryDetailsService } from "./_services/get-inventory-details";

export const getInventories = async (params: IInventoryListRequestParams) => {
  const result = await getInventoriesList(params);
  return { data: result };
};

export const getInventoryDetails = async (id: string) => {
  try {
    const data = await getInventoryDetailsService(id);
    return { status: 200, message: "Success", data };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const createInventory = async (data: ICreateInventoryRequest) => {
  try {
    const result = await createInventoryService(data);
    return { status: 200, message: "Inventory created successfully", data: result };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const updateInventory = async (id: string, data: ICreateInventoryRequest) => {
  try {
    const result = await updateInventoryService(id, data);
    return { status: 200, message: "Inventory updated successfully", data: result };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const deleteInventory = async (id: string) => {
  try {
    await deleteInventoryService(id);
    return { status: 200, message: "Inventory deleted successfully", data: null };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};
