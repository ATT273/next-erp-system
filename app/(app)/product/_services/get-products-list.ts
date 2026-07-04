import { prisma } from "@/libs/prisma";
import { IProductListRequestParams } from "@/types/requests/product.request";
import { ProductDataResponseType, IProductResponse } from "@/types/responses/product.response";

export const getProductsList = async (params: IProductListRequestParams): Promise<IProductResponse> => {
  const { limit, page, orderBy } = params;
  const skip = (page - 1) * limit;
  let order = {};
  if (orderBy) {
    order = { [orderBy.field]: orderBy.direction };
  }
  try {
    const [data, totalItems] = await prisma.$transaction([
      prisma.product.findMany({
        include: {
          skus: true,
        },
        skip,
        take: limit,
        orderBy: orderBy ? order : undefined,
      }),
      prisma.product.count(),
    ]);
    const count = data.length;
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const nextPage = hasNextPage ? page + 1 : null;
    return {
      data: data as unknown as ProductDataResponseType[],
      meta: {
        totalPages,
        total: totalItems,
        page,
        count,
        limit,
        hasNextPage,
        nextPage,
      },
      success: true,
      message: "Success to get products data",
    };
  } catch (error) {
    console.error("ERROR: ", error);
    return {
      data: [],
      meta: null,
      success: false,
      message: "Fail to get products data",
    };
  }
};
