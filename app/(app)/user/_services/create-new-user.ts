import { prisma } from "@/libs/prisma";
import { CreateUserRequest } from "@/types/requests/user.request";
import { UserResponse, UserServiceResponse } from "@/types/responses/user.response";

export const createNewUser = async (data: CreateUserRequest): Promise<UserServiceResponse> => {
  try {
    const result = await prisma.profile.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email!,
        dob: data.dob,
        roleCode: data.roleCode,
        password: "",
      },
    });
    return {
      data: result,
      success: true,
      errorMessage: null,
    };
  } catch (error) {
    console.error("ERROR: ", error);
    return {
      data: null,
      success: false,
      errorMessage: "There is error while creating new user",
    };
  }
};
