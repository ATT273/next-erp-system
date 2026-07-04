import { prisma } from "@/libs/prisma";
import { IProductForm } from "@/types/product.type";

export const createProduct = async (data: IProductForm) => {
  return prisma.product.create({
    data: {
      name: data.name,
      mainCategory: data.mainCategory,
      subCategory: data.subCategory,
      unit: data.unit,
      price: data.price,
      importPrice: data.importPrice,
      sizes: data.sizes ?? [],
      description: data.description ?? "",
    },
  });
};
