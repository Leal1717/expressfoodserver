/*
  Warnings:

  - A unique constraint covering the columns `[pedido_uuid]` on the table `Pedido` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `pedido` ADD COLUMN `pedido_uuid` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `MercadoPagoCredencial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `mp_user_id` VARCHAR(191) NOT NULL,
    `access_token` TEXT NOT NULL,
    `refresh_token` TEXT NOT NULL,
    `public_key` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `live_mode` BOOLEAN NOT NULL DEFAULT false,
    `scope` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MercadoPagoCredencial_empresa_id_key`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Pedido_pedido_uuid_key` ON `Pedido`(`pedido_uuid`);

-- AddForeignKey
ALTER TABLE `MercadoPagoCredencial` ADD CONSTRAINT `MercadoPagoCredencial_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
