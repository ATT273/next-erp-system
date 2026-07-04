import { prisma } from "@/libs/prisma";
import { IInventoryListRequestParams } from "@/types/requests/inventory.request";
import { IGetInventoriesListResponse, InventoryItemType } from "@/types/responses/inventory.response";

export const getInventoriesList = async (params: IInventoryListRequestParams): Promise<IGetInventoriesListResponse> => {
  const { limit, page, type } = params;
  const skip = (page - 1) * limit;

  try {
    const where = type && type !== "TOTAL" ? { changeType: type as any } : {};

    const [inventories, totalItems] = await prisma.$transaction([
      prisma.inventory.findMany({
        where,
        include: {
          sku: {
            include: {
              product: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.inventory.count({ where }),
    ]);

    const count = inventories.length;
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const nextPage = hasNextPage ? page + 1 : null;

    const data: InventoryItemType[] = inventories.map((item) => ({
      id: item.id,
      skuId: item.skuId,
      skuCode: item.sku.sku,
      productId: item.sku.productId,
      productName: item.sku.product.name,
      changeType: item.changeType as any,
      qtyChange: item.qtyChange,
      refOrderId: item.refOrderId,
      note: item.note,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return {
      data,
      meta: { page, limit, total: totalItems, count, totalPages, hasNextPage, nextPage },
      success: true,
      message: "Success to get inventories data",
    };
  } catch (error) {
    console.error("ERROR: ", error);
    return {
      data: [],
      meta: null,
      success: false,
      message: "Fail to get inventories data",
    };
  }
};
