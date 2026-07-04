import { prisma } from "@/libs/prisma";
import { IRoleListRequestParams } from "@/types/requests/role.request";
import { GetRolesListData, IGetRolesListResponse } from "@/types/responses/role.response";

export const getRolesList = async (params: IRoleListRequestParams): Promise<IGetRolesListResponse> => {
  const { limit, page, orderBy } = params;
  const skip = (page - 1) * limit;
  let order = {};
  if (orderBy) {
    order = { [orderBy.field]: orderBy.direction };
  }
  try {
    const [data, totalItems] = await prisma.$transaction([
      prisma.role.findMany({
        skip,
        take: limit,
        orderBy: orderBy ? order : undefined,
      }),
      prisma.role.count(),
    ]);
    const count = data.length;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.floor(skip / limit) + 1;
    const hasNextPage = currentPage < totalPages;
    const nextPage = hasNextPage ? currentPage + 1 : null;
    return {
      data: data as unknown as GetRolesListData[],
      meta: {
        totalPages,
        total: totalItems,
        page: currentPage,
        count,
        limit,
        hasNextPage,
        nextPage,
      },
      success: true,
      message: "Success to get roles data",
    };
  } catch (error) {
    console.error("ERROR: ", error);
    return {
      data: [],
      meta: null,
      success: false,
      message: "Fail to get roles data",
    };
  }
};
