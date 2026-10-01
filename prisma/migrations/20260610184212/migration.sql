/*
  Warnings:

  - A unique constraint covering the columns `[nfc_uid]` on the table `Comanda` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `comanda` ADD COLUMN `nfc_uid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `terminal` ADD COLUMN `exige_cliente_comanda` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Comanda_nfc_uid_key` ON `Comanda`(`nfc_uid`);

-- CreateIndex
CREATE INDEX `Comanda_nfc_uid_idx` ON `Comanda`(`nfc_uid`);
