-- Add DB-level defaults for UUID (id) on all tables

ALTER TABLE "roles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "profiles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "products" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "product_skus" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "inventories" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "vouchers" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
