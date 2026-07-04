/*
  Warnings:

  - The primary key for the `inventories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `refOrderId` column on the `inventories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `product_skus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `voucher_products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vouchers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `inventories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `skuId` on the `inventories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `product_skus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `product_skus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `roles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `voucherId` on the `voucher_products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `voucher_products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `vouchers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_skuId_fkey";

-- DropForeignKey
ALTER TABLE "product_skus" DROP CONSTRAINT "product_skus_productId_fkey";

-- DropForeignKey
ALTER TABLE "voucher_products" DROP CONSTRAINT "voucher_products_productId_fkey";

-- DropForeignKey
ALTER TABLE "voucher_products" DROP CONSTRAINT "voucher_products_voucherId_fkey";

-- AlterTable
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "skuId",
ADD COLUMN     "skuId" UUID NOT NULL,
DROP COLUMN "refOrderId",
ADD COLUMN     "refOrderId" UUID,
ADD CONSTRAINT "inventories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product_skus" DROP CONSTRAINT "product_skus_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" UUID NOT NULL,
ADD CONSTRAINT "product_skus_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "products" DROP CONSTRAINT "products_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "voucher_products" DROP CONSTRAINT "voucher_products_pkey",
DROP COLUMN "voucherId",
ADD COLUMN     "voucherId" UUID NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" UUID NOT NULL,
ADD CONSTRAINT "voucher_products_pkey" PRIMARY KEY ("voucherId", "productId");

-- AlterTable
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "product_skus" ADD CONSTRAINT "product_skus_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "product_skus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_products" ADD CONSTRAINT "voucher_products_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_products" ADD CONSTRAINT "voucher_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
