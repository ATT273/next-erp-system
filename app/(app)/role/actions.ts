"use server";

import { IBaseOptionParams } from "@/types/response.types";
import { revalidatePath } from "next/cache";
import { getRolesList } from "./_services/get-roles-list";
import { assignPermissionToRole as assignPermissionToRoleService } from "./_services/assign-permission-to-role";
import { updateRole as updateRoleService } from "./_services/update-role";
import { createRole as createRoleService } from "./_services/create-role";
import { deleteRole as deleteRoleService } from "./_services/delete-role";
import { ICreateRoleRequest, IAssignPermissionsRequest, IUpdateRoleRequest } from "@/types/requests/role.request";

export const getRoles = async (params: IBaseOptionParams) => {
  const result = await getRolesList(params);
  return { data: result };
};

export const createRole = async (data: ICreateRoleRequest) => {
  try {
    const result = await createRoleService(data);
    revalidatePath("/role", "page");
    return { status: 200, message: "Role created successfully", data: result };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const assignPermissionToRole = async (data: IAssignPermissionsRequest) => {
  try {
    const result = await assignPermissionToRoleService(data);
    revalidatePath("/role", "page");
    return { status: 200, message: "Permissions assigned successfully", data: result };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const updateRole = async (data: IUpdateRoleRequest) => {
  try {
    const result = await updateRoleService(data);
    revalidatePath("/role", "page");
    return { status: 200, message: "Role updated successfully", data: result };
  } catch (error) {
    console.log("error", error);
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const deleteRole = async (id: string) => {
  try {
    await deleteRoleService(id);
    revalidatePath("/role", "page");
    return { status: 200, message: "Role deleted successfully", data: null };
  } catch (error) {
    return { status: 500, message: "Internal Server Error", data: null };
  }
};
