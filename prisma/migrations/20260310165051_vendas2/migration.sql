/*
  Warnings:

  - Added the required column `empresa_id` to the `Venda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `venda` ADD COLUMN `empresa_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Venda_empresa_id_idx` ON `Venda`(`empresa_id`);

-- AddForeignKey
ALTER TABLE `Venda` ADD CONSTRAINT `Venda_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
