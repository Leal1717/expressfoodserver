-- AlterTable
ALTER TABLE `pedido` ADD COLUMN `rota_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `Rota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA') NOT NULL DEFAULT 'EM_ANDAMENTO',
    `criado_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `saiu_at` DATETIME(3) NULL,
    `concluido_at` DATETIME(3) NULL,
    `motoboy_id` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `Rota_empresa_id_idx`(`empresa_id`),
    INDEX `Rota_empresa_id_status_idx`(`empresa_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rota` ADD CONSTRAINT `Rota_motoboy_id_fkey` FOREIGN KEY (`motoboy_id`) REFERENCES `Motoboy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rota` ADD CONSTRAINT `Rota_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_rota_id_fkey` FOREIGN KEY (`rota_id`) REFERENCES `Rota`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
