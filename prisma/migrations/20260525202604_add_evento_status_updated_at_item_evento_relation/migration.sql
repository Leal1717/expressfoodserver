/*
  Warnings:

  - Added the required column `updated_at` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `evento` ADD COLUMN `status` ENUM('ATIVO', 'CANCELADO', 'ENCERRADO') NOT NULL DEFAULT 'ATIVO',
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `descricao` TEXT NULL;

-- AlterTable
ALTER TABLE `item` ADD COLUMN `evento_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_evento_id_fkey` FOREIGN KEY (`evento_id`) REFERENCES `Evento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
