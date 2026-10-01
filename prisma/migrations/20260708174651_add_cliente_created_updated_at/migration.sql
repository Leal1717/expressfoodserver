/*
  Warnings:

  - Added the required columns `created_at`, `updated_at` to the `Cliente` table.
    Both get a DEFAULT CURRENT_TIMESTAMP(3) so existing rows backfill safely
    (the table already has data) — Prisma Client still sets `updated_at`
    explicitly on every write going forward.

*/
-- AlterTable
ALTER TABLE `cliente`
  ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
