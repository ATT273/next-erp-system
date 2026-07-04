import { prisma } from "@/libs/prisma";
import { IProductImage, IProductSKUImage, IProductSku, ProductType } from "@/types/responses/product.response";

export const getProductDetails = async (id: string): Promise<ProductType | null> => {
  const result = await prisma.product.findUnique({
    where: { id },
    include: {
      skus: true,
    },
  });

  if (!result) return null;

  return {
    id: result.id,
    name: result.name,
    description: result.description ?? "",
    price: result.price,
    importPrice: result.importPrice,
    mainCategory: Number(result.mainCategory),
    subCategory: Number(result.subCategory),
    unit: result.unit,
    qty: result.qty,
    sizes: result.sizes as string[],
    images: result.images as unknown as IProductImage[],
    skus: result.skus.map((sku): IProductSku => ({
      id: sku.id,
      sku: sku.sku,
      size: "",
      qty: sku.qty,
      price: sku.price,
      images: sku.images as unknown as IProductSKUImage[],
    })),
  };
};
