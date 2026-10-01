-- AlterTable
ALTER TABLE `empresa` ADD COLUMN `gorjeta_percentual` DECIMAL(5, 2) NULL;

-- AlterTable
ALTER TABLE `pedido` ADD COLUMN `gorjeta` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `vendahistorico` ADD COLUMN `gorjeta` DECIMAL(10, 2) NOT NULL DEFAULT 0;
