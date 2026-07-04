-- Add DB-level defaults for UUID (id) and timestamps on all tables

-- roles
ALTER TABLE "roles"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "updatedAt" SET DEFAULT now();

-- profiles
ALTER TABLE "profiles"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "updatedAt" SET DEFAULT now();

-- products
ALTER TABLE "products"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "updatedAt" SET DEFAULT now();

-- product_skus
ALTER TABLE "product_skus"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "updatedAt" SET DEFAULT now();

-- inventories
ALTER TABLE "inventories"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "updatedAt" SET DEFAULT now();

-- vouchers
ALTER TABLE "vouchers"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "updatedAt" SET DEFAULT now();
