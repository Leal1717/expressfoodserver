/*
  Warnings:

  - You are about to drop the column `tipo` on the `itemsubitem` table. All the data in the column will be lost.
  - You are about to alter the column `quantidade` on the `itemsubitem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE `itemsubitem` DROP COLUMN `tipo`,
    ADD COLUMN `preco` DECIMAL(10, 2) NULL,
    MODIFY `quantidade` DECIMAL(10, 3) NOT NULL;
