-- CreateTable
CREATE TABLE `Ficha` (
    `id` VARCHAR(191) NOT NULL,
    `numero` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `pedido_id` VARCHAR(191) NOT NULL,
    `pedido_item_id` VARCHAR(191) NOT NULL,
    `item_nome` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `preco_unit` DECIMAL(10, 2) NOT NULL,
    `entregue_em` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Ficha_pedido_item_id_key`(`pedido_item_id`),
    INDEX `Ficha_empresa_id_idx`(`empresa_id`),
    INDEX `Ficha_empresa_id_entregue_em_idx`(`empresa_id`, `entregue_em`),
    UNIQUE INDEX `Ficha_numero_empresa_id_key`(`numero`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ficha` ADD CONSTRAINT `Ficha_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ficha` ADD CONSTRAINT `Ficha_pedido_id_fkey` FOREIGN KEY (`pedido_id`) REFERENCES `Pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ficha` ADD CONSTRAINT `Ficha_pedido_item_id_fkey` FOREIGN KEY (`pedido_item_id`) REFERENCES `PedidoItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
