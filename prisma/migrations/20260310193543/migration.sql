/*
  Warnings:

  - Added the required column `usuario_id` to the `Venda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `ativo` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `venda` ADD COLUMN `usuario_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Venda_usuario_id_idx` ON `Venda`(`usuario_id`);

-- AddForeignKey
ALTER TABLE `Venda` ADD CONSTRAINT `Venda_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
