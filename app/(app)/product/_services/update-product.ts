import { prisma } from "@/libs/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { IProductPayloadRequest } from "@/types/requests/product.request";

export const updateProduct = async (id: string, data: IProductPayloadRequest) => {
  return prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      mainCategory: data.mainCategory,
      subCategory: data.subCategory,
      unit: data.unit,
      price: data.price,
      importPrice: data.importPrice,
      sizes: data.sizes ?? [],
      description: data.description ?? "",
      images: (data.images ?? []) as unknown as Prisma.InputJsonValue,
    },
  });
};
