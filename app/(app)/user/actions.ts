"use server";

import { IFormUser, IUserResponse } from "@/types/user.type";
import { getUsersList } from "./_services/get-users-list";
import { getUserDetails as getUserDetailsService } from "./_services/get-user-details";
import { createUser as createUserService } from "./_services/create-user";
import { updateUser as updateUserService } from "./_services/update-user";
import { deleteUser as deleteUserService } from "./_services/delete-user";
import { resetUserPassword as resetUserPasswordService } from "./_services/reset-user-password";

export const getUsers = async (): Promise<{ status: number; data: IUserResponse[] | null }> => {
  try {
    const data = await getUsersList();
    return { status: 200, data };
  } catch (error) {
    console.log("error", error);
    return { status: 500, data: null };
  }
};

export const getUserDetails = async (id: string): Promise<{ status: number; data: IUserResponse | null }> => {
  try {
    const data = await getUserDetailsService(id);
    if (!data) return { status: 404, data: null };
    return { status: 200, data };
  } catch (error) {
    console.log("error", error);
    return { status: 500, data: null };
  }
};

export const createUser = async (data: IFormUser): Promise<{ status: number; message: string }> => {
  try {
    const result = await createUserService(data);
    if (!result.success) return { status: 400, message: result.message };
    return { status: 200, message: result.message };
  } catch (error) {
    console.log("error", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

export const updateUser = async (id: string, data: IFormUser): Promise<{ status: number; message: string }> => {
  try {
    const result = await updateUserService(id, data);
    if (!result.success) return { status: 400, message: result.message };
    return { status: 200, message: result.message };
  } catch (error) {
    console.log("error", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

export const deleteUser = async (id: string): Promise<{ status: number; message: string }> => {
  try {
    const result = await deleteUserService(id);
    if (!result.success) return { status: 400, message: result.message };
    return { status: 200, message: result.message };
  } catch (error) {
    console.log("error", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

export const resetUserPassword = async (data: { id: string; password: string }): Promise<{ status: number; message: string }> => {
  try {
    const result = await resetUserPasswordService(data.id, data.password);
    if (!result.success) return { status: 400, message: result.message };
    return { status: 200, message: result.message };
  } catch (error) {
    console.log("error", error);
    return { status: 500, message: "Internal Server Error" };
  }
};
