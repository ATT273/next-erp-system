-- AlterTable profiles: rename active -> isOnline, replace isDeleted with deletedAt
ALTER TABLE "profiles"
  DROP COLUMN "active",
  DROP COLUMN "isDeleted",
  ADD COLUMN "isOnline" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "deletedAt" TIMESTAMPTZ;
