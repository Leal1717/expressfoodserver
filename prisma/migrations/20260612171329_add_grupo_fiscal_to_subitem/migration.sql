/*
  Warnings:

  - You are about to drop the column `estoque_maximo` on the `estoqueposicao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `estoqueposicao` DROP COLUMN `estoque_maximo`;

-- AlterTable
ALTER TABLE `subitem` ADD COLUMN `grupo_fiscal_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Subitem` ADD CONSTRAINT `Subitem_grupo_fiscal_id_fkey` FOREIGN KEY (`grupo_fiscal_id`) REFERENCES `GrupoFiscal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
