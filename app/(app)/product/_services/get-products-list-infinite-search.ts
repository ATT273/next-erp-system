import { prisma } from "@/libs/prisma";
import { IProductListInfiniteSearchRequestParams } from "@/types/requests/product.request";
import {
  ProductDataResponseType,
  IProductInfiniteSearchResponse,
} from "@/types/responses/product.response";

export const getProductsListInfiniteSearch = async (
  params: IProductListInfiniteSearchRequestParams,
): Promise<IProductInfiniteSearchResponse> => {
  const { limit, cursor, orderBy } = params;

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
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        take: limit,
        orderBy: orderBy ? order : undefined,
      }),
      prisma.product.count(),
    ]);
    const count = data.length;
    const hasNextPage = count === limit;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;
    return {
      data: data as unknown as ProductDataResponseType[],
      meta: {
        total: totalItems,
        count,
        limit,
        hasNextPage,
        nextCursor,
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
